<template>
  <div id="app">
    <!-- Router View with transitions -->
    <Suspense>
      <template #default>
        <router-view v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" />
          </Transition>
        </router-view>
      </template>

      <template #fallback>
        <div class="min-h-screen flex items-center justify-center bg-gray-50">
          <LoadingSpinner />
        </div>
      </template>
    </Suspense>

    <!-- Global Loading Overlay -->
    <LoadingOverlay v-if="globalLoading" />

    <!-- Network Status Indicator -->
    <div v-if="!isOnline" class="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2 text-sm z-50">
      <div class="flex items-center justify-center space-x-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <span>Sin conexión a internet</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'

// Components
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

// Global state
const globalLoading = ref(false)
const isOnline = ref(navigator.onLine)

// Network status handlers
const handleOnline = () => {
  isOnline.value = true
  toast.success('Conexión restaurada')
}

const handleOffline = () => {
  isOnline.value = false
  toast.warning('Conexión perdida')
}

// Error handling
onErrorCaptured((error, instance, info) => {
  console.error('Global error captured:', error, info)

  // Show user-friendly error message
  toast.error('Ha ocurrido un error inesperado. Por favor, recarga la página.')

  // In production, you might want to send this to an error reporting service
  if (import.meta.env.PROD) {
    // Example: Sentry.captureException(error, { extra: { info, instance } })
  }

  return false // Prevent the error from propagating further
})

// Initialize app
onMounted(async () => {
  try {
    globalLoading.value = true

    // Add network event listeners
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Check authentication status
    await authStore.checkAuth()

    // Log app initialization in development
    if (import.meta.env.DEV) {
      console.log('🚀 ARCH Admin Panel initialized')
      console.log('Environment:', import.meta.env.MODE)
      console.log('API URL:', import.meta.env.VITE_API_URL)
    }

  } catch (error) {
    console.error('App initialization error:', error)
    toast.error('Error al inicializar la aplicación')
  } finally {
    globalLoading.value = false
  }
})

onUnmounted(() => {
  // Clean up event listeners
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
})
</script>

<style>
/* Global styles are imported in main.js */
#app {
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

/* Page transition animations */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Focus styles for accessibility */
*:focus {
  outline: 2px solid theme('colors.oxford.DEFAULT');
  outline-offset: 2px;
}

/* Improved button focus styles */
button:focus,
.btn:focus {
  outline: 2px solid theme('colors.oxford.DEFAULT');
  outline-offset: 2px;
}

/* Scrollbar styles for webkit browsers */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Print styles */
@media print {
  * {
    box-shadow: none !important;
    text-shadow: none !important;
  }

  .no-print {
    display: none !important;
  }

  /* Ensure proper page breaks */
  .page-break-before {
    page-break-before: always;
  }

  .page-break-after {
    page-break-after: always;
  }

  .page-break-inside-avoid {
    page-break-inside: avoid;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .btn {
    border-width: 2px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .page-enter-active,
  .page-leave-active {
    transition: none;
  }
}

/* Dark mode support (if implementing in future) */
@media (prefers-color-scheme: dark) {
  /* Styles for dark mode will go here */
}
</style>
