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

    <div class="search-container">
      <div class="search-wrapper">
        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
          />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by name or email..."
          class="search-input"
          @input="handleSearchInput"
        />
        <button v-if="searchQuery" @click="clearSearch" class="clear-btn" title="Clear search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
            />
          </svg>
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading users...</p>
    </div>

    <div v-else-if="users.length === 0" class="empty-state">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"
        />
      </svg>
      <h3>No users found</h3>
      <p v-if="searchQuery">Try adjusting your search criteria</p>
      <p v-else>Get started by creating your first user</p>
    </div>

    <div v-else class="users-table-container">
      <table class="users-table">
        <thead>
          <tr>
            <th @click="handleSort('name')" class="sortable">
              Name
              <span v-if="sortBy === 'name'" class="sort-icon">{{
                sortOrder === 'asc' ? '▲' : '▼'
              }}</span>
            </th>
            <th>Email</th>
            <th @click="handleSort('userType')" class="sortable">
              Role
              <span v-if="sortBy === 'userType'" class="sort-icon">{{
                sortOrder === 'asc' ? '▲' : '▼'
              }}</span>
            </th>
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
      <UserForm
        ref="userFormComponent"
        :user-id="selectedUserId"
        @user-saved="handleUserSaved"
        @user-created="handleUserCreated"
        @user-updated="handleUserUpdated"
      />
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
import { useAuthStore } from '@/stores/auth.store'
import { successMessages, handleApiError } from '@/utils/validators' // ✅ CAMBIO: Importaciones centralizadas
import PaginationComponent from '@/components/ui/PaginationComponent.vue'
import ModalComponent from '@/components/ui/ModalComponent.vue'
import UserForm from '@/components/forms/UserForm.vue'
import { useToast } from '@/composables/useToast'

const authStore = useAuthStore()
const { success } = useToast() // Aún podemos necesitar 'success' para casos especiales

const users = ref<UserListDto[]>([])
const loading = ref(true)
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = 10

const sortBy = ref('name')
const sortOrder = ref('asc')
const searchQuery = ref('')
let searchTimeout: ReturnType<typeof setTimeout> | null = null

const isFormModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isEditing = ref(false)
const selectedUserId = ref<string | null>(null)
const userToDelete = ref<UserListDto | null>(null)

const fetchUsers = async () => {
  loading.value = true
  try {
    const result = await UserApi.list({
      q: searchQuery.value || undefined,
      page: currentPage.value,
      pageSize: pageSize,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
    })
    users.value = result.items
    totalPages.value = result.totalPages
  } catch (err: any) {
    console.error('Failed to load users:', err)
    if (authStore.isLoggedIn) {
      handleApiError(err) // ✅ CAMBIO
    }
  } finally {
    loading.value = false
  }
}

const handleSearchInput = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchUsers()
  }, 500)
}

const clearSearch = () => {
  searchQuery.value = ''
  currentPage.value = 1
  fetchUsers()
}

const handleSort = (column: 'name' | 'userType') => {
  if (sortBy.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortOrder.value = 'asc'
  }
  fetchUsers()
}

const goToPage = (page: number) => {
  currentPage.value = page
  fetchUsers()
}

const openCreateModal = () => {
  isEditing.value = false
  selectedUserId.value = null
  isFormModalOpen.value = true
}

const openEditModal = (user: UserListDto) => {
  isEditing.value = true
  selectedUserId.value = user.userID
  isFormModalOpen.value = true
}

const openDeleteModal = (user: UserListDto) => {
  userToDelete.value = user
  isDeleteModalOpen.value = true
}

const closeModals = () => {
  isFormModalOpen.value = false
  isDeleteModalOpen.value = false
  userToDelete.value = null
  selectedUserId.value = null
}

const handleUserCreated = () => {
  closeModals()
  fetchUsers()
  successMessages.created('user') // ✅ CAMBIO
}

const handleUserUpdated = () => {
  const updatedUserId = selectedUserId.value
  closeModals()
  fetchUsers()

  if (updatedUserId && updatedUserId === authStore.user?.userID) {
    success('Role Changed', 'Your own role has been updated. You will now be logged out.', {
      duration: 3500,
    })
    setTimeout(() => {
      authStore.logout()
    }, 3500)
  } else {
    successMessages.updated('user') // ✅ CAMBIO
  }
}

const handleUserSaved = () => {
  closeModals()
  fetchUsers()
}

// ✅ ELIMINADO: La función handleFormError ya no es necesaria
// const handleFormError = ...

const handleDeleteConfirm = async () => {
  if (!userToDelete.value?.userID) return

  try {
    await UserApi.delete(userToDelete.value.userID)

    if (users.value.length === 1 && currentPage.value > 1) {
      currentPage.value--
    }

    closeModals()
    fetchUsers()
    successMessages.deleted('user') // ✅ CAMBIO
  } catch (err: any) {
    console.error('Failed to delete user:', err)
    handleApiError(err) // ✅ CAMBIO
  }
}

onMounted(() => {
  if (authStore.isLoggedIn) {
    fetchUsers()
  } else {
    loading.value = false
  }
})
</script>


<style scoped>
.search-container {
  padding: 0 2.5rem;
  max-width: 1600px;
  margin: 1.5rem auto 0;
}

.search-wrapper {
  position: relative;
  max-width: 500px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.875rem 3rem 0.875rem 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #1f2937;
  background: #ffffff;
  transition: all 0.2s ease;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-input:focus {
  outline: none;
  border-color: #dbb067;
  box-shadow: 0 0 0 3px rgba(219, 176, 103, 0.1);
}

.clear-btn {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  color: #6b7280;
  background: #f3f4f6;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  max-width: 1600px;
  margin: 0 auto;
}

.empty-state svg {
  color: #d1d5db;
  margin-bottom: 1.5rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
}

.users-table th.sortable {
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease;
}

.users-table th.sortable:hover {
  background-color: #f0f2f5;
}

.sort-icon {
  display: inline-block;
  margin-left: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
}

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
.role-badge.moderator {
  background-color: #fefce8;
  color: #854d0e;
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
.warning-text {
  color: #6b7280;
  font-size: 0.9rem;
  margin-top: 0.5rem;
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