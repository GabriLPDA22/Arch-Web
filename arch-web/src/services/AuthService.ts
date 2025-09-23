// src/services/AuthService.ts
import apiClient from './ApiService';

// --- Interfaces basadas en tus DTOs de C# ---
// (Las definimos aquí mismo para que el script sea autocontenido)
export interface UserAuthDto {
  userID: string;
  name: string;
  email: string;
  userType: string; // ¡La clave!
  isVerified: boolean;
  dateOfBirth?: string;
  profilePicture?: string;
  preferences?: string[];
}

export interface AuthResponseDto {
  success: boolean;
  message?: string;
  user?: UserAuthDto;
  token?: string;
  refreshToken?: string;
}

class AuthService {
  /**
   * Envía las credenciales al backend (POST /api/Auth/login)
   * Tipamos la respuesta de la promesa
   */
  login(email: string, password: string): Promise<{ data: AuthResponseDto }> {
    return apiClient.post<AuthResponseDto>('/Auth/login', {
      email: email,
      password: password,
      rememberMe: true,
    });
  }

  /**
   * Valida el token actual (GET /api/Auth/validate-token)
   */
  validateToken() {
    return apiClient.get('/Auth/validate-token');
  }
}

// Exportamos una instancia única (Singleton)
export default new AuthService();
