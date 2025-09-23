import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiService from '@/services/apiService'

export const useAuthStore = defineStore('auth', () => {
  // ============ STATE ============
  const user = ref(null)
  const token = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // ============ COMPUTED ============
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const isAdmin = computed(() => {
    return user.value?.userType === 'admin'
  })

  const canManageUsers = computed(() => isAdmin.value)
  const canManageEvents = computed(() => isAdmin.value)
  const canManageCoupons = computed(() => isAdmin.value)
  const canViewDashboard = computed(() => isAdmin.value)

  // ============ ACTIONS ============

  const login = async (credentials) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiService.login(credentials)

      if (response.success) {
        // CRÍTICO: Verificar que el usuario sea admin
        if (response.user.userType !== 'admin') {
          throw new Error('Acceso denegado. Solo administradores pueden acceder.')
        }

        user.value = response.user
        token.value = response.token

        return { success: true }
      } else {
        throw new Error(response.message || 'Error de autenticación')
      }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      // Limpiar tokens del servicio
      apiService.clearTokens()
    } catch (err) {
      console.error('Error during logout:', err)
    } finally {
      // Limpiar estado local
      user.value = null
      token.value = null
      error.value = null
    }
  }

  const checkAuth = async () => {
    const storedToken = apiService.getToken()
    const storedUser = apiService.getUserData()

    if (!storedToken || !storedUser) {
      return false
    }

    // CRÍTICO: Verificar que el usuario sea admin
    if (storedUser.userType !== 'admin') {
      await logout()
      return false
    }

    try {
      const response = await apiService.validateToken()

      if (response.valid) {
        user.value = storedUser
        token.value = storedToken
        return true
      } else {
        await logout()
        return false
      }
    } catch (err) {
      await logout()
      return false
    }
  }

  const updateUser = (userData) => {
    if (user.value) {
      user.value = { ...user.value, ...userData }
      apiService.setUserData(user.value)
    }
  }

  const clearError = () => {
    error.value = null
  }

  // ============ DEVELOPMENT HELPERS ============

  // Solo para desarrollo - login con credenciales mock
  const devLogin = async (credentials) => {
    if (import.meta.env.DEV) {
      if (credentials.email === 'admin@arch.ox.ac.uk' && credentials.password === 'admin123') {
        const mockUser = {
          userID: '1',
          name: 'Administrator',
          email: 'admin@arch.ox.ac.uk',
          userType: 'admin',
          isVerified: true
        }

        const mockToken = 'dev-token-' + Date.now()

        user.value = mockUser
        token.value = mockToken

        // Guardar en localStorage para persistencia
        apiService.setTokens(mockToken)
        apiService.setUserData(mockUser)

        return { success: true }
      }
    }

    // Si no es dev o credenciales incorrectas, usar login real
    return await login(credentials)
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,

    // Computed
    isAuthenticated,
    isAdmin,
    canManageUsers,
    canManageEvents,
    canManageCoupons,
    canViewDashboard,

    // Actions
    login: import.meta.env.DEV ? devLogin : login, // Usar mock en dev
    logout,
    checkAuth,
    updateUser,
    clearError
  }
})
