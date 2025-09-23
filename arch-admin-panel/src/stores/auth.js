import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
  // State
  const user = ref(null);
  const token = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  // Computed
  const isAuthenticated = computed(() => !!token.value && !!user.value);

  const isAdmin = computed(() => {
    return user.value?.userType === "admin";
  });

  // Actions básicas para empezar
  const login = async (credentials) => {
    isLoading.value = true;
    error.value = null;

    try {
      // TODO: Implementar llamada real a la API
      console.log("Login attempt:", credentials);

      // Simulación temporal para desarrollo
      if (
        credentials.email === "admin@arch.ox.ac.uk" &&
        credentials.password === "admin123"
      ) {
        const mockUser = {
          userID: "1",
          name: "Administrator",
          email: "admin@arch.ox.ac.uk",
          userType: "admin",
          isVerified: true,
        };

        const mockToken = "mock-jwt-token-for-development";

        user.value = mockUser;
        token.value = mockToken;

        // Guardar en localStorage
        localStorage.setItem("arch_access_token", mockToken);
        localStorage.setItem("arch_user_data", JSON.stringify(mockUser));

        return { success: true };
      } else {
        throw new Error("Credenciales inválidas");
      }
    } catch (err) {
      error.value = err.message;
      return { success: false, error: err.message };
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    user.value = null;
    token.value = null;
    error.value = null;

    // Limpiar localStorage
    localStorage.removeItem("arch_access_token");
    localStorage.removeItem("arch_user_data");
  };

  const checkAuth = async () => {
    const storedToken = localStorage.getItem("arch_access_token");
    const storedUser = localStorage.getItem("arch_user_data");

    if (!storedToken || !storedUser) {
      return false;
    }

    try {
      const userData = JSON.parse(storedUser);

      // Verificar que el usuario sea admin
      if (userData.userType !== "admin") {
        await logout();
        return false;
      }

      user.value = userData;
      token.value = storedToken;
      return true;
    } catch (err) {
      await logout();
      return false;
    }
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    // State
    user,
    token,
    isLoading,
    error,

    // Computed
    isAuthenticated,
    isAdmin,

    // Actions
    login,
    logout,
    checkAuth,
    clearError,
  };
});
