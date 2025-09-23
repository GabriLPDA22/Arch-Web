<template>
  <div class="min-h-screen bg-gray-50">

    <!-- Header/Navbar -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">

          <!-- Logo y Título -->
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <div class="h-8 w-8 rounded-full oxford-gradient flex items-center justify-center">
                <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div>
              <h1 class="text-xl font-semibold text-oxford">Panel de Administración</h1>
              <p class="text-xs text-gray-500">ARCH Events Management</p>
            </div>
          </div>

          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <!-- Refresh Button -->
            <button
              @click="refreshDashboard"
              :disabled="isRefreshing"
              class="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-oxford rounded-lg transition-colors"
              title="Actualizar datos"
            >
              <svg
                class="h-5 w-5 transition-transform duration-500"
                :class="{ 'animate-spin': isRefreshing }"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            <!-- User Info -->
            <div class="flex items-center space-x-3">
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">{{ currentUser?.name || 'Admin' }}</p>
                <p class="text-xs text-gray-500">{{ currentUser?.email || 'admin@arch.ox.ac.uk' }}</p>
              </div>

              <!-- User Avatar -->
              <div class="h-10 w-10 rounded-full oxford-gradient flex items-center justify-center">
                <span class="text-white font-medium text-sm">
                  {{ (currentUser?.name || 'A')[0].toUpperCase() }}
                </span>
              </div>
            </div>

            <!-- Logout Button -->
            <button
              @click="handleLogout"
              class="btn btn-secondary"
              title="Cerrar sesión"
            >
              <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="p-4 sm:p-6 lg:p-8">
      <div class="max-w-7xl mx-auto">

        <!-- Welcome Section -->
        <div class="mb-8">
          <div class="md:flex md:items-center md:justify-between">
            <div class="flex-1 min-w-0">
              <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Bienvenido al Dashboard
              </h2>
              <div class="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                <div class="mt-2 flex items-center text-sm text-gray-500">
                  <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Última actualización: {{ lastUpdatedText }}
                </div>
                <div class="mt-2 flex items-center text-sm text-gray-500">
                  <div
                    class="flex-shrink-0 mr-1.5 h-2 w-2 rounded-full"
                    :class="systemStatus === 'online' ? 'bg-green-400' : 'bg-red-400'"
                  ></div>
                  Sistema {{ systemStatus === 'online' ? 'Operativo' : 'Offline' }}
                </div>
              </div>
            </div>
            <div class="mt-4 flex md:mt-0 md:ml-4">
              <button class="btn btn-primary">
                <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Acciones Rápidas
              </button>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div v-for="i in 4" :key="i" class="card animate-pulse">
            <div class="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>

        <!-- Stats Cards -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div
            v-for="(stat, index) in statsCards"
            :key="stat.title"
            class="card card-hover transition-all duration-200"
            :class="{ 'animate-fade-in': true }"
            :style="{ 'animation-delay': `${index * 100}ms` }"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div :class="[
                  'flex items-center justify-center h-12 w-12 rounded-lg',
                  stat.bgColor
                ]">
                  <component :is="stat.icon" :class="['h-6 w-6', stat.iconColor]" />
                </div>
              </div>

              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    {{ stat.title }}
                  </dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">
                      {{ stat.value }}
                    </div>
                    <div v-if="stat.change" :class="[
                      'ml-2 flex items-baseline text-sm font-semibold',
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    ]">
                      <svg v-if="stat.changeType === 'positive'" class="self-center flex-shrink-0 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                      </svg>
                      <svg v-else class="self-center flex-shrink-0 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                      {{ stat.change }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          <!-- Quick Actions -->
          <div class="lg:col-span-2">
            <div class="card">
              <div class="card-header">
                <h3 class="text-lg font-semibold text-gray-900">Acciones Rápidas</h3>
                <p class="text-sm text-gray-600">Gestiona los elementos más importantes del sistema</p>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <router-link
                  v-for="action in quickActions"
                  :key="action.name"
                  :to="action.href"
                  class="group flex flex-col items-center p-4 rounded-lg border-2 border-gray-200 hover:border-oxford transition-all duration-200 hover:shadow-md"
                >
                  <div :class="[
                    'flex items-center justify-center h-12 w-12 rounded-lg mb-3 transition-colors',
                    action.bgColor,
                    'group-hover:scale-110 transform duration-200'
                  ]">
                    <component :is="action.icon" :class="['h-6 w-6', action.iconColor]" />
                  </div>
                  <span class="text-sm font-medium text-gray-900 text-center">{{ action.name }}</span>
                  <span class="text-xs text-gray-500 text-center mt-1">{{ action.description }}</span>
                </router-link>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="lg:col-span-1">
            <div class="card">
              <div class="card-header">
                <h3 class="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
              </div>

              <div class="flow-root">
                <ul class="-mb-8">
                  <li v-for="(activity, index) in recentActivities" :key="index">
                    <div class="relative pb-8" :class="{ 'pb-0': index === recentActivities.length - 1 }">
                      <div v-if="index !== recentActivities.length - 1" class="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"></div>

                      <div class="relative flex items-start space-x-3">
                        <div class="relative">
                          <div :class="[
                            'h-10 w-10 rounded-full flex items-center justify-center',
                            activity.bgColor
                          ]">
                            <component :is="activity.icon" :class="['h-5 w-5', activity.iconColor]" />
                          </div>
                        </div>

                        <div class="min-w-0 flex-1">
                          <div>
                            <div class="text-sm">
                              <span class="font-medium text-gray-900">{{ activity.title }}</span>
                            </div>
                            <p class="mt-0.5 text-sm text-gray-500">{{ activity.description }}</p>
                          </div>
                          <div class="mt-2 text-sm text-gray-500">
                            <time>{{ activity.time }}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- System Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

          <!-- System Status -->
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-semibold text-gray-900">Estado del Sistema</h3>
            </div>

            <div class="space-y-4">
              <div v-for="service in systemServices" :key="service.name" class="flex items-center justify-between">
                <div class="flex items-center">
                  <div :class="[
                    'h-2 w-2 rounded-full mr-3',
                    service.status === 'online' ? 'bg-green-400' : 'bg-red-400'
                  ]"></div>
                  <span class="text-sm font-medium text-gray-900">{{ service.name }}</span>
                </div>
                <span :class="[
                  'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                  service.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                ]">
                  {{ service.status === 'online' ? 'Operativo' : 'Offline' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-semibold text-gray-900">Estadísticas Rápidas</h3>
            </div>

            <div class="space-y-4">
              <div v-for="quickStat in quickStats" :key="quickStat.label">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">{{ quickStat.label }}</span>
                  <span class="text-sm font-semibold text-gray-900">{{ quickStat.value }}</span>
                </div>
                <div class="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="h-2 rounded-full transition-all duration-500"
                    :class="quickStat.color"
                    :style="{ width: `${quickStat.percentage}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import {
  UsersIcon,
  CalendarIcon,
  GiftIcon,
  CogIcon,
  ChartBarIcon,
  CheckCircleIcon,
  PlusIcon,
  UserGroupIcon,
  ClockIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

// ============ STATE ============
const isLoading = ref(true)
const isRefreshing = ref(false)
const lastUpdated = ref(new Date())
const systemStatus = ref('online')

// Mock data - en producción vendrá de tu API
const mockStats = ref({
  totalUsers: 1247,
  verifiedUsers: 956,
  totalEvents: 156,
  activeEvents: 23,
  totalCoupons: 45,
  activeCoupons: 32,
  totalPreferences: 18
})

// ============ COMPUTED ============
const currentUser = computed(() => authStore.user)

const lastUpdatedText = computed(() => {
  return lastUpdated.value.toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

const statsCards = computed(() => [
  {
    title: 'Total Usuarios',
    value: mockStats.value.totalUsers.toLocaleString(),
    change: '+12%',
    changeType: 'positive',
    icon: UsersIcon,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    title: 'Usuarios Verificados',
    value: mockStats.value.verifiedUsers.toLocaleString(),
    change: '+8%',
    changeType: 'positive',
    icon: CheckCircleIcon,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    title: 'Eventos Activos',
    value: mockStats.value.activeEvents.toLocaleString(),
    change: '+15%',
    changeType: 'positive',
    icon: CalendarIcon,
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
  {
    title: 'Cupones Activos',
    value: mockStats.value.activeCoupons.toLocaleString(),
    change: '+5%',
    changeType: 'positive',
    icon: GiftIcon,
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600'
  }
])

const quickActions = computed(() => [
  {
    name: 'Gestionar Usuarios',
    description: 'Ver y editar usuarios',
    href: '/users',
    icon: UsersIcon,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    name: 'Crear Evento',
    description: 'Añadir nuevo evento',
    href: '/events',
    icon: PlusIcon,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    name: 'Ver Eventos',
    description: 'Gestionar eventos',
    href: '/events',
    icon: CalendarIcon,
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
  {
    name: 'Gestionar Cupones',
    description: 'Administrar cupones',
    href: '/coupons',
    icon: GiftIcon,
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600'
  },
  {
    name: 'Preferencias',
    description: 'Configurar categorías',
    href: '/preferences',
    icon: CogIcon,
    bgColor: 'bg-gray-100',
    iconColor: 'text-gray-600'
  },
  {
    name: 'Reportes',
    description: 'Ver estadísticas',
    href: '/reports',
    icon: ChartBarIcon,
    bgColor: 'bg-indigo-100',
    iconColor: 'text-indigo-600'
  }
])

const recentActivities = computed(() => [
  {
    title: 'Nuevo usuario registrado',
    description: 'john.doe@ox.ac.uk se registró en el sistema',
    time: 'Hace 5 minutos',
    icon: UserGroupIcon,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    title: 'Evento creado',
    description: 'Oxford Alumni Networking Night fue publicado',
    time: 'Hace 2 horas',
    icon: CalendarIcon,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    title: 'Cupón activado',
    description: 'Descuento 20% en eventos deportivos',
    time: 'Hace 4 horas',
    icon: GiftIcon,
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600'
  },
  {
    title: 'Usuario verificado',
    description: '15 usuarios fueron verificados automáticamente',
    time: 'Hace 1 día',
    icon: CheckCircleIcon,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600'
  }
])

const systemServices = computed(() => [
  { name: 'API Backend (.NET)', status: 'online' },
  { name: 'Base de Datos (PostgreSQL)', status: 'online' },
  { name: 'Servicio de Email', status: 'online' },
  { name: 'Almacenamiento de Archivos', status: 'online' }
])

const quickStats = computed(() => [
  {
    label: 'Tasa de Verificación',
    value: `${Math.round((mockStats.value.verifiedUsers / mockStats.value.totalUsers) * 100)}%`,
    percentage: Math.round((mockStats.value.verifiedUsers / mockStats.value.totalUsers) * 100),
    color: 'bg-green-500'
  },
  {
    label: 'Eventos Activos',
    value: `${mockStats.value.activeEvents} / ${mockStats.value.totalEvents}`,
    percentage: Math.round((mockStats.value.activeEvents / mockStats.value.totalEvents) * 100),
    color: 'bg-purple-500'
  },
  {
    label: 'Cupones Disponibles',
    value: `${mockStats.value.activeCoupons} / ${mockStats.value.totalCoupons}`,
    percentage: Math.round((mockStats.value.activeCoupons / mockStats.value.totalCoupons) * 100),
    color: 'bg-orange-500'
  }
])

// ============ METHODS ============
const loadDashboardData = async () => {
  isLoading.value = true

  try {
    // Simular carga de datos - aquí irían las llamadas reales a tu API
    await new Promise(resolve => setTimeout(resolve, 1500))

    // TODO: Reemplazar con llamadas reales a tu API
    // const [usersData, eventsData, couponsData] = await Promise.all([
    //   apiService.getUsers(),
    //   apiService.getEvents(),
    //   apiService.getCoupons()
    // ])

    lastUpdated.value = new Date()

    toast.success('Dashboard actualizado correctamente')
  } catch (error) {
    console.error('Error loading dashboard data:', error)
    toast.error('Error al cargar los datos del dashboard')
    systemStatus.value = 'offline'
  } finally {
    isLoading.value = false
  }
}

const refreshDashboard = async () => {
  isRefreshing.value = true

  try {
    await loadDashboardData()
  } finally {
    isRefreshing.value = false
  }
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    toast.success('Sesión cerrada correctamente')
    router.push('/login')
  } catch (error) {
    console.error('Error during logout:', error)
    toast.error('Error al cerrar sesión')
  }
}

// ============ LIFECYCLE ============
onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.oxford-gradient {
  background: linear-gradient(135deg, #003366 0%, #1a4d73 100%);
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}
</style>
