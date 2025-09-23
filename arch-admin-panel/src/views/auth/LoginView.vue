<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">

      <!-- Header con Logo Oxford -->
      <div class="text-center">
        <div class="mx-auto h-20 w-20 flex items-center justify-center rounded-full oxford-gradient mb-6 shadow-lg">
          <svg class="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
        </div>

        <h2 class="text-3xl font-bold text-gray-900 mb-2">
          Panel de Administración
        </h2>
        <p class="text-sm text-gray-600 mb-6">
          ARCH - Oxford Events Management System
        </p>

        <!-- Alertas de Error -->
        <div v-if="route.query.error === 'access_denied'" class="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
          <div class="flex items-center">
            <svg class="h-5 w-5 text-red-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p class="text-sm text-red-700">
              Acceso denegado. Solo administradores pueden acceder a este panel.
            </p>
          </div>
        </div>

        <div v-if="route.query.error === 'session_error'" class="mb-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
          <div class="flex items-center">
            <svg class="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p class="text-sm text-yellow-700">
              Tu sesión ha expirado. Por favor, inicia sesión nuevamente.
            </p>
          </div>
        </div>

        <!-- Error General -->
        <div v-if="error" class="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
          <div class="flex items-center">
            <svg class="h-5 w-5 text-red-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p class="text-sm text-red-700">{{ error }}</p>
          </div>
        </div>

        <!-- Success Alert -->
        <div v-if="successMessage" class="mb-4 p-3 rounded-lg bg-green-50 border border-green-200">
          <div class="flex items-center">
            <svg class="h-5 w-5 text-green-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm text-green-700">{{ successMessage }}</p>
          </div>
        </div>
      </div>

      <!-- Formulario de Login -->
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-4">

          <!-- Campo Email -->
          <div>
            <label for="email" class="form-label">
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              Correo Electrónico
            </label>
            <div class="relative">
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                v-model="form.email"
                :disabled="isLoading"
                class="form-input"
                :class="{
                  'border-red-300 focus:ring-red-500 focus:border-red-500': emailError,
                  'opacity-50 cursor-not-allowed': isLoading
                }"
                placeholder="admin@arch.ox.ac.uk"
                @blur="validateEmail"
                @input="clearErrors"
              />
            </div>
            <p v-if="emailError" class="form-error">{{ emailError }}</p>
          </div>

          <!-- Campo Password -->
          <div>
            <label for="password" class="form-label">
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Contraseña
            </label>
            <div class="relative">
              <input
                id="password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                v-model="form.password"
                :disabled="isLoading"
                class="form-input pr-10"
                :class="{
                  'border-red-300 focus:ring-red-500 focus:border-red-500': passwordError,
                  'opacity-50 cursor-not-allowed': isLoading
                }"
                placeholder="Tu contraseña"
                @blur="validatePassword"
                @input="clearErrors"
              />

              <!-- Botón Ver/Ocultar Password -->
              <button
                type="button"
                @click="showPassword = !showPassword"
                :disabled="isLoading"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
              >
                <svg v-if="!showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              </button>
            </div>
            <p v-if="passwordError" class="form-error">{{ passwordError }}</p>
          </div>

          <!-- Remember Me -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                v-model="form.rememberMe"
                :disabled="isLoading"
                class="form-checkbox"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Recordarme
              </label>
            </div>

            <!-- Link Forgot Password (para futuro) -->
            <div class="text-sm">
              <a href="#" class="font-medium text-oxford hover:text-oxford-light transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>
        </div>

        <!-- Botón Submit -->
        <div>
          <button
            type="submit"
            :disabled="!isFormValid || isLoading"
            class="group relative w-full flex justify-center py-3 px-4 text-sm font-medium rounded-lg text-white oxford-gradient focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-oxford disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <LoadingSpinner v-if="isLoading" size="sm" color="white" />
              <svg v-else class="h-5 w-5 text-white group-hover:text-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </div>

        <!-- Info de Desarrollo -->
        <div v-if="isDevelopment" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-start">
            <svg class="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="text-sm">
              <h4 class="font-medium text-blue-800 mb-2">
                🛠️ Modo Desarrollo
              </h4>
              <p class="text-blue-700 mb-2">
                Credenciales de prueba (automáticamente rellenadas):
              </p>
              <div class="text-xs text-blue-700 font-mono bg-blue-100 p-2 rounded mb-2">
                <p><strong>Email:</strong> admin@arch.ox.ac.uk</p>
                <p><strong>Password:</strong> admin123</p>
              </div>
              <p class="text-xs text-blue-600">
                <strong>Backend:</strong> {{ apiBaseUrl }}
              </p>
            </div>
          </div>
        </div>

        <!-- Información Adicional -->
        <div class="text-center">
          <p class="text-xs text-gray-600 mb-4">
            Este panel está disponible únicamente para administradores del sistema ARCH.
          </p>
          <p class="text-xs text-gray-500">
            ARCH Admin Panel v1.0.0 - Oxford University Events Management
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const authStore = useAuthStore()

// ============ STATE ============
const form = ref({
  email: '',
  password: '',
  rememberMe: false
})

const showPassword = ref(false)
const emailError = ref('')
const passwordError = ref('')
const error = ref('')
const successMessage = ref('')

// ============ COMPUTED ============
const isLoading = computed(() => authStore.isLoading)

const isFormValid = computed(() => {
  return form.value.email &&
         form.value.password &&
         !emailError.value &&
         !passwordError.value
})

const isDevelopment = computed(() => import.meta.env.DEV)

const apiBaseUrl = computed(() => import.meta.env.VITE_API_URL || 'http://localhost:5011/api')

// ============ METHODS ============
const validateEmail = () => {
  emailError.value = ''

  if (!form.value.email) {
    emailError.value = 'El correo electrónico es obligatorio'
    return false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.value.email)) {
    emailError.value = 'Ingresa un correo electrónico válido'
    return false
  }

  return true
}

const validatePassword = () => {
  passwordError.value = ''

  if (!form.value.password) {
    passwordError.value = 'La contraseña es obligatoria'
    return false
  }

  if (form.value.password.length < 6) {
    passwordError.value = 'La contraseña debe tener al menos 6 caracteres'
    return false
  }

  return true
}

const clearErrors = () => {
  error.value = ''
  emailError.value = ''
  passwordError.value = ''
  authStore.clearError()
}

const handleSubmit = async () => {
  clearErrors()

  // Validar formulario
  const emailValid = validateEmail()
  const passwordValid = validatePassword()

  if (!emailValid || !passwordValid) {
    return
  }

  try {
    const result = await authStore.login({
      email: form.value.email,
      password: form.value.password,
      rememberMe: form.value.rememberMe
    })

    if (result.success) {
      successMessage.value = '¡Inicio de sesión exitoso!'

      // Mostrar toast de éxito
      toast.success('¡Bienvenido al Panel de Administración!')

      // Redirigir después de un breve delay
      setTimeout(() => {
        const redirectPath = route.query.redirect || '/dashboard'
        router.push(redirectPath)
      }, 1000)
    } else {
      error.value = result.error || 'Error de autenticación'
      toast.error(error.value)
    }
  } catch (err) {
    error.value = err.message || 'Error inesperado durante el inicio de sesión'
    toast.error(error.value)
  }
}

const fillDemoCredentials = () => {
  form.value.email = 'admin@arch.ox.ac.uk'
  form.value.password = 'admin123'
}

// ============ LIFECYCLE ============
onMounted(() => {
  // Limpiar errores previos
  authStore.clearError()

  // Si ya está autenticado y es admin, redirigir
  if (authStore.isAuthenticated && authStore.isAdmin) {
    router.push('/dashboard')
    return
  }

  // Manejar mensajes de success de otras rutas
  if (route.query.success === 'password_reset') {
    successMessage.value = 'Contraseña restablecida correctamente. Puedes iniciar sesión ahora.'
  }

  // Auto-rellenar credenciales en desarrollo
  if (isDevelopment.value) {
    fillDemoCredentials()
  }
})
</script>

<style scoped>
/* Animaciones adicionales para mejor UX */
.oxford-gradient {
  background: linear-gradient(135deg, #003366 0%, #1a4d73 100%);
}

.oxford-gradient:hover {
  background: linear-gradient(135deg, #1a4d73 0%, #003366 100%);
}

/* Efectos de focus mejorados */
.form-input:focus {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 51, 102, 0.15);
}

/* Hover effects para botones */
.group:hover {
  box-shadow: 0 10px 25px rgba(0, 51, 102, 0.25);
}
</style>
