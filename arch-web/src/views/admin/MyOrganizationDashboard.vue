<!-- ============================================== -->
<!-- RUTA: src/views/admin/MyOrganizationDashboard.vue -->
<!-- Dashboard para org-members (solo su organización) -->
<!-- ============================================== -->

<template>
  <div class="dashboard">
    <!-- Header -->
    <div class="dashboard-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">My Organization</h1>
          <p class="page-subtitle">Manage your organization and members</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading organization...</p>
    </div>

    <!-- Organization Details -->
    <div v-else-if="organization" class="org-details-container">
      <!-- Organization Info Card -->
      <div class="org-info-card">
        <div class="card-header">
          <h2>Organization Information</h2>
          <button class="btn-edit" @click="toggleEditMode" v-if="!isEditing">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
            </svg>
            Edit
          </button>
        </div>

        <div v-if="!isEditing" class="org-info-display">
          <div class="info-row">
            <label>Organization Name</label>
            <p class="info-value">{{ organization.name }}</p>
          </div>
          <div class="info-row" v-if="organization.logoUrl">
            <label>Logo</label>
            <img :src="organization.logoUrl" :alt="organization.name" class="org-logo-display" />
          </div>
          <div class="info-row" v-if="organization.websiteUrl">
            <label>Website</label>
            <a :href="organization.websiteUrl" target="_blank" rel="noopener noreferrer" class="website-link">
              {{ organization.websiteUrl }}
            </a>
          </div>
        </div>

        <form v-else @submit.prevent="handleSaveOrganization" class="org-info-form">
          <div class="form-group">
            <label>
              Organization Name <span class="required">*</span>
            </label>
            <input
              v-model="editForm.name"
              type="text"
              class="form-input"
              placeholder="Organization name"
              required
              maxlength="200"
            />
          </div>

          <div class="form-group">
            <label>Logo URL</label>
            <input
              v-model="editForm.logoUrl"
              type="url"
              class="form-input"
              placeholder="https://example.com/logo.png"
              maxlength="500"
            />
            <p class="form-hint">URL of your organization's logo</p>
          </div>

          <div class="form-group">
            <label>Website URL</label>
            <input
              v-model="editForm.websiteUrl"
              type="url"
              class="form-input"
              placeholder="https://example.com"
              maxlength="500"
            />
            <p class="form-hint">Your organization's website</p>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="cancelEdit" :disabled="saving">
              Cancel
            </button>
            <button type="submit" class="btn-primary" :disabled="saving || !isFormValid">
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Members Section -->
      <div class="members-card">
        <div class="card-header">
          <h2>Members ({{ members.length }})</h2>
          <button class="btn-add" @click="openAddMemberModal" v-if="authStore.isAdminOfOrganization(organization.id)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
            </svg>
            Add Member
          </button>
        </div>

        <div v-if="loadingMembers" class="loading-members">
          <div class="spinner small"></div>
          <span>Loading members...</span>
        </div>

        <div v-else-if="members.length === 0" class="empty-members">
          <p>No members yet. Add a member to get started.</p>
        </div>

        <table v-else class="members-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th v-if="authStore.isAdminOfOrganization(organization.id)" class="actions-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in members" :key="member.id">
              <td>
                <div class="member-name">
                  <strong>{{ member.userName }}</strong>
                </div>
              </td>
              <td>{{ member.userEmail }}</td>
              <td>
                <span :class="['role-badge', `role-${member.role.toLowerCase()}`]">
                  {{ member.role }}
                </span>
              </td>
              <td>{{ formatDate(member.createdAt) }}</td>
              <td v-if="authStore.isAdminOfOrganization(organization.id)" class="actions-cell">
                <button
                  class="action-btn edit"
                  @click="openEditMemberModal(member)"
                  title="Edit Role"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                  </svg>
                </button>
                <button
                  class="action-btn delete"
                  @click="handleRemoveMember(member)"
                  title="Remove"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,12C6.33,12 7,12.67 7,13.5C7,14.33 6.33,15 5.5,15C4.67,15 4,14.33 4,13.5C4,12.67 4.67,12 5.5,12M18.5,12C19.33,12 20,12.67 20,13.5C20,14.33 19.33,15 18.5,15C17.67,15 17,14.33 17,13.5C17,12.67 17.67,12 18.5,12M12,14C13.33,14 18,14.67 18,16V18H6V16C6,14.67 10.67,14 12,14Z" />
      </svg>
      <h3>No organization found</h3>
      <p>You are not a member of any organization.</p>
    </div>

    <!-- Add Member Modal -->
    <div v-if="showAddMemberModal" class="modal-overlay" @click="closeAddMemberModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Add Member</h2>
          <button @click="closeAddMemberModal" class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleAddMember" class="member-form">
            <div class="form-group">
              <label>
                Name <span class="required">*</span>
              </label>
              <input
                v-model="newMemberForm.name"
                type="text"
                class="form-input"
                placeholder="Member name"
                required
                maxlength="200"
              />
            </div>

            <div class="form-group">
              <label>
                Email <span class="required">*</span>
              </label>
              <input
                v-model="newMemberForm.email"
                type="email"
                class="form-input"
                placeholder="member@example.com"
                required
                maxlength="200"
              />
            </div>

            <div class="form-group">
              <label>
                Password <span class="required">*</span>
              </label>
              <input
                v-model="newMemberForm.password"
                type="password"
                class="form-input"
                placeholder="At least 6 characters"
                required
                minlength="6"
              />
              <p class="form-hint">Password for the new member account</p>
            </div>

            <div class="form-group">
              <label>
                Role <span class="required">*</span>
              </label>
              <select v-model="newMemberForm.role" class="form-select" required>
                <option value="Member">Member</option>
                <option value="Editor">Editor</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeAddMemberModal" :disabled="addingMember">
            Cancel
          </button>
          <button
            class="btn-primary"
            @click="handleAddMember"
            :disabled="addingMember || !isNewMemberFormValid"
          >
            {{ addingMember ? 'Adding...' : 'Add Member' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Member Role Modal -->
    <div v-if="showEditMemberModal" class="modal-overlay" @click="closeEditMemberModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Edit Member Role</h2>
          <button @click="closeEditMemberModal" class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleUpdateMember" class="member-form">
            <div class="form-group">
              <label>Member</label>
              <input
                type="text"
                class="form-input"
                :value="editingMember?.userName || 'Unknown'"
                disabled
              />
            </div>

            <div class="form-group">
              <label>
                Role <span class="required">*</span>
              </label>
              <select v-model="editMemberForm.role" class="form-select" required>
                <option value="Member">Member</option>
                <option value="Editor">Editor</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeEditMemberModal" :disabled="updatingMember">
            Cancel
          </button>
          <button
            class="btn-primary"
            @click="handleUpdateMember"
            :disabled="updatingMember"
          >
            {{ updatingMember ? 'Updating...' : 'Update Role' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue'
import {
  OrganizationsApi,
  type OrganizationDetailDto,
  type OrganizationUpdateDto,
  type OrganizationMemberListDto,
  type OrganizationMemberCreateDto,
  type OrganizationMemberUpdateDto,
} from '@/services/Api'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth.store'

const { showToast } = useToast()
const authStore = useAuthStore()

// State
const loading = ref(true)
const saving = ref(false)
const organization = ref<OrganizationDetailDto | null>(null)
const members = ref<OrganizationMemberListDto[]>([])
const loadingMembers = ref(false)
const isEditing = ref(false)
const showAddMemberModal = ref(false)
const showEditMemberModal = ref(false)
const editingMember = ref<OrganizationMemberListDto | null>(null)
const addingMember = ref(false)
const updatingMember = ref(false)

const editForm = reactive<OrganizationUpdateDto>({
  name: '',
  logoUrl: '',
  websiteUrl: '',
})

const newMemberForm = reactive<{
  name: string
  email: string
  password: string
  role: 'Admin' | 'Member' | 'Editor'
}>({
  name: '',
  email: '',
  password: '',
  role: 'Member',
})

const editMemberForm = reactive<OrganizationMemberUpdateDto>({
  role: 'Member',
})

// Computed
const isFormValid = computed(() => {
  return (editForm.name?.trim()?.length ?? 0) > 0
})

const isNewMemberFormValid = computed(() => {
  return (
    newMemberForm.name.trim().length > 0 &&
    newMemberForm.email.trim().length > 0 &&
    newMemberForm.password.length >= 6 &&
    newMemberForm.role.length > 0
  )
})

// Methods
const fetchOrganization = async () => {
  loading.value = true
  try {
    const myOrgs = await OrganizationsApi.getMy()
    if (myOrgs.length > 0) {
      const orgDetail = await OrganizationsApi.get(myOrgs[0].id)
      organization.value = orgDetail
      editForm.name = orgDetail.name
      editForm.logoUrl = orgDetail.logoUrl || ''
      editForm.websiteUrl = orgDetail.websiteUrl || ''
      await fetchMembers(orgDetail.id)
    }
  } catch (error: any) {
    console.error('Failed to load organization:', error)
    showToast({ type: 'error', title: 'Error', message: 'Failed to load organization' })
  } finally {
    loading.value = false
  }
}

const fetchMembers = async (organizationId: string) => {
  loadingMembers.value = true
  try {
    members.value = await OrganizationsApi.getMembers(organizationId)
  } catch (error: any) {
    console.error('Failed to load members:', error)
    showToast({ type: 'error', title: 'Error', message: 'Failed to load members' })
    members.value = []
  } finally {
    loadingMembers.value = false
  }
}

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const toggleEditMode = () => {
  if (organization.value) {
    editForm.name = organization.value.name
    editForm.logoUrl = organization.value.logoUrl || ''
    editForm.websiteUrl = organization.value.websiteUrl || ''
    isEditing.value = true
  }
}

const cancelEdit = () => {
  if (organization.value) {
    editForm.name = organization.value.name
    editForm.logoUrl = organization.value.logoUrl || ''
    editForm.websiteUrl = organization.value.websiteUrl || ''
  }
  isEditing.value = false
}

const handleSaveOrganization = async () => {
  if (!organization.value || !isFormValid.value) return

  saving.value = true
  try {
    const updated = await OrganizationsApi.update(organization.value.id, editForm)
    organization.value = updated
    showToast({ type: 'success', title: 'Success', message: 'Organization updated successfully' })
    isEditing.value = false
  } catch (error: any) {
    console.error('Failed to update organization:', error)
    showToast({ type: 'error', title: 'Error', message: error.message || 'Failed to update organization' })
  } finally {
    saving.value = false
  }
}

const openAddMemberModal = () => {
  newMemberForm.name = ''
  newMemberForm.email = ''
  newMemberForm.password = ''
  newMemberForm.role = 'Member'
  showAddMemberModal.value = true
}

const closeAddMemberModal = () => {
  showAddMemberModal.value = false
  newMemberForm.name = ''
  newMemberForm.email = ''
  newMemberForm.password = ''
  newMemberForm.role = 'Member'
}

const handleAddMember = async () => {
  if (!organization.value || !isNewMemberFormValid.value) return

  addingMember.value = true
  try {
    const memberData: OrganizationMemberCreateDto = {
      organizationId: organization.value.id,
      name: newMemberForm.name.trim(),
      email: newMemberForm.email.trim(),
      password: newMemberForm.password,
      role: newMemberForm.role,
    }
    await OrganizationsApi.addMember(organization.value.id, memberData)
    showToast({ type: 'success', title: 'Success', message: 'Member added successfully' })
    closeAddMemberModal()
    await fetchMembers(organization.value.id)
  } catch (error: any) {
    console.error('Failed to add member:', error)
    showToast({ type: 'error', title: 'Error', message: error.message || 'Failed to add member' })
  } finally {
    addingMember.value = false
  }
}

const openEditMemberModal = (member: OrganizationMemberListDto) => {
  editingMember.value = member
  editMemberForm.role = member.role
  showEditMemberModal.value = true
}

const closeEditMemberModal = () => {
  showEditMemberModal.value = false
  editingMember.value = null
  editMemberForm.role = 'Member'
}

const handleUpdateMember = async () => {
  if (!organization.value || !editingMember.value) return

  updatingMember.value = true
  try {
    await OrganizationsApi.updateMember(
      organization.value.id,
      editingMember.value.id,
      editMemberForm
    )
    showToast({ type: 'success', title: 'Success', message: 'Member role updated successfully' })
    closeEditMemberModal()
    await fetchMembers(organization.value.id)
  } catch (error: any) {
    console.error('Failed to update member:', error)
    showToast({ type: 'error', title: 'Error', message: error.message || 'Failed to update member role' })
  } finally {
    updatingMember.value = false
  }
}

const handleRemoveMember = async (member: OrganizationMemberListDto) => {
  if (!organization.value) return

  if (!confirm(`Are you sure you want to remove "${member.userName}" from the organization?`)) {
    return
  }

  try {
    await OrganizationsApi.removeMember(organization.value.id, member.id)
    showToast({ type: 'success', title: 'Success', message: 'Member removed successfully' })
    await fetchMembers(organization.value.id)
  } catch (error: any) {
    console.error('Failed to remove member:', error)
    showToast({ type: 'error', title: 'Error', message: error.message || 'Failed to remove member' })
  }
}

onMounted(() => {
  fetchOrganization()
})
</script>

<style scoped>
/* Reutilizar estilos del OrganizationsDashboard */
.dashboard {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-top-color: #dbb067;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.spinner.small {
  width: 24px;
  height: 24px;
  border-width: 3px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.org-details-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.org-info-card,
.members-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
}

.card-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
}

.btn-edit,
.btn-add {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: #dbb067;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-edit:hover,
.btn-add:hover {
  background: #c9a05a;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(219, 176, 103, 0.3);
}

.org-info-display {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-row label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
}

.org-logo-display {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.website-link {
  color: #dbb067;
  text-decoration: none;
  font-weight: 500;
}

.website-link:hover {
  text-decoration: underline;
}

.org-info-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.required {
  color: #ef4444;
}

.form-input,
.form-select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9375rem;
  transition: all 0.2s;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #dbb067;
  box-shadow: 0 0 0 3px rgba(219, 176, 103, 0.1);
}

.form-hint {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #dbb067;
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: #c9a05a;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(219, 176, 103, 0.3);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover:not(:disabled) {
  background: #e5e7eb;
}

.loading-members {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 2rem;
  justify-content: center;
  color: #6b7280;
}

.empty-members {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
}

.members-table {
  width: 100%;
  border-collapse: collapse;
}

.members-table thead {
  background: #f9fafb;
}

.members-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid #e2e8f0;
}

.members-table td {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  color: #1f2937;
}

.member-name {
  font-weight: 600;
  color: #1a202c;
}

.role-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.role-admin {
  background: #dbeafe;
  color: #1e40af;
}

.role-editor {
  background: #fef3c7;
  color: #92400e;
}

.role-member {
  background: #f3f4f6;
  color: #374151;
}

.actions-cell {
  width: 100px;
}

.action-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
}

.action-btn.edit {
  color: #dbb067;
}

.action-btn.edit:hover {
  background: rgba(219, 176, 103, 0.1);
}

.action-btn.delete {
  color: #ef4444;
}

.action-btn.delete:hover {
  background: rgba(239, 68, 68, 0.1);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: #6b7280;
}

.empty-state svg {
  opacity: 0.5;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin: 0.5rem 0;
  color: #374151;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  line-height: 1;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: #f9fafb;
}

.member-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
