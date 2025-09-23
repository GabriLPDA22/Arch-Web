<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center">
      <!-- 404 Illustration -->
      <div class="mb-8">
        <div
          class="mx-auto h-32 w-32 flex items-center justify-center rounded-full bg-oxford text-white text-6xl font-bold">
          404
        </div>
      </div>

      <!-- Error Message -->
      <h1 class="text-3xl font-bold text-gray-900 mb-4">
        Página no encontrada
      </h1>

      <p class="text-gray-600 mb-8 leading-relaxed">
        Lo sentimos, no pudimos encontrar la página que estás buscando.
        Es posible que la URL esté mal escrita o que la página haya sido movida.
      </p>

      <!-- Action Buttons -->
      <div class="space-y-4">
        <router-link to="/dashboard" class="btn btn-primary w-full">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Volver al Dashboard
        </router-link>

        <button @click="goBack" class="btn btn-secondary w-full">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Página Anterior
        </button>
      </div>

      <!-- Help Links -->
      <div class="mt-8 pt-8 border-t border-gray-200">
        <p class="text-sm text-gray-500 mb-4">
          ¿Necesitas ayuda? Prueba estos enlaces:
        </p>

        <div class="space-y-2 text-sm">
          <router-link to="/dashboard" class="block text-oxford hover:text-oxford-light">
            🏠 Página de inicio
          </router-link>
          <a href="mailto:support@arch.ox.ac.uk" class="block text-oxford hover:text-oxford-light">
            📧 Contactar soporte
          </a>
        </div>
      </div>
    </div>

    <!-- Background Pattern -->
    <div class="fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute -top-40 -right-32 w-96 h-96 rounded-full bg-oxford opacity-5"></div>
      <div class="absolute -bottom-40 -left-32 w-96 h-96 rounded-full bg-gold opacity-5"></div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  // Si hay historial, volver atrás. Si no, ir al dashboard
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/dashboard')
  }
}
</script>
