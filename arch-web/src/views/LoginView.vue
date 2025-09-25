<template>
  <div class="login-page">
    <div class="login-box">
      <h2 class="title">
        Dashboard Login
      </h2>
      <form class="login-form" @submit.prevent="handleLogin">
        <div>
          <label for="email">Email</label>
          <input
            type="email"
            v-model="email"
            id="email"
            required
          />
        </div>
        <div>
          <label for="password">Contraseña</label>
          <input
            type="password"
            v-model="password"
            id="password"
            required
          />
        </div>
        <div>
          <button type="submit" :disabled="isLoading">
            {{ isLoading ? 'Cargando...' : 'Entrar' }}
          </button>
        </div>
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const authStore = useAuthStore()
const errorMessage = computed(() => authStore.loginError)

const handleLogin = async () => {
  isLoading.value = true
  await authStore.login(email.value, password.value)
  isLoading.value = false
}
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f4f7f6; /* bg-gray-100 */
}
.login-box {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background-color: white;
  border-radius: 0.5rem; /* rounded-lg */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
}
.title {
  font-size: 1.5rem; /* text-2xl */
  font-weight: 700;
  text-align: center;
  color: #1a202c; /* text-gray-900 */
}
.login-form {
  margin-top: 1.5rem;
}
.login-form div {
  margin-bottom: 1.5rem;
}
.login-form label {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.875rem; /* text-sm */
  font-weight: 500;
  color: #4a5568; /* text-gray-700 */
}
.login-form input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #cbd5e0; /* border-gray-300 */
  border-radius: 0.375rem; /* rounded-md */
  box-sizing: border-box; /* Añadido para padding correcto */
}
button {
  width: 100%;
  padding: 0.5rem 1rem;
  font-weight: 500;
  color: white;
  background-color: #4f46e5; /* bg-indigo-600 */
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
}
button:hover {
  background-color: #4338ca; /* hover:bg-indigo-700 */
}
button:disabled {
  background-color: #a0aec0; /* bg-gray-400 */
  cursor: not-allowed;
}
.error-message {
  font-size: 0.875rem;
  color: #e53e3e; /* text-red-600 */
  text-align: center;
}
</style>
