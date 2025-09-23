<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">

    <!-- Background Pattern -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-32 w-96 h-96 rounded-full oxford-gradient opacity-5 animate-pulse"></div>
      <div class="absolute -bottom-40 -left-32 w-96 h-96 rounded-full bg-gold opacity-5 animate-pulse"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-oxford opacity-3 animate-ping" style="animation-duration: 4s;"></div>
    </div>

    <div class="max-w-lg w-full text-center relative z-10">

      <!-- 404 Animation -->
      <div class="mb-12">
        <div class="relative">
          <!-- Main 404 Number -->
          <h1 class="text-9xl font-black text-transparent bg-clip-text oxford-gradient animate-bounce" style="animation-duration: 2s;">
            404
          </h1>

          <!-- Floating Elements -->
          <div class="absolute top-0 right-0 w-8 h-8 bg-gold rounded-full opacity-70 animate-float"></div>
          <div class="absolute bottom-0 left-0 w-6 h-6 bg-oxford rounded-full opacity-50 animate-float-delayed"></div>
          <div class="absolute top-1/2 right-1/4 w-4 h-4 bg-gold rounded-full opacity-60 animate-float-slow"></div>
        </div>
      </div>

      <!-- Error Message -->
      <div class="mb-8 space-y-4">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">
          ¡Ups! Página no encontrada
        </h2>

        <p class="text-lg text-gray-600 leading-relaxed mb-6">
          Lo sentimos, no pudimos encontrar la página que estás buscando.
          Es posible que la URL esté mal escrita o que la página haya sido movida.
        </p>

        <!-- Current Path Info -->
        <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div class="flex items-center text-sm text-gray-600">
            <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span class="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
              {{ currentPath }}
            </span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-4 mb-8">
        <!-- Primary Actions -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link
            to="/dashboard"
            class="btn btn-primary flex-1 sm:flex-initial group transform hover:scale-105 transition-all duration-200"
          >
            <svg class="w-5 h-5 mr-2 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Ir al Dashboard
          </router-link>

          <button
            @click="goBack"
            class="btn btn-secondary flex-1 sm:flex-initial group transform hover:scale-105 transition-all duration-200"
          >
            <svg class="w-5 w-5 mr-2 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Página Anterior
          </button>
        </div>

        <!-- Secondary Actions -->
        <div class="flex flex-col sm:flex-row gap-3 justify-center text-sm">
          <button
            @click="refreshPage"
            class="text-oxford hover:text-oxford-light transition-colors flex items-center justify-center"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Recargar página
          </button>

          <button
            @click="reportProblem"
            class="text-oxford hover:text-oxford-light transition-colors flex items-center justify-center"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Reportar problema
          </button>
        </div>
      </div>

      <!-- Help Links -->
      <div class="border-t border-gray-200 pt-8">
        <p class="text-sm text-gray-500 mb-6">
          ¿Necesitas ayuda? Prueba estos enlaces útiles:
        </p>

        <div class="grid grid-cols-2 gap-4 text-sm">
          <router-link
            to="/dashboard"
            class="flex items-center p-3 rounded-lg bg-white border border-gray-200 hover:border-oxford hover:shadow-md transition-all duration-200 group"
          >
            <div class="w-8 h-8 bg-oxford rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div class="text-left">
              <div class="font-medium text-gray-900">Dashboard</div>
              <div class="text-xs text-gray-500">Panel principal</div>
            </div>
          </router-link>

          <router-link
            to="/users"
            class="flex items-center p-3 rounded-lg bg-white border border-gray-200 hover:border-oxford hover:shadow-md transition-all duration-200 group"
          >
            <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div class="text-left">
              <div class="font-medium text-gray-900">Usuarios</div>
              <div class="text-xs text-gray-500">Gestión usuarios</div>
            </div>
          </router-link>

          <router-link
            to="/events"
            class="flex items-center p-3 rounded-lg bg-white border border-gray-200 hover:border-oxford hover:shadow-md transition-all duration-200 group"
          >
            <div class="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="text-left">
              <div class="font-medium text-gray-900">Eventos</div>
              <div class="text-xs text-gray-500">Gestión eventos</div>
            </div>
          </router-link>

          <a
            href="mailto:support@arch.ox.ac.uk"
            class="flex items-center p-3 rounded-lg bg-white border border-gray-200 hover:border-oxford hover:shadow-md transition-all duration-200 group"
          >
            <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="text-left">
              <div class="font-medium text-gray-900">Soporte</div>
              <div class="text-xs text-gray-500">Contactar ayuda</div>
            </div>
          </a>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="mt-8 pt-6 border-t border-gray-200 text-xs text-gray-500">
        <p>ARCH Admin Panel - Oxford University Events Management System</p>
        <p class="mt-1">¿Sigues teniendo problemas? Contacta al equipo técnico.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

const router = useRouter()
const route = useRoute()
const toast = useToast()

// ============ COMPUTED ============
const currentPath = computed(() => route.fullPath)

// ============ METHODS ============
const goBack = () => {
  // Si hay historial, volver atrás. Si no, ir al dashboard
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/dashboard')
  }
}

const refreshPage = () => {
  window.location.reload()
}

const reportProblem = () => {
  const subject = encodeURIComponent(`Problema en ARCH Admin - Página 404: ${route.fullPath}`)
  const body = encodeURIComponent(`
Hola equipo de ARCH,

He encontrado un problema al intentar acceder a la siguiente URL:
${window.location.href}

Información adicional:
- Fecha: ${new Date().toLocaleString('es-ES')}
- Navegador: ${navigator.userAgent}
- Página anterior: ${document.referrer || 'N/A'}

Descripción del problema:
[Describe aquí lo que esperabas encontrar]

Gracias,
`)

  const mailtoLink = `mailto:support@arch.ox.ac.uk?subject=${subject}&body=${body}`
  window.location.href = mailtoLink

  toast.info('Se abrirá tu cliente de correo para reportar el problema')
}
</script>

<style scoped>
.oxford-gradient {
  background: linear-gradient(135deg, #003366 0%, #1a4d73 100%);
}

/* Animaciones flotantes */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes float-delayed {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
}

@keyframes float-slow {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 4s ease-in-out infinite 1s;
}

.animate-float-slow {
  animation: float-slow 5s ease-in-out infinite 2s;
}

/* Efecto de parpadeo más suave para el ping */
@keyframes ping {
  75%, 100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* Mejoras de accesibilidad para el texto con clip-path */
@supports not (background-clip: text) {
  .bg-clip-text {
    background: none;
    color: #003366;
  }
}

/* Hover effects mejorados */
.group:hover .group-hover\:animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.group:hover .group-hover\:animate-bounce {
  animation: bounce 1s infinite;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .text-9xl {
    font-size: 6rem;
  }
}
</style>
