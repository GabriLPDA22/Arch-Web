import axios from 'axios'

class ApiService {
  constructor() {
    // URL base de tu backend .NET
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5011/api'

    // Configurar cliente axios
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Interceptor para incluir token automáticamente
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Interceptor para manejar errores de respuesta
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expirado - limpiar y redirigir
          this.clearTokens()
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // ============ GESTIÓN DE TOKENS ============

  getToken() {
    return localStorage.getItem('arch_access_token')
  }

  setTokens(accessToken, refreshToken = null) {
    localStorage.setItem('arch_access_token', accessToken)
    if (refreshToken) {
      localStorage.setItem('arch_refresh_token', refreshToken)
    }
  }

  clearTokens() {
    localStorage.removeItem('arch_access_token')
    localStorage.removeItem('arch_refresh_token')
    localStorage.removeItem('arch_user_data')
  }

  setUserData(userData) {
    localStorage.setItem('arch_user_data', JSON.stringify(userData))
  }

  getUserData() {
    const data = localStorage.getItem('arch_user_data')
    return data ? JSON.parse(data) : null
  }

  // ============ AUTH ENDPOINTS ============

  async login(credentials) {
    try {
      const response = await this.client.post('/auth/login', credentials)

      if (response.data.success) {
        this.setTokens(response.data.token, response.data.refreshToken)
        this.setUserData(response.data.user)
      }

      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async validateToken() {
    try {
      const response = await this.client.get('/auth/validate-token')
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // ============ USER ENDPOINTS ============

  async getUsers(query = '', take = 50) {
    try {
      const params = new URLSearchParams()
      if (query) params.append('q', query)
      if (take !== 50) params.append('take', take.toString())

      const response = await this.client.get(`/users?${params}`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getUserById(id) {
    try {
      const response = await this.client.get(`/users/${id}`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getCurrentUser() {
    try {
      const response = await this.client.get('/users/me')
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // ============ ERROR HANDLING ============

  handleError(error) {
    if (error.response) {
      // Error del servidor
      return {
        success: false,
        message: error.response.data?.message || 'Error del servidor',
        status: error.response.status
      }
    } else if (error.request) {
      // Error de red
      return {
        success: false,
        message: 'Error de conexión. Verifica tu internet.',
        status: 0
      }
    } else {
      // Error de configuración
      return {
        success: false,
        message: error.message || 'Error desconocido',
        status: 0
      }
    }
  }
}

export default new ApiService()
