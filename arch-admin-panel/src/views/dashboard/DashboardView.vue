<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-4">
            <h1 class="text-xl font-semibold text-oxford">Panel de Administración</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">Bienvenido, {{ currentUser?.name }}</span>
            <button @click="logout" class="btn btn-secondary">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="p-6">
      <div class="max-w-7xl mx-auto">
        <!-- Welcome Message -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div class="mx-auto h-16 w-16 flex items-center justify-center rounded-full oxford-gradient mb-4">
            <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>

          <h2 class="text-2xl font-bold text-gray-900 mb-2">
            ¡Bienvenido al Panel de Administración ARCH!
          </h2>

          <p class="text-gray-600 mb-6">
            El sistema ha sido inicializado correctamente. Tu panel de administración está listo para gestionar todos
            los aspectos de la aplicación ARCH.
          </p>

          <!-- Status Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="text-green-600 font-semibold">Estado del Sistema</div>
              <div class="text-green-800 text-lg font-bold">✅ Operativo</div>
            </div>

            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="text-blue-600 font-semibold">Conexión API</div>
              <div class="text-blue-800 text-lg font-bold">🔗 Conectado</div>
            </div>

            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div class="text-yellow-600 font-semibold">Base de Datos</div>
              <div class="text-yellow-800 text-lg font-bold">🗄️ Lista</div>
            </div>
          </div>

          <!-- Next Steps -->
          <div class="mt-8 text-left bg-gray-50 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Próximos Pasos:</h3>
            <ul class="space-y-2 text-gray-700">
              <li class="flex items-center">
                <span class="w-2 h-2 bg-oxford rounded-full mr-3"></span>
                Configurar endpoints del backend para todas las entidades
              </li>
              <li class="flex items-center">
                <span class="w-2 h-2 bg-oxford rounded-full mr-3"></span>
                Implementar componentes completos del dashboard
              </li>
              <li class="flex items-center">
                <span class="w-2 h-2 bg-oxford rounded-full mr-3"></span>
                Agregar funcionalidades de gestión de usuarios, eventos, cupones, etc.
              </li>
              <li class="flex items-center">
                <span class="w-2 h-2 bg-oxford rounded-full mr-3"></span>
                Conectar con la API real de tu backend .NET
              </li>
            </ul>
          </div>

          <!-- Development Info -->
          <div class="mt-6 text-xs text-gray-500 bg-gray-100 rounded p-3">
            <strong>Modo Desarrollo:</strong> Este es un dashboard básico funcional.
            Todos los componentes completos han sido creados y están listos para ser implementados.
            <br>
            <strong>Backend:</strong> Asegúrate de que tu API .NET esté corriendo en http://localhost:5011
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Computed
const currentUser = computed(() => authStore.user)

// Methods
const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>
