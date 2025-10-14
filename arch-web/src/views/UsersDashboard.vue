<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Users Management</h1>
          <p class="page-subtitle">Create, view, and manage user accounts</p>
        </div>
        <button class="create-btn" @click="openCreateModal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
          </svg>
          Create User
        </button>
      </div>
    </div>

    <div
      v-if="deleteStatusMessage"
      class="status-notification"
      :class="{ error: deleteIsError, success: !deleteIsError }"
    >
      {{ deleteStatusMessage }}
      <button type="button" @click="deleteStatusMessage = null" class="close-status">×</button>
    </div>
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading users...</p>
    </div>

    <div v-else class="users-table-container">
      <table class="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.userID">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span :class="['role-badge', user.userType]">{{ user.userType }}</span>
            </td>
            <td class="actions-cell">
              <button class="action-btn edit" @click="openEditModal(user)" title="Edit">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"
                  />
                </svg>
              </button>
              <button class="action-btn delete" @click="openDeleteModal(user)" title="Delete">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
                  />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <PaginationComponent
      v-if="!loading && totalPages > 1"
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-changed="goToPage"
    />

    <ModalComponent
      :show="isFormModalOpen"
      :title="isEditing ? 'Edit User' : 'Create New User'"
      @close="closeModals"
    >
      <UserForm ref="userFormComponent" :user-id="selectedUserId" @user-saved="handleUserSaved" />
    </ModalComponent>

    <ModalComponent :show="isDeleteModalOpen" title="Delete User" @close="closeModals">
      <div class="delete-warning">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16" />
        </svg>
        <p>
          Are you sure you want to delete <strong>{{ userToDelete?.name }}</strong
          >?
        </p>
        <p class="warning-text">This action is permanent and cannot be undone.</p>
      </div>
      <template #footer>
        <button class="btn-secondary" @click="closeModals">Cancel</button>
        <button class="btn-danger" @click="handleDeleteConfirm">Delete User</button>
      </template>
    </ModalComponent>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { UserApi, type UserListDto } from '@/services/Api'
import PaginationComponent from '@/components/PaginationComponent.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import UserForm from '@/components/UserForm.vue'

const users = ref<UserListDto[]>([])
const loading = ref(true)
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = 10

const isFormModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isEditing = ref(false)
const selectedUserId = ref<string | null>(null)
const userToDelete = ref<UserListDto | null>(null)

// ✅ NUEVOS ESTADOS PARA LA NOTIFICACIÓN DE ELIMINACIÓN
const deleteStatusMessage = ref<string | null>(null)
const deleteIsError = ref(false)

const showDeleteStatus = (message: string, isErrorType = false) => {
  deleteStatusMessage.value = message
  deleteIsError.value = isErrorType
  // Ocultar mensaje después de 5 segundos
  if (!isErrorType) {
    setTimeout(() => {
      deleteStatusMessage.value = null
    }, 5000)
  }
}

const fetchUsers = async () => {
  loading.value = true
  try {
    const result = await UserApi.list({ page: currentPage.value, pageSize: pageSize })
    users.value = result.items
    totalPages.value = result.totalPages
  } catch (error) {
    console.error('Failed to load users:', error)
  } finally {
    loading.value = false
  }
}

const goToPage = (page: number) => {
  currentPage.value = page
  fetchUsers()
}

const openCreateModal = () => {
  isEditing.value = false
  selectedUserId.value = null
  isFormModalOpen.value = true
  deleteStatusMessage.value = null // Limpiar notif al abrir modal
}

const openEditModal = (user: UserListDto) => {
  isEditing.value = true
  selectedUserId.value = user.userID
  isFormModalOpen.value = true
  deleteStatusMessage.value = null // Limpiar notif al abrir modal
}

const openDeleteModal = (user: UserListDto) => {
  userToDelete.value = user
  isDeleteModalOpen.value = true
}

const closeModals = () => {
  isFormModalOpen.value = false
  isDeleteModalOpen.value = false
  userToDelete.value = null
}

const handleUserSaved = () => {
  closeModals()
  selectedUserId.value = null
  fetchUsers()
}

// ✅ CORRECCIÓN: Manejo de errores y mensajes personalizados
const handleDeleteConfirm = async () => {
  if (!userToDelete.value?.userID) return

  // Limpiar mensaje anterior
  deleteStatusMessage.value = null

  try {
    await UserApi.delete(userToDelete.value.userID)

    if (users.value.length === 1 && currentPage.value > 1) {
      currentPage.value--
    }

    handleUserSaved() // Cierra el modal y recarga usuarios
    showDeleteStatus('User deleted successfully.', false) 
  } catch (error: any) {
    console.error('Failed to delete user:', error)
    const errorMessage = error?.response?.data?.message || 'Unknown error while deleting user'
    showDeleteStatus(`Error: ${errorMessage}`, true) 
  }
}

onMounted(fetchUsers)
</script>

<style scoped>
/* Estilos para la notificación de estado en el dashboard */
.status-notification {
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1.5rem auto 0; /* Centrar debajo del header */
  max-width: 1600px;
  transition: all 0.3s ease;
}

.status-notification.error {
  background-color: #fee2e2;
  color: #c53030;
  border: 1px solid #fecaca;
}

.status-notification.success {
  background-color: #d1fae5;
  color: #047857;
  border: 1px solid #a7f3d0;
}

.close-status {
  background: none;
  border: none;
  color: inherit;
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
  margin-left: 1rem;
  padding: 0;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.close-status:hover {
  opacity: 1;
}

/* Resto de estilos del dashboard (se mantienen) */
.dashboard {
  padding: 0;
  min-height: 100vh;
}
.dashboard-header {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  padding: 2rem 2.5rem;
  position: sticky;
  top: 0;
  z-index: 50;
}
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  max-width: 1600px;
  margin: 0 auto;
}
.page-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
}
.page-subtitle {
  font-size: 1rem;
  color: #718096;
  margin: 0;
}
.create-btn {
  background: #dbb067;
  color: #ffffff;
  border: none;
  padding: 1rem 1.75rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
}
.create-btn:hover {
  background: #c9a05a;
}
.loading-state {
  text-align: center;
  padding: 4rem;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #dbb067;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.users-table-container {
  padding: 2rem 2.5rem;
  max-width: 1600px;
  margin: 0 auto;
}
.users-table {
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.users-table th,
.users-table td {
  padding: 1.25rem 1.5rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}
.users-table th {
  background: #f9fafb;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.users-table td {
  color: #4b5563;
  font-weight: 500;
}
.role-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: capitalize;
}
.role-badge.admin {
  background-color: #fee2e2;
  color: #991b1b;
}
.role-badge.user {
  background-color: #eff6ff;
  color: #1e40af;
}
.actions-cell {
  text-align: right;
}
.action-btn {
  background: transparent;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 0.5rem;
}
.action-btn.edit {
  color: #3b82f6;
}
.action-btn.edit:hover {
  background: #eff6ff;
  border-color: #bfdbfe;
}
.action-btn.delete {
  color: #ef4444;
}
.action-btn.delete:hover {
  background: #fee2e2;
  border-color: #fecaca;
}
.delete-warning {
  text-align: center;
  padding: 1rem;
}
.delete-warning svg {
  color: #f59e0b;
  margin-bottom: 1rem;
}
.btn-secondary {
  background: #f3f4f6;
  color: #4b5563;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}
.btn-danger {
  background: #ef4444;
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}
</style>
