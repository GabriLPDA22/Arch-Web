// src/stores/auth.store.ts
import { defineStore } from 'pinia';
import AuthService from '@/services/AuthService';
import router from '@/router';
// Importamos los tipos
import type { UserAuthDto } from '@/services/AuthService';

// 1. Definimos la forma del State como una interfaz
interface AuthState {
  user: UserAuthDto | null;
  token: string | null;
  returnUrl: string | null;
  loginError: string | null;
}

// Helpers para cargar desde localStorage (con tipado)
const getStoredUser = (): UserAuthDto | null => {
  const user = localStorage.getItem('user');
  return user ? (JSON.parse(user) as UserAuthDto) : null;
};
const getStoredToken = (): string | null => {
  return localStorage.getItem('token');
};

export const useAuthStore = defineStore('auth', {
  // 2. Proporcionamos el estado inicial usando la interfaz
  state: (): AuthState => ({
    user: getStoredUser(),
    token: getStoredToken(),
    returnUrl: null,
    loginError: null,
  }),

  getters: {
    // 3. Los getters infieren los tipos del 'state'
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => state.user?.userType === 'admin', 
  },

  actions: {
    async login(email: string, password: string) {
      this.loginError = null;
      try {
        const response = await AuthService.login(email, password);
        const { user, token } = response.data;

        if (user && token) {
          this.user = user;
          this.token = token;

          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', token);

          router.push(this.returnUrl || '/admin');
        } else {
          throw new Error(
            response.data.message || 'Respuesta de login inválida'
          );
        }
      } catch (error: any) {
        console.error(
          'Error de login:',
          error.response?.data?.message || error.message
        );
        this.loginError =
          error.response?.data?.message || 'Error al iniciar sesión.';
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
  },
});
