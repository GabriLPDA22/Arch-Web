<template>
  <div class="min-h-screen bg-gray-50">

    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-4">
            <!-- Back Button -->
            <router-link
              to="/dashboard"
              class="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-oxford rounded-lg transition-colors"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </router-link>

            <!-- Title -->
            <div>
              <h1 class="text-xl font-semibold text-oxford">Gestión de Usuarios</h1>
              <p class="text-sm text-gray-500">{{ totalUsers }} usuarios registrados</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-3">
            <!-- Search -->
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                class="form-input pl-9 pr-4 py-2 w-64"
                placeholder="Buscar usuarios..."
                @input="handleSearch"
              />
            </div>

            <!-- Filter -->
            <select v-model="selectedFilter" @change="applyFilter" class="form-select">
              <option value="">Todos los usuarios</option>
              <option value="verified">Verificados</option>
              <option value="unverified">No verificados</option>
              <option value="admin">Administradores</option>
              <option value="student">Estudiantes</option>
              <option value="alumni">Alumni</option>
            </select>

            <!-- Create User Button -->
            <button @click="openCreateModal" class="btn btn-primary">
              <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nuevo Usuario
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="p-4 sm:p-6 lg:p-8">
      <div class="max-w-7xl mx-auto">

        <!-- Filters and Stats -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div class="flex flex-wrap items-center justify-between">
            <!-- Stats -->
            <div class="flex flex-wrap gap-6">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                <span class="text-sm text-gray-600">
                  <span class="font-semibold text-gray-900">{{ verifiedCount }}</span> Verificados
                </span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                <span class="text-sm text-gray-600">
                  <span class="font-semibold text-gray-900">{{ unverifiedCount }}</span> Pendientes
                </span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                <span class="text-sm text-gray-600">
                  <span class="font-semibold text-gray-900">{{ adminCount }}</span> Administradores
                </span>
              </div>
            </div>

            <!-- Bulk Actions -->
            <div v-if="selectedUsers.length > 0" class="flex items-center space-x-2">
              <span class="text-sm text-gray-600">{{ selectedUsers.length }} seleccionados</span>
              <button @click="bulkVerify" class="btn btn-secondary btn-sm">
                Verificar
              </button>
              <button @click="bulkDelete" class="btn btn-danger btn-sm">
                Eliminar
              </button>
            </div>
          </div>
        </div>

        <!-- Users Table -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">

          <!-- Loading State -->
          <div v-if="isLoading" class="p-8">
            <div class="flex flex-col items-center justify-center space-y-4">
              <LoadingSpinner size="lg" text="Cargando usuarios..." />
              <div class="w-full space-y-2">
                <div v-for="i in 5" :key="i" class="animate-pulse">
                  <div class="h-12 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredUsers.length === 0" class="p-12 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900">
              {{ searchQuery ? 'No se encontraron usuarios' : 'No hay usuarios registrados' }}
            </h3>
            <p class="mt-2 text-sm text-gray-500">
              {{ searchQuery
                ? `No hay usuarios que coincidan con "${searchQuery}"`
                : 'Los usuarios aparecerán aquí cuando se registren en la aplicación'
              }}
            </p>
            <div class="mt-6">
              <button @click="clearFilters" class="btn btn-primary">
                {{ searchQuery ? 'Limpiar búsqueda' : 'Actualizar lista' }}
              </button>
            </div>
          </div>

          <!-- Users Table -->
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <!-- Table Header -->
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 w-12">
                    <input
                      type="checkbox"
                      :checked="isAllSelected"
                      @change="toggleSelectAll"
                      class="form-checkbox"
                    />
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" @click="sortBy('name')">
                    <div class="flex items-center space-x-1">
                      <span>Usuario</span>
                      <svg v-if="currentSort.field === 'name'" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="currentSort.order === 'asc' ? 'M8 9l4-4 4 4M8 15l4 4 4-4' : 'M8 15l4 4 4-4M8 9l4-4 4 4'" />
                      </svg>
                    </div>
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" @click="sortBy('createdAt')">
                    <div class="flex items-center space-x-1">
                      <span>Registro</span>
                      <svg v-if="currentSort.field === 'createdAt'" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="currentSort.order === 'asc' ? 'M8 9l4-4 4 4M8 15l4 4 4-4' : 'M8 15l4 4 4-4M8 9l4-4 4 4'" />
                      </svg>
                    </div>
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>

              <!-- Table Body -->
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="user in paginatedUsers"
                  :key="user.userID"
                  class="hover:bg-gray-50 transition-colors"
                  :class="{ 'bg-blue-50': selectedUsers.includes(user.userID) }"
                >
                  <!-- Checkbox -->
                  <td class="px-6 py-4">
                    <input
                      type="checkbox"
                      :checked="selectedUsers.includes(user.userID)"
                      @change="toggleUserSelection(user.userID)"
                      class="form-checkbox"
                    />
                  </td>

                  <!-- User Info -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <img
                          v-if="user.profilePicture"
                          class="h-10 w-10 rounded-full object-cover"
                          :src="user.profilePicture"
                          :alt="user.name"
                          @error="handleImageError"
                        />
                        <div v-else class="h-10 w-10 rounded-full bg-oxford flex items-center justify-center">
                          <span class="text-sm font-medium text-white">
                            {{ getInitials(user.name) }}
                          </span>
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                        <div class="text-sm text-gray-500">{{ user.email }}</div>
                      </div>
                    </div>
                  </td>

                  <!-- User Type -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getUserTypeClasses(user.userType)">
                      {{ getUserTypeLabel(user.userType) }}
                    </span>
                  </td>

                  <!-- Status -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    ]">
                      <div :class="[
                        'w-1.5 h-1.5 rounded-full mr-1.5',
                        user.isVerified ? 'bg-green-400' : 'bg-yellow-400'
                      ]"></div>
                      {{ user.isVerified ? 'Verificado' : 'Pendiente' }}
                    </span>
                  </td>

                  <!-- Created Date -->
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(user.createdAt) }}
                  </td>

                  <!-- Actions -->
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex items-center justify-end space-x-2">
                      <button
                        @click="viewUser(user)"
                        class="text-oxford hover:text-oxford-light transition-colors"
                        title="Ver detalles"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>

                      <button
                        @click="editUser(user)"
                        class="text-blue-600 hover:text-blue-700 transition-colors"
                        title="Editar usuario"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>

                      <button
                        v-if="!user.isVerified"
                        @click="verifyUser(user)"
                        class="text-green-600 hover:text-green-700 transition-colors"
                        title="Verificar usuario"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>

                      <button
                        @click="deleteUser(user)"
                        :disabled="user.userType === 'admin' && user.userID === currentUser?.userID"
                        class="text-red-600 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        :title="user.userType === 'admin' && user.userID === currentUser?.userID ? 'No puedes eliminarte a ti mismo' : 'Eliminar usuario'"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="bg-white px-6 py-3 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <!-- Results Info -->
              <div class="text-sm text-gray-700">
                Mostrando
                <span class="font-medium">{{ startIndex + 1 }}</span>
                a
                <span class="font-medium">{{ Math.min(endIndex, filteredUsers.length) }}</span>
                de
                <span class="font-medium">{{ filteredUsers.length }}</span>
                resultados
              </div>

              <!-- Pagination Controls -->
              <div class="flex items-center space-x-2">
                <button
                  @click="changePage(currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>

                <div class="flex items-center space-x-1">
                  <button
                    v-for="page in visiblePages"
                    :key="page"
                    @click="changePage(page)"
                    :class="[
                      'px-3 py-1 text-sm border rounded',
                      page === currentPage
                        ? 'bg-oxford text-white border-oxford'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    ]"
                  >
                    {{ page }}
                  </button>
                </div>

                <button
                  @click="changePage(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
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
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

// ============ STATE ============
const isLoading = ref(true)
const users = ref([])
const searchQuery = ref('')
const selectedFilter = ref('')
const selectedUsers = ref([])
const currentSort = ref({ field: 'createdAt', order: 'desc' })
const currentPage = ref(1)
const itemsPerPage = ref(20)

// Mock data para desarrollo - en producción vendrá de tu API
const mockUsers = [
  {
    userID: '1',
    name: 'John Doe',
    email: 'john.doe@ox.ac.uk',
    userType: 'student',
    isVerified: true,
    profilePicture: null,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    userID: '2',
    name: 'Jane Smith',
    email: 'jane.smith@ox.ac.uk',
    userType: 'alumni',
    isVerified: false,
    profilePicture: null,
    createdAt: '2024-01-14T08:20:00Z'
  },
  {
    userID: '3',
    name: 'Administrator',
    email: 'admin@arch.ox.ac.uk',
    userType: 'admin',
    isVerified: true,
    profilePicture: null,
    createdAt: '2024-01-01T00:00:00Z'
  }
]

// ============ COMPUTED ============
const currentUser = computed(() => authStore.user)

const filteredUsers = computed(() => {
  let filtered = [...users.value]

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    )
  }

  // Apply filter
  if (selectedFilter.value) {
    switch (selectedFilter.value) {
      case 'verified':
        filtered = filtered.filter(user => user.isVerified)
        break
      case 'unverified':
        filtered = filtered.filter(user => !user.isVerified)
        break
      case 'admin':
      case 'student':
      case 'alumni':
        filtered = filtered.filter(user => user.userType === selectedFilter.value)
        break
    }
  }

  // Apply sorting
  filtered.sort((a, b) => {
    let aValue = a[currentSort.value.field]
    let bValue = b[currentSort.value.field]

    if (currentSort.value.field === 'createdAt') {
      aValue = new Date(aValue)
      bValue = new Date(bValue)
    }

    if (aValue < bValue) return currentSort.value.order === 'asc' ? -1 : 1
    if (aValue > bValue) return currentSort.value.order === 'asc' ? 1 : -1
    return 0
  })

  return filtered
})

const totalUsers = computed(() => users.value.length)
const verifiedCount = computed(() => users.value.filter(u => u.isVerified).length)
const unverifiedCount = computed(() => users.value.filter(u => !u.isVerified).length)
const adminCount = computed(() => users.value.filter(u => u.userType === 'admin').length)

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => startIndex.value + itemsPerPage.value)

const paginatedUsers = computed(() =>
  filteredUsers.value.slice(startIndex.value, endIndex.value)
)

const visiblePages = computed(() => {
  const range = 5
  const half = Math.floor(range / 2)
  let start = Math.max(currentPage.value - half, 1)
  let end = Math.min(start + range - 1, totalPages.value)

  if (end - start + 1 < range) {
    start = Math.max(end - range + 1, 1)
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

const isAllSelected = computed(() =>
  paginatedUsers.value.length > 0 &&
  paginatedUsers.value.every(user => selectedUsers.value.includes(user.userID))
)

// ============ METHODS ============
const loadUsers = async () => {
  isLoading.value = true

  try {
    // TODO: Reemplazar con llamada real a tu API
    // const response = await apiService.getUsers()
    // users.value = response.data || response

    // Simular carga con mock data
    await new Promise(resolve => setTimeout(resolve, 1000))
    users.value = mockUsers

    toast.success('Usuarios cargados correctamente')
  } catch (error) {
    console.error('Error loading users:', error)
    toast.error('Error al cargar usuarios')
  } finally {
    isLoading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  selectedUsers.value = []
}

const applyFilter = () => {
  currentPage.value = 1
  selectedUsers.value = []
}

const sortBy = (field) => {
  if (currentSort.value.field === field) {
    currentSort.value.order = currentSort.value.order === 'asc' ? 'desc' : 'asc'
  } else {
    currentSort.value.field = field
    currentSort.value.order = 'asc'
  }
  currentPage.value = 1
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    selectedUsers.value = []
  }
}

const toggleUserSelection = (userId) => {
  const index = selectedUsers.value.indexOf(userId)
  if (index > -1) {
    selectedUsers.value.splice(index, 1)
  } else {
    selectedUsers.value.push(userId)
  }
}

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedUsers.value = []
  } else {
    selectedUsers.value = paginatedUsers.value.map(user => user.userID)
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedFilter.value = ''
  currentPage.value = 1
  selectedUsers.value = []
  loadUsers()
}

// User actions
const viewUser = (user) => {
  router.push(`/users/${user.userID}`)
}

const editUser = (user) => {
  // TODO: Abrir modal de edición
  toast.info('Función de edición en desarrollo')
}

const deleteUser = (user) => {
  if (user.userType === 'admin' && user.userID === currentUser.value?.userID) {
    toast.error('No puedes eliminarte a ti mismo')
    return
  }

  // TODO: Implementar confirmación y eliminación
  toast.info('Función de eliminación en desarrollo')
}

const verifyUser = (user) => {
  // TODO: Implementar verificación
  toast.info('Función de verificación en desarrollo')
}

const bulkVerify = () => {
  toast.info('Función de verificación masiva en desarrollo')
}

const bulkDelete = () => {
  toast.info('Función de eliminación masiva en desarrollo')
}

const openCreateModal = () => {
  toast.info('Función de creación de usuario en desarrollo')
}

// Utility functions
const getUserTypeLabel = (type) => {
  const labels = {
    admin: 'Administrador',
    student: 'Estudiante',
    alumni: 'Alumni',
    organisation: 'Organización',
    user: 'Usuario'
  }
  return labels[type] || 'Usuario'
}

const getUserTypeClasses = (type) => {
  const classes = {
    admin: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800',
    student: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800',
    alumni: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800',
    organisation: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800',
    user: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
  }
  return classes[type] || classes.user
}

const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const handleImageError = (event) => {
  event.target.style.display = 'none'
}

// ============ LIFECYCLE ============
onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
/* Estilos personalizados específicos de la vista */
.form-checkbox {
  @apply h-4 w-4 text-oxford focus:ring-oxford border-gray-300 rounded;
}

/* Hover effects mejorados para las filas */
.hover\:bg-gray-50:hover {
  background-color: rgba(249, 250, 251, 0.8);
}

/* Animaciones suaves para selecciones */
.transition-colors {
  transition: background-color 0.2s ease, color 0.2s ease;
}
</style>
