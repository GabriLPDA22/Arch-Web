// arch-web/src/stores/auth.store.ts
import { defineStore } from 'pinia';
import router from '@/router';
import AuthService from '@/services/AuthService';
import type { UserAuthDto } from '@/services/Api';

interface AuthState {
  user: UserAuthDto | null;
  token: string | null;
  returnUrl: string | null;
  loginError: string | null;
}

const getStoredUser = (): UserAuthDto | null => {
  const user = localStorage.getItem('user');
  return user ? (JSON.parse(user) as UserAuthDto) : null;
};

const getStoredToken = (): string | null => {
  return localStorage.getItem('token');
};

// 📝 Mensajes de error (diferenciando credenciales vs permisos)
const ERROR_MESSAGES: Record<string, string> = {
  'Invalid email or password': 'Invalid credentials. Please check your email and password.',
  'Invalid credentials': 'Invalid credentials. Please check your email and password.',
  'User not found': 'Invalid credentials. Please check your email and password.',
  'Incorrect password': 'Invalid credentials. Please check your email and password.',
  'NOT_ADMIN': 'Unauthorized. You don\'t have admin access to this area.', // 👈 Específico para no-admin
  'Unauthorized': 'Unauthorized. You don\'t have admin access to this area.',
  'Account locked': 'Your account has been temporarily locked. Please contact support.',
  'Network Error': 'Unable to connect to the server. Please check your internet connection.',
  'Timeout': 'The request took too long. Please try again.',
  'Server Error': 'Something went wrong on our server. We are working on it.',
};

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
    userName: (state) => state.user?.name || state.user?.email?.split('@')[0] || 'Usuario',
  },

  actions: {
    // 🔄 Función helper para traducir errores técnicos a mensajes comprensibles
    translateError(error: any): string {
      // Si el error tiene un mensaje conocido, lo traducimos
      const errorMessage = error?.message || error?.toString() || '';
      const errorCode = error?.code || error?.response?.data?.code; // 👈 Detectar código de error
      
      // Primero verificar si hay un código específico (como NOT_ADMIN)
      if (errorCode && ERROR_MESSAGES[errorCode]) {
        return ERROR_MESSAGES[errorCode];
      }

      // Buscar coincidencia exacta en el mensaje
      if (ERROR_MESSAGES[errorMessage]) {
        return ERROR_MESSAGES[errorMessage];
      }

      // Buscar coincidencia parcial (por si el mensaje incluye más texto)
      for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
        if (errorMessage.includes(key)) {
          return value;
        }
      }

      // Si es un error de red
      if (!navigator.onLine) {
        return 'No internet connection. Please check your network and try again.';
      }

      // Mensaje genérico de seguridad (NO revelar detalles)
      return 'Invalid credentials. Please try again.';
    },

    async login(email: string, password: string) {
      this.loginError = null;
      
      try {
        const response = await AuthService.login(email, password);
        const { user, token } = response;

        if (user && token) {
          // ✅ Login exitoso - el backend ya verificó que es admin
          this.user = user;
          this.token = token;

          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', token);

          // Redirigir al dashboard
          await router.push(this.returnUrl || '/admin');
        } else {
          throw new Error('Invalid login response');
        }
      } catch (error: any) {
        console.error('❌ Login error:', error);
        
        // 📝 Convertir error técnico a mensaje comprensible
        // Si el backend devuelve code: "NOT_ADMIN", mostrará el mensaje de unauthorized
        this.loginError = this.translateError(error);
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      this.returnUrl = null;
      this.loginError = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      router.push('/login');
    },

    clearError() {
      this.loginError = null;
    },
  },
});