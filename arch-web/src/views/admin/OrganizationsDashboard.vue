<!-- ============================================== -->
<!-- RUTA: src/views/admin/OrganizationsDashboard.vue -->
<!-- ============================================== -->

<template>
  <div class="dashboard">
    <!-- Header -->
    <div class="dashboard-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Organizations Management</h1>
          <p class="page-subtitle">Manage organizations and their members</p>
        </div>
        <div class="header-actions">
          <button class="btn-create" @click="openCreateModal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
            </svg>
            Create Organization
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon total">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z"
            />
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ totalOrganizations }}</span>
          <span class="stat-label">Total Organizations</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon members">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"
            />
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ totalMembers }}</span>
          <span class="stat-label">Total Members</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon admins">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12,1L8,5H11V14H13V5H16M18,23H6C4.89,23 4,22.1 4,21V9A2,2 0 0,1 6,7H9V9H6V21H18V9H15V7H18A2,2 0 0,1 20,9V21A2,2 0 0,1 18,23Z"
            />
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ totalAdmins }}</span>
          <span class="stat-label">Organization Admins</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon recent">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,19L11,13.8V7H12.5V13.2L17,17.7L16.2,19Z"
            />
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ recentOrganizations }}</span>
          <span class="stat-label">Created This Month</span>
        </div>
      </div>
    </div>

    <!-- Skeleton loading state -->
    <div v-if="loading">
      <TableSkeleton
        :rows="8"
        :columns="[
          { type: 'text', size: 'large' },
          { type: 'image', size: 'medium' },
          { type: 'link' },
          { type: 'text', size: 'small' },
          { type: 'text', size: 'small' },
          { type: 'actions', count: 3 }
        ]"
      />
    </div>

    <!-- Organizations Table -->
    <div v-else class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>
              <div class="sortable-header" @click="changeSort('name')">
                Organization Name
                <span class="sort-indicator" v-if="sortBy === 'name'">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th>Logo</th>
            <th>Website</th>
            <th>Members</th>
            <th>
              <div class="sortable-header" @click="changeSort('date')">
                Created At
                <span class="sort-indicator" v-if="sortBy === 'date'">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th class="actions-cell">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="sortedOrganizations.length === 0" class="table-row">
            <td colspan="6" class="empty-state-cell">
              <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z"
                  />
                </svg>
                <h3>No organizations found</h3>
                <p>Create your first organization to get started</p>
              </div>
            </td>
          </tr>
          <tr
            v-for="org in sortedOrganizations"
            :key="org.id"
            class="table-row"
            @click="openDetailModal(org)"
          >
            <td>
              <div class="org-name-cell">
                <strong>{{ org.name }}</strong>
              </div>
            </td>
            <td>
              <ImageWithSkeleton
                v-if="org.logoUrl"
                :src="org.logoUrl"
                :alt="org.name"
                :width="40"
                :height="40"
                :border-radius="8"
                image-class="org-logo"
              />
              <span v-else class="no-logo">No logo</span>
            </td>
            <td>
              <a
                v-if="org.websiteUrl"
                :href="org.websiteUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="website-link"
                @click.stop
              >
                {{ org.websiteUrl }}
              </a>
              <span v-else class="no-website">No website</span>
            </td>
            <td>
              <span class="members-count">{{ getMemberCount(org.id) }} member(s)</span>
            </td>
            <td>{{ formatDate(org.createdAt) }}</td>
            <td class="actions-cell" @click.stop>
              <button class="action-btn view" @click="openDetailModal(org)" title="View Details">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"
                  />
                </svg>
              </button>
              <button class="action-btn edit" @click="openEditModal(org)" title="Edit">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"
                  />
                </svg>
              </button>
              <button class="action-btn delete" @click="handleDelete(org)" title="Delete">
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

    <!-- Detail Modal (with Members Management) -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeModals">
      <div class="modal-content large-modal" @click.stop>
        <div class="modal-header">
          <h2>Organization Details</h2>
          <button @click="closeModals" class="modal-close">×</button>
        </div>
        <div class="modal-body" v-if="selectedOrganization">
          <div class="detail-section">
            <h4>Name</h4>
            <p><strong>{{ selectedOrganization.name }}</strong></p>
          </div>

          <div class="detail-section" v-if="selectedOrganization.logoUrl">
            <h4>Logo</h4>
            <ImageWithSkeleton
              :src="selectedOrganization.logoUrl"
              :alt="selectedOrganization.name"
              :width="120"
              :height="120"
              :border-radius="12"
              image-class="detail-logo"
            />
          </div>

          <div class="detail-section" v-if="selectedOrganization.websiteUrl">
            <h4>Website</h4>
            <a
              :href="selectedOrganization.websiteUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="website-link"
            >
              {{ selectedOrganization.websiteUrl }}
            </a>
          </div>

          <div class="detail-section">
            <h4>Created At</h4>
            <p>{{ formatDate(selectedOrganization.createdAt) }}</p>
          </div>

          <div class="detail-section">
            <h4>Updated At</h4>
            <p>{{ formatDate(selectedOrganization.updatedAt) }}</p>
          </div>

          <!-- Members Section -->
          <div class="members-section">
            <div class="members-header">
              <h4>Members ({{ organizationMembers.length }})</h4>
              <button class="btn-small" @click="openAddMemberModal" :disabled="loadingMembers">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                </svg>
                Add Member
              </button>
            </div>

            <div v-if="loadingMembers" class="loading-members">
              <div class="spinner small"></div>
              <span>Loading members...</span>
            </div>

            <div v-else-if="organizationMembers.length === 0" class="empty-members">
              <p>No members yet. Add a member to get started.</p>
            </div>

            <table v-else class="members-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th class="actions-cell">Actions</th>
                </tr>
              </thead>
               <tbody>
                 <tr v-for="member in organizationMembers" :key="member.id">
                   <td>{{ member.userName }}</td>
                   <td>{{ member.userEmail }}</td>
                   <td>
                     <span :class="['role-badge', member.role.toLowerCase()]">
                       {{ member.role }}
                     </span>
                   </td>
                   <td>{{ formatDate(member.createdAt) }}</td>
                  <td class="actions-cell">
                    <button
                      class="action-btn edit"
                      @click="openEditMemberModal(member)"
                      title="Edit Role"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path
                          d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"
                        />
                      </svg>
                    </button>
                    <button
                      class="action-btn delete"
                      @click="handleRemoveMember(member)"
                      title="Remove"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
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
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeModals">Close</button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Organization Modal -->
    <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeCreateModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ isEditing ? 'Edit Organization' : 'Create New Organization' }}</h2>
          <button @click="closeCreateModal" class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSaveOrganization" class="org-form">
            <div class="form-group">
              <label>
                Organization Name <span class="required">*</span>
              </label>
              <input
                v-model="orgForm.name"
                type="text"
                class="form-input"
                placeholder="e.g., Oxford Tech Society"
                required
                maxlength="200"
              />
            </div>

            <div class="form-group">
              <label>Logo URL (optional)</label>
              <input
                v-model="orgForm.logoUrl"
                type="url"
                class="form-input"
                placeholder="https://example.com/logo.png"
                maxlength="500"
              />
              <p class="form-hint">URL to the organization's logo image</p>
            </div>

            <div class="form-group">
              <label>Website URL (optional)</label>
              <input
                v-model="orgForm.websiteUrl"
                type="url"
                class="form-input"
                placeholder="https://example.com"
                maxlength="500"
              />
              <p class="form-hint">Organization's website URL</p>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeCreateModal" :disabled="saving">
            Cancel
          </button>
          <button
            class="btn-primary"
            @click="handleSaveOrganization"
            :disabled="saving || !isFormValid"
          >
            {{ saving ? (isEditing ? 'Saving...' : 'Creating...') : (isEditing ? 'Save Changes' : 'Create Organization') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Add Member Modal (Create New User) -->
    <div v-if="showAddMemberModal" class="modal-overlay" @click="closeAddMemberModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Create New Member for {{ selectedOrganization?.name }}</h2>
          <button @click="closeAddMemberModal" class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleAddMember" class="member-form">
            <div class="form-group">
              <label>
                Full Name <span class="required">*</span>
              </label>
              <input
                v-model="newMemberForm.name"
                type="text"
                class="form-input"
                placeholder="e.g., John Doe"
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
                placeholder="user@example.com"
                required
                maxlength="200"
              />
              <p class="form-hint">This email will be used for login</p>
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
               <p class="form-hint">Minimum 6 characters. The user will be created as a verified staff-user and can login immediately.</p>
             </div>

            <div class="form-group">
              <label>
                Role in Organization <span class="required">*</span>
              </label>
              <select v-model="newMemberForm.role" class="form-select" required>
                <option value="Member">Member</option>
                <option value="Editor">Editor</option>
                <option value="Admin">Admin</option>
              </select>
              <p class="form-hint">The role this user will have in the organization</p>
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
            {{ addingMember ? 'Creating...' : 'Create Member' }}
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
import TableSkeleton from '@/components/ui/TableSkeleton.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
import ImageWithSkeleton from '@/components/ui/ImageWithSkeleton.vue'
import {
  OrganizationsApi,
  type OrganizationListDto,
  type OrganizationDetailDto,
  type OrganizationCreateDto,
  type OrganizationUpdateDto,
  type OrganizationMemberListDto,
  type OrganizationMemberCreateDto,
  type OrganizationMemberUpdateDto,
} from '@/services/Api'
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()

// State
const loading = ref(true)
const saving = ref(false)
const processing = ref(false)
const organizations = ref<OrganizationListDto[]>([])
const organizationMembersMap = ref<Record<string, OrganizationMemberListDto[]>>({})
const loadingMembers = ref(false)
const selectedOrganization = ref<OrganizationDetailDto | null>(null)
const showDetailModal = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showAddMemberModal = ref(false)
const showEditMemberModal = ref(false)
const editingMember = ref<OrganizationMemberListDto | null>(null)
const addingMember = ref(false)
const updatingMember = ref(false)
const sortBy = ref<'name' | 'date'>('date')
const sortDirection = ref<'asc' | 'desc'>('desc')
const logoLoaded = ref(false)

const orgForm = reactive<OrganizationCreateDto>({
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
const sortedOrganizations = computed(() => {
  const items = [...organizations.value]

  return items.sort((a, b) => {
    const dir = sortDirection.value === 'asc' ? 1 : -1

    switch (sortBy.value) {
      case 'name': {
        return a.name.localeCompare(b.name) * dir
      }
      case 'date':
      default: {
        const ad = new Date(a.createdAt).getTime()
        const bd = new Date(b.createdAt).getTime()
        return (ad - bd) * dir
      }
    }
  })
})

const totalOrganizations = computed(() => organizations.value.length)

const totalMembers = computed(() => {
  return Object.values(organizationMembersMap.value).reduce(
    (sum, members) => sum + members.length,
    0
  )
})

const totalAdmins = computed(() => {
  return Object.values(organizationMembersMap.value).reduce((sum, members) => {
    return sum + members.filter((m) => m.role === 'Admin').length
  }, 0)
})

const recentOrganizations = computed(() => {
  const now = new Date()
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
  return organizations.value.filter((org) => {
    const created = new Date(org.createdAt)
    return created >= oneMonthAgo
  }).length
})

const organizationMembers = computed(() => {
  if (!selectedOrganization.value) return []
  return organizationMembersMap.value[selectedOrganization.value.id] || []
})

const isEditing = computed(() => showEditModal.value)

const isFormValid = computed(() => {
  return orgForm.name.trim().length > 0
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
const changeSort = (key: 'name' | 'date') => {
  if (sortBy.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = key
    sortDirection.value = key === 'date' ? 'desc' : 'asc'
  }
}

const fetchOrganizations = async () => {
  loading.value = true
  try {
    organizations.value = await OrganizationsApi.list()
    // Cargar miembros de todas las organizaciones
    await fetchAllMembers()
  } catch (error: any) {
    console.error('Failed to load organizations:', error)
    showToast({ type: 'error', title: 'Error', message: 'Failed to load organizations' })
  } finally {
    loading.value = false
  }
}

const fetchAllMembers = async () => {
  // Cargar miembros de todas las organizaciones en paralelo
  const memberPromises = organizations.value.map(async (org) => {
    try {
      const members = await OrganizationsApi.getMembers(org.id)
      organizationMembersMap.value[org.id] = members
    } catch (error: any) {
      console.error(`Failed to load members for organization ${org.id}:`, error)
      organizationMembersMap.value[org.id] = []
    }
  })
  await Promise.all(memberPromises)
}

const fetchMembers = async (organizationId: string) => {
  loadingMembers.value = true
  try {
    const members = await OrganizationsApi.getMembers(organizationId)
    organizationMembersMap.value[organizationId] = members
  } catch (error: any) {
    console.error('Failed to load members:', error)
    showToast({ type: 'error', title: 'Error', message: 'Failed to load members' })
    organizationMembersMap.value[organizationId] = []
  } finally {
    loadingMembers.value = false
  }
}

const getMemberCount = (organizationId: string): number => {
  return organizationMembersMap.value[organizationId]?.length || 0
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

const openDetailModal = async (org: OrganizationListDto) => {
  logoLoaded.value = false // Reset logo loading state
  try {
    const detail = await OrganizationsApi.get(org.id)
    selectedOrganization.value = detail
    showDetailModal.value = true
    await fetchMembers(org.id)
  } catch (error: any) {
    console.error('Failed to load organization details:', error)
    selectedOrganization.value = org as unknown as OrganizationDetailDto
    showDetailModal.value = true
    await fetchMembers(org.id)
  }
}

const closeModals = () => {
  showDetailModal.value = false
  selectedOrganization.value = null
}

const openCreateModal = () => {
  showCreateModal.value = true
  orgForm.name = ''
  orgForm.logoUrl = ''
  orgForm.websiteUrl = ''
}

const openEditModal = async (org: OrganizationListDto) => {
  try {
    const detail = await OrganizationsApi.get(org.id)
    selectedOrganization.value = detail
    orgForm.name = detail.name
    orgForm.logoUrl = detail.logoUrl || ''
    orgForm.websiteUrl = detail.websiteUrl || ''
    showEditModal.value = true
  } catch (error: any) {
    console.error('Failed to load organization details:', error)
    orgForm.name = org.name
    orgForm.logoUrl = org.logoUrl || ''
    orgForm.websiteUrl = org.websiteUrl || ''
    showEditModal.value = true
  }
}

const closeCreateModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  orgForm.name = ''
  orgForm.logoUrl = ''
  orgForm.websiteUrl = ''
  selectedOrganization.value = null
}

const handleSaveOrganization = async () => {
  if (!isFormValid.value) {
    showToast({ type: 'error', title: 'Validation Error', message: 'Please fill in all required fields' })
    return
  }

  saving.value = true
  try {
    if (isEditing.value && selectedOrganization.value) {
      const updateData: OrganizationUpdateDto = {
        name: orgForm.name.trim(),
        logoUrl: orgForm.logoUrl?.trim() || undefined,
        websiteUrl: orgForm.websiteUrl?.trim() || undefined,
      }
      await OrganizationsApi.update(selectedOrganization.value.id, updateData)
      showToast({ type: 'success', title: 'Success', message: 'Organization updated successfully' })
    } else {
      const createData: OrganizationCreateDto = {
        name: orgForm.name.trim(),
        logoUrl: orgForm.logoUrl?.trim() || undefined,
        websiteUrl: orgForm.websiteUrl?.trim() || undefined,
      }
      await OrganizationsApi.create(createData)
      showToast({ type: 'success', title: 'Success', message: 'Organization created successfully' })
    }
    closeCreateModal()
    fetchOrganizations()
  } catch (error: any) {
    console.error('Failed to save organization:', error)
    showToast({ type: 'error', title: 'Error', message: error.message || 'Failed to save organization' })
  } finally {
    saving.value = false
  }
}

const handleDelete = async (org: OrganizationListDto) => {
  if (!confirm(`Are you sure you want to delete "${org.name}"? This action cannot be undone.`)) {
    return
  }

  processing.value = true
  try {
    await OrganizationsApi.remove(org.id)
    showToast({ type: 'success', title: 'Success', message: 'Organization deleted successfully' })
    fetchOrganizations()
  } catch (error: any) {
    console.error('Failed to delete organization:', error)
    showToast({ type: 'error', title: 'Error', message: error.message || 'Failed to delete organization' })
  } finally {
    processing.value = false
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
  if (!selectedOrganization.value || !isNewMemberFormValid.value) {
    showToast({ type: 'error', title: 'Validation Error', message: 'Please fill in all required fields correctly' })
    return
  }

  addingMember.value = true
  try {
    // Use the new endpoint that creates the user automatically
    const memberData: OrganizationMemberCreateDto = {
      organizationId: selectedOrganization.value.id,
      name: newMemberForm.name.trim(),
      email: newMemberForm.email.trim(),
      password: newMemberForm.password,
      role: newMemberForm.role,
    }

    await OrganizationsApi.addMember(selectedOrganization.value.id, memberData)

    showToast({
      type: 'success',
      title: 'Success',
      message: `Member "${newMemberForm.name}" created and added to organization successfully. They can now login with email: ${newMemberForm.email}`,
    })
    closeAddMemberModal()
    await fetchMembers(selectedOrganization.value.id)
  } catch (error: any) {
    console.error('Failed to create member:', error)
    const errorMessage =
      error.message || error.response?.data?.message || 'Failed to create member'
    showToast({ type: 'error', title: 'Error', message: errorMessage })
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
  if (!selectedOrganization.value || !editingMember.value) {
    return
  }

  updatingMember.value = true
  try {
    await OrganizationsApi.updateMember(
      selectedOrganization.value.id,
      editingMember.value.id,
      { role: editMemberForm.role }
    )
    showToast({ type: 'success', title: 'Success', message: 'Member role updated successfully' })
    closeEditMemberModal()
    await fetchMembers(selectedOrganization.value.id)
  } catch (error: any) {
    console.error('Failed to update member:', error)
    showToast({ type: 'error', title: 'Error', message: error.message || 'Failed to update member' })
  } finally {
    updatingMember.value = false
  }
}

const handleRemoveMember = async (member: OrganizationMemberListDto) => {
  if (!selectedOrganization.value) {
    return
  }

  if (!confirm(`Are you sure you want to remove "${member.userName}" from the organization?`)) {
    return
  }

  processing.value = true
  try {
    await OrganizationsApi.removeMember(selectedOrganization.value.id, member.id)
    showToast({ type: 'success', title: 'Success', message: 'Member removed successfully' })
    await fetchMembers(selectedOrganization.value.id)
  } catch (error: any) {
    console.error('Failed to remove member:', error)
    showToast({ type: 'error', title: 'Error', message: error.message || 'Failed to remove member' })
  } finally {
    processing.value = false
  }
}

onMounted(() => {
  fetchOrganizations()
})
</script>

<style scoped>
/* ==================== BASE DASHBOARD STYLES ==================== */
.dashboard {
  padding: 0;
  min-height: 100vh;
  background: #f9fafb;
}

.dashboard-header {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 2rem 2.5rem;
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  max-width: 1600px;
  margin: 0 auto;
}

.header-text {
  flex: 1;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-create {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #dbb067;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9375rem;
}

.btn-create:hover {
  background: #c9a05a;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(219, 176, 103, 0.3);
}

.btn-create:active {
  transform: translateY(0);
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 1rem;
  color: #718096;
  margin: 0;
}

/* ==================== STATS CARDS ==================== */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  padding: 1.5rem 2.5rem;
  max-width: 1600px;
  margin: 0 auto;
}

.stat-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.total {
  background: #dbeafe;
  color: #2563eb;
}
.stat-icon.members {
  background: #e0e7ff;
  color: #6366f1;
}
.stat-icon.admins {
  background: #fef3c7;
  color: #d97706;
}
.stat-icon.recent {
  background: #d1fae5;
  color: #059669;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
}

/* ==================== LOADING & EMPTY STATES ==================== */
.loading-state {
  text-align: center;
  padding: 4rem 2rem;
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

.spinner.small {
  width: 20px;
  height: 20px;
  border-width: 2px;
  margin: 0;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  text-align: center;
  padding: 2rem;
}

.empty-state svg {
  color: #d1d5db;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  color: #6b7280;
  margin: 0;
}

.empty-state-cell {
  text-align: center;
  padding: 4rem 2rem;
}

/* ==================== TABLE ==================== */
.table-container {
  padding: 2rem 2.5rem;
  max-width: 1600px;
  margin: 0 auto;
}

.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.data-table th,
.data-table td {
  padding: 1rem 1.25rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.data-table th {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  color: #475569;
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.data-table td {
  color: #1e293b;
  font-weight: 500;
  font-size: 0.9375rem;
}

.table-row {
  cursor: pointer;
  transition: background-color 0.2s;
}

.table-row:hover {
  background-color: #f8fafc;
}

.table-row:last-child td {
  border-bottom: none;
}

.org-name-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.org-name-cell strong {
  color: #1e293b;
}

.org-logo {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.no-logo,
.no-website {
  color: #9ca3af;
  font-size: 0.875rem;
}

.website-link {
  color: #2563eb;
  text-decoration: none;
  word-break: break-all;
  font-size: 0.875rem;
}

.website-link:hover {
  text-decoration: underline;
}

.members-count {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.sortable-header {
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sortable-header:hover {
  color: #1e293b;
}

.sort-indicator {
  font-size: 0.7rem;
}

/* ==================== ACTION BUTTONS ==================== */
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
  transition: all 0.2s;
  margin-left: 0.5rem;
}

.action-btn.view {
  color: #3b82f6;
}

.action-btn.view:hover {
  background: #eff6ff;
  border-color: #bfdbfe;
}

.action-btn.edit {
  color: #d97706;
}

.action-btn.edit:hover {
  background: #fef3c7;
  border-color: #fcd34d;
}

.action-btn.delete {
  color: #dc2626;
}

.action-btn.delete:hover {
  background: #fee2e2;
  border-color: #fca5a5;
}

/* ==================== MODAL ==================== */
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
  padding: 2rem;
  overflow-y: auto;
}

.modal-content {
  background: #fff;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-content.large-modal {
  max-width: 900px;
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
  overflow-x: hidden;
  flex: 1;
  min-height: 0;
  max-height: calc(90vh - 140px);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: #f9fafb;
  flex-shrink: 0;
}

/* ==================== DETAIL SECTIONS ==================== */
.detail-section {
  margin-bottom: 1.5rem;
}

.detail-section h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-section p {
  margin: 0;
  color: #1f2937;
}

.logo-container {
  position: relative;
  width: 120px;
  height: 120px;
}

.detail-logo {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

/* ==================== MEMBERS SECTION ==================== */
.members-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e2e8f0;
}

.members-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.members-header h4 {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.btn-small {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #dbb067;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-small:hover {
  background: #c9a05a;
}

.btn-small:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-members {
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  border-collapse: separate;
  border-spacing: 0;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.members-table th,
.members-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.875rem;
}

.members-table th {
  background: #f9fafb;
  color: #475569;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.members-table tr:last-child td {
  border-bottom: none;
}

.role-badge {
  display: inline-flex;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.role-badge.admin {
  background: #fee2e2;
  color: #991b1b;
}

.role-badge.editor {
  background: #fef3c7;
  color: #92400e;
}

.role-badge.member {
  background: #dbeafe;
  color: #1e40af;
}

/* ==================== BUTTONS ==================== */
.btn-primary {
  background: #dbb067;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #c9a05a;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #4b5563;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

/* ==================== FORM STYLES ==================== */
.org-form,
.member-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  color: #dc2626;
  margin-left: 0.25rem;
}

.form-input,
.form-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9375rem;
  transition: all 0.2s;
  background: #fff;
  font-family: inherit;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #dbb067;
  box-shadow: 0 0 0 3px rgba(219, 176, 103, 0.1);
}

.form-input:disabled {
  background: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
}

.form-hint {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

/* ==================== RESPONSIVE ==================== */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    padding: 1.5rem;
  }

  .stats-grid {
    padding: 1rem;
    gap: 1rem;
  }

  .table-container {
    padding: 1rem;
    overflow-x: auto;
  }

  .data-table {
    min-width: 800px;
  }

  .modal-content {
    margin: 1rem;
    max-width: calc(100% - 2rem);
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
