// arch-web/src/stores/auth.store.ts
import { defineStore } from 'pinia'
import router from '@/router'
import { AuthApi, type UserDetailDto } from '@/services/Api'
import type { UserAuthDto } from '@/services/Api'

interface AuthState {
  user: UserAuthDto | null
  token: string | null
  returnUrl: string | null
  loginError: string | null
}

const getStoredUser = (): UserAuthDto | null => {
  const user = localStorage.getItem('user')
  return user ? (JSON.parse(user) as UserAuthDto) : null
}

const getStoredToken = (): string | null => {
  return localStorage.getItem('token')
}

const ERROR_MESSAGES: Record<string, string> = {
  'Invalid email or password': 'Invalid credentials. Please check your email and password.',
  'Invalid credentials': 'Invalid credentials. Please check your email and password.',
  'User not found': 'Invalid credentials. Please check your email and password.',
  'Incorrect password': 'Invalid credentials. Please check your email and password.',
  NOT_ADMIN: "Unauthorized. You don't have the required permissions.",
  Unauthorized: "Unauthorized. You don't have the required permissions.",
  'Account locked': 'Your account has been temporarily locked. Please contact support.',
  'Network Error': 'Unable to connect to the server. Please check your internet connection.',
  Timeout: 'The request took too long. Please try again.',
  'Server Error': 'Something went wrong on our server. We are working on it.',
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: getStoredUser(),
    token: getStoredToken(),
    returnUrl: null,
    loginError: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => state.user?.userType === 'admin',
    isModerator: (state) => state.user?.userType === 'moderator',
    canManagePanel: (state) =>
      state.user?.userType === 'admin' || state.user?.userType === 'moderator',
    userName: (state) => state.user?.name || state.user?.email?.split('@')[0] || 'Usuario',
  },

  actions: {
    translateError(error: any): string {
      const errorMessage = error?.message || error?.toString() || ''
      const errorCode = error?.code || error?.response?.data?.code

      if (errorCode && ERROR_MESSAGES[errorCode]) {
        return ERROR_MESSAGES[errorCode]
      }

      if (ERROR_MESSAGES[errorMessage]) {
        return ERROR_MESSAGES[errorMessage]
      }

      for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
        if (errorMessage.includes(key)) {
          return value
        }
      }

      if (!navigator.onLine) {
        return 'No internet connection. Please check your network and try again.'
      }

      return 'Invalid credentials. Please try again.'
    },

    async login(email: string, password: string) {
      this.loginError = null

      try {
        const response = await AuthApi.login(email, password)
        const { user, token } = response

        if (user && token && (user.userType === 'admin' || user.userType === 'moderator')) {
          this.user = user
          this.token = token

          localStorage.setItem('user', JSON.stringify(user))
          localStorage.setItem('token', token)

          await router.push(this.returnUrl || '/admin')
        } else if (user && token) {
          throw new Error('Unauthorized')
        } else {
          throw new Error('Invalid login response')
        }
      } catch (error: any) {
        console.error('❌ Login error:', error)
        this.loginError = this.translateError(error)
      }
    },

    async validateSession() {
      if (!this.token) {
        return
      }
      try {
        const freshUserData: UserDetailDto = await AuthApi.verifySession()

        // ✨ CORRECCIÓN AQUÍ ✨
        // Añadimos la propiedad 'isVerified' que faltaba
        const userToStore: UserAuthDto = {
          userID: freshUserData.userID,
          email: freshUserData.email,
          name: freshUserData.name,
          userType: freshUserData.userType,
          isVerified: freshUserData.isVerified, // <- Línea añadida
        }

        this.user = userToStore
        localStorage.setItem('user', JSON.stringify(userToStore))
      } catch (error) {
        console.error('Session validation failed, logging out.', error)
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.returnUrl = null
      this.loginError = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      router.push('/login')
    },

    clearError() {
      this.loginError = null
    },
  },
})
