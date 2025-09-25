import { AuthApi } from './Api';
import type { AuthResponseDto } from './Api';

const AuthService = {
  login: async (email: string, password: string): Promise<AuthResponseDto> => {
    try {
      const response = await AuthApi.login(email, password);
      return response;
    } catch (error) {
      console.error("Error en AuthService.login:", error);
      throw error;
    }
  },
};

// ¡La clave es esta línea de aquí abajo!
export default AuthService;
