<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="mx-auto h-24 w-24 flex items-center justify-center rounded-full oxford-gradient mb-6">
          <svg class="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>

        <h2 class="text-3xl font-bold text-gray-900 mb-2">
          Panel de Administración
        </h2>
        <p class="text-sm text-gray-600 mb-6">
          ARCH - Oxford Events Management
        </p>

        <!-- Error Alert -->
        <div v-if="error" class="mb-4 p-3 rounded-md bg-red-50 border border-red-200">
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>
      </div>

      <!-- Login Form -->
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <!-- Email Field -->
          <div>
            <label for="email" class="form-label">
              Correo Electrónico
            </label>
            <input id="email" name="email" type="email" required v-model="form.email" :disabled="isLoading"
              class="form-input" placeholder="admin@arch.ox.ac.uk" />
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="form-label">
              Contraseña
            </label>
            <input id="password" name="password" type="password" required v-model="form.password" :disabled="isLoading"
              class="form-input" placeholder="Tu contraseña" />
          </div>
        </div>

        <!-- Submit Button -->
        <div>
          <button type="submit" :disabled="!isFormValid || isLoading"
            class="btn btn-primary w-full py-3 oxford-gradient">
            <div v-if="isLoading" class="spinner mr-2"></div>
            {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </div>

        <!-- Development Info -->
        <div class="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-left">
          <h4 class="text-sm font-medium text-yellow-800 mb-2">
            🛠️ Modo Desarrollo
          </h4>
          <p class="text-xs text-yellow-700 mb-2">
            Credenciales de prueba:
          </p>
          <div class="text-xs text-yellow-700 font-mono bg-yellow-100 p-2 rounded">
            <p><strong>Email:</strong> admin@arch.ox.ac.uk</p>
            <p><strong>Password:</strong> admin123</p>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// State
const form = ref({
  email: 'admin@arch.ox.ac.uk', // Pre-rellenado para desarrollo
  password: 'admin123'
})

const error = ref('')

// Computed
const isLoading = computed(() => authStore.isLoading)

const isFormValid = computed(() => {
  return form.value.email && form.value.password
})

// Methods
const handleSubmit = async () => {
  error.value = ''

  try {
    const result = await authStore.login({
      email: form.value.email,
      password: form.value.password
    })

    if (result.success) {
      router.push('/dashboard')
    } else {
      error.value = result.error || 'Error de autenticación'
    }
  } catch (err) {
    error.value = err.message || 'Error inesperado durante el inicio de sesión'
  }
}

// Lifecycle
onMounted(() => {
  // Si ya está autenticado, redirigir al dashboard
  if (authStore.isAuthenticated && authStore.isAdmin) {
    router.push('/dashboard')
  }
})
</script>
