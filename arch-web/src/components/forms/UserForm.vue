<template>
  <form @submit.prevent="saveUser" class="modern-form">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading user data...</p>
    </div>
    <div v-else class="form-sections">
      <div class="form-group user-type-selector">
        <label class="form-label">User Type <span class="required">*</span></label>
        <div class="user-type-cards">
          <label
            class="user-type-card"
            :class="{ active: form.userType === 'user' }"
            @click="handleUserTypeChange('user')"
          >
            <input
              type="radio"
              name="userType"
              value="user"
              v-model="form.userType"
              class="sr-only"
            />
            <div class="card-icon student">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M16,17V19H2V17S2,13 9,13 16,17 16,17M12.5,7.5A3.5,3.5 0 0,1 9,11A3.5,3.5 0 0,1 5.5,7.5A3.5,3.5 0 0,1 9,4A3.5,3.5 0 0,1 12.5,7.5M15.94,13C18.23,13.72 20,15.36 20,17V19H18V17C18,15.36 17.5,14.14 15.94,13M15,4A3.39,3.39 0 0,1 18.5,7.5A3.5,3.5 0 0,1 15,11V9A1.5,1.5 0 0,0 16.5,7.5A1.5,1.5 0 0,0 15,6V4Z"
                />
              </svg>
            </div>
            <div class="card-content">
              <h4>Oxford</h4>
              <p>Oxford University members</p>
              <span class="email-requirement">Requires @ox.ac.uk email</span>
            </div>
          </label>

          <label
            class="user-type-card"
            :class="{ active: form.userType === 'staff-user' }"
            @click="handleUserTypeChange('staff-user')"
          >
            <input
              type="radio"
              name="userType"
              value="staff-user"
              v-model="form.userType"
              class="sr-only"
            />
            <div class="card-icon staff">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z"
                />
              </svg>
            </div>
            <div class="card-content">
              <h4>Staff</h4>
              <p>Staff member / Organization</p>
              <span class="email-requirement">Any email allowed</span>
            </div>
          </label>

          <label
            class="user-type-card"
            :class="{ active: form.userType === 'moderator' }"
            @click="handleUserTypeChange('moderator')"
          >
            <input
              type="radio"
              name="userType"
              value="moderator"
              v-model="form.userType"
              class="sr-only"
            />
            <div class="card-icon moderator">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12,2L2,7V13C2,17.55 4.84,21.74 9,23C9,23 10,23 12,23C14,23 15,23 15,23C19.16,21.74 22,17.55 22,13V7L12,2M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M17.13,17C15.92,18.85 14.11,20.24 12,20.92C9.89,20.24 8.08,18.85 6.87,17C6.53,16.5 6.24,16 6,15.47C6,13.82 8.71,12.47 12,12.47C15.29,12.47 18,13.79 18,15.47C17.76,16 17.47,16.5 17.13,17Z"
                />
              </svg>
            </div>
            <div class="card-content">
              <h4>Moderator</h4>
              <p>Content moderator</p>
              <span class="email-requirement">Any email allowed</span>
            </div>
          </label>

          <label
            class="user-type-card"
            :class="{ active: form.userType === 'admin' }"
            @click="handleUserTypeChange('admin')"
          >
            <input
              type="radio"
              name="userType"
              value="admin"
              v-model="form.userType"
              class="sr-only"
            />
            <div class="card-icon admin">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M17.13,17C15.92,18.85 14.11,20.24 12,20.92C9.89,20.24 8.08,18.85 6.87,17C6.53,16.5 6.24,16 6,15.47C6,13.82 8.71,12.47 12,12.47C15.29,12.47 18,13.79 18,15.47C17.76,16 17.47,16.5 17.13,17Z"
                />
              </svg>
            </div>
            <div class="card-content">
              <h4>Admin</h4>
              <p>Full system access</p>
              <span class="email-requirement">Any email allowed</span>
            </div>
          </label>
        </div>
      </div>

      <!-- ✅ Selector de userRole Oxford -->
      <transition name="slide-fade">
        <div v-if="form.userType === 'user'" class="form-group oxford-subtype-selector">
          <label class="form-label">
            Oxford Member Status
            <span class="required">*</span>
            <span class="info-badge">User role</span>
          </label>
          <div class="subtype-options">
            <label
              class="subtype-option"
              :class="{ active: oxfordSubtype === 'current_student' }"
              @click="oxfordSubtype = 'current_student'"
            >
              <input
                type="radio"
                name="oxfordSubtype"
                value="current_student"
                v-model="oxfordSubtype"
                class="sr-only"
              />
              <div class="subtype-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z"
                  />
                </svg>
              </div>
              <div class="subtype-text">
                <span class="subtype-title">Student</span>
                <span class="subtype-desc">Currently enrolled at Oxford</span>
              </div>
              <div class="check-mark" v-if="oxfordSubtype === 'current_student'">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                </svg>
              </div>
            </label>

            <label
              class="subtype-option"
              :class="{ active: oxfordSubtype === 'alumni' }"
              @click="oxfordSubtype = 'alumni'"
            >
              <input
                type="radio"
                name="oxfordSubtype"
                value="alumni"
                v-model="oxfordSubtype"
                class="sr-only"
              />
              <div class="subtype-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z"
                  />
                </svg>
              </div>
              <div class="subtype-text">
                <span class="subtype-title">Alumni</span>
                <span class="subtype-desc">Oxford graduate</span>
              </div>
              <div class="check-mark" v-if="oxfordSubtype === 'alumni'">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                </svg>
              </div>
            </label>
          </div>
          <p class="field-hint">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
              />
            </svg>
            Select the status for this Oxford user
          </p>
        </div>
      </transition>

      <!-- ✅ NUEVO: Selector de subtipo Staff -->
      <transition name="slide-fade">
        <div v-if="form.userType === 'staff-user'" class="form-group oxford-subtype-selector">
          <label class="form-label">
            Staff Role Type
            <span class="required">*</span>
            <span class="info-badge">Role assignment</span>
          </label>
          <div class="subtype-options">
            <label
              class="subtype-option"
              :class="{ active: staffSubtype === 'staff' }"
              @click="staffSubtype = 'staff'"
            >
              <input
                type="radio"
                name="staffSubtype"
                value="staff"
                v-model="staffSubtype"
                class="sr-only"
              />
              <div class="subtype-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z"
                  />
                </svg>
              </div>
              <div class="subtype-text">
                <span class="subtype-title">Staff</span>
                <span class="subtype-desc">Staff member with standard permissions</span>
              </div>
              <div class="check-mark" v-if="staffSubtype === 'staff'">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                </svg>
              </div>
            </label>

            <label
              class="subtype-option"
              :class="{ active: staffSubtype === 'scanner' }"
              @click="staffSubtype = 'scanner'"
            >
              <input
                type="radio"
                name="staffSubtype"
                value="scanner"
                v-model="staffSubtype"
                class="sr-only"
              />
              <div class="subtype-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M4,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M4,6V18H20V6H4M5,8H19V10H5V8M5,11H19V13H5V11M5,14H19V16H5V14Z"
                  />
                </svg>
              </div>
              <div class="subtype-text">
                <span class="subtype-title">Organizador</span>
                <span class="subtype-desc">Event organizer with scanner permissions</span>
              </div>
              <div class="check-mark" v-if="staffSubtype === 'scanner'">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                </svg>
              </div>
            </label>
          </div>
          <p class="field-hint">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
              />
            </svg>
            Staff = Staff role | Organizador = Scanner role
          </p>
        </div>
      </transition>

      <div class="form-group">
        <label class="form-label">
          <template v-if="form.userType === 'staff-user'">Organization Name</template>
          <template v-else>Name</template>
          <span class="required">*</span>
        </label>
        <input 
          v-model="form.name" 
          class="form-input" 
          type="text" 
          required 
          :placeholder="form.userType === 'staff-user' ? 'Organization Name' : 'John Doe'" 
        />
        <p v-if="form.userType === 'staff-user'" class="field-hint">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
            />
          </svg>
          Enter the name of your organization
        </p>
      </div>

      <div class="form-group">
        <label class="form-label">Email <span class="required">*</span></label>
        <input
          v-model="form.email"
          class="form-input"
          type="email"
          required
          :placeholder="getEmailPlaceholder()"
        />
        <p v-if="form.userType === 'user'" class="field-hint">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
            />
          </svg>
          Must be an Oxford University email (@ox.ac.uk or @oxford.ac.uk)
        </p>
        <p v-if="form.userType === 'staff-user'" class="field-hint">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
            />
          </svg>
          Only Oxford University domains (@ox.ac.uk) are allowed for organizations
        </p>
      </div>

      <div class="form-group">
        <label class="form-label">
          Password
          <span v-if="!isEditing" class="required">*</span>
          <span v-else class="optional-hint">(leave blank to keep current)</span>
        </label>
        <input
          v-model="form.password"
          class="form-input"
          type="password"
          :placeholder="isEditing ? 'Leave blank to keep current password' : 'Min. 8 characters'"
          :required="!isEditing"
        />
      </div>

      <div class="form-group">
        <label class="form-label">Role <span class="required">*</span></label>
        <select v-model="form.userType" class="form-select" :disabled="!canChangeRole">
          <option value="user">User</option>
          <option value="staff-user">Staff User</option>
          <option value="moderator">Moderator</option>
          <option value="admin">Admin</option>
        </select>
        <p v-if="!canChangeRole" class="field-hint">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9"
            />
          </svg>
          Role is locked based on user type. Only admins can change roles when editing.
        </p>
        <p v-else class="field-hint">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
            />
          </svg>
          Role determines system permissions
        </p>
      </div>

      <div class="form-group">
        <div class="preferences-header">
          <label class="form-label">
            Preferences
            <span
              class="preferences-count"
              :class="{ 'limit-reached': selectedPreferenceIds.length >= maxPreferences }"
            >
              {{ selectedPreferenceIds.length }}/{{ maxPreferences }}
            </span>
          </label>
          <div v-if="selectedPreferenceIds.length >= maxPreferences" class="limit-warning">
            Maximum preferences selected
          </div>
        </div>

        <div v-if="loadingPreferences" class="preferences-loading">
          <div class="spinner-small"></div>
          <span>Loading preferences...</span>
        </div>

        <div v-else class="preferences-container">
          <div class="search-box">
            <svg
              class="search-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="Search preferences..."
            />
            <button
              v-if="searchQuery"
              type="button"
              class="clear-search"
              @click="searchQuery = ''"
              title="Clear search"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
                />
              </svg>
            </button>
          </div>

          <div class="preferences-list">
            <div
              v-for="pref in filteredPreferences"
              :key="pref.preferenceId"
              class="preference-item"
              :class="{ disabled: !canSelectMore && !isPreferenceSelected(pref.preferenceId) }"
            >
              <input
                type="checkbox"
                :id="pref.preferenceId"
                :value="pref.preferenceId"
                v-model="selectedPreferenceIds"
                :disabled="!canSelectMore && !isPreferenceSelected(pref.preferenceId)"
                class="preference-checkbox"
              />
              <label :for="pref.preferenceId" class="preference-label">
                {{ pref.name }}
              </label>
            </div>

            <div v-if="filteredPreferences.length === 0" class="no-results">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
                <path
                  d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
                />
              </svg>
              <p>No preferences found</p>
            </div>
          </div>

          <div v-if="selectedPreferences.length > 0" class="selected-preferences">
            <div class="selected-header">Selected:</div>
            <div class="chips-container">
              <div
                v-for="pref in selectedPreferences"
                :key="pref.preferenceId"
                class="preference-chip"
              >
                <span>{{ pref.name }}</span>
                <button
                  type="button"
                  class="chip-remove"
                  @click="removePreference(pref.preferenceId)"
                  title="Remove"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="form-actions">
      <button
        type="submit"
        class="btn-primary"
        :disabled="
          submitting ||
          loading ||
          (form.userType === 'user' && !oxfordSubtype) ||
          (form.userType === 'staff-user' && !staffSubtype)
        "
      >
        <span v-if="submitting" class="btn-content">
          <div class="spinner-small"></div>
          Saving...
        </span>
        <span v-else class="btn-content">
          <template v-if="isEditing">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z"
              />
            </svg>
            Save User
          </template>
          <template v-else>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
            </svg>
            Create User
          </template>
        </span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, onBeforeUnmount, computed } from 'vue'
import { UserApi, PreferencesApi, type PreferenceDto, type UserDetailDto, type UserRole } from '@/services/Api'
import { handleApiError } from '@/utils/validators'
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()

const props = defineProps<{ userId?: string | null }>()

const emit = defineEmits(['user-saved', 'user-created', 'user-updated'])

const maxPreferences = 5
const isEditing = computed(() => !!props.userId)
const loading = ref(false)
const searchQuery = ref('')

const form = reactive({
  name: '',
  email: '',
  password: '',
  userType: 'user' as 'admin' | 'user' | 'staff-user' | 'moderator' | 'scanner',
})

const oxfordSubtype = ref<UserRole>('current_student')
const staffSubtype = ref<'staff' | 'scanner'>('staff')

const selectedPreferenceIds = ref<string[]>([])
const allPreferences = ref<PreferenceDto[]>([])
const loadingPreferences = ref(false)
const submitting = ref(false)

const canChangeRole = computed(() => {
  return authStore.isAdmin && isEditing.value
})

const canSelectMore = computed(() => selectedPreferenceIds.value.length < maxPreferences)

const filteredPreferences = computed(() => {
  if (!searchQuery.value.trim()) {
    return allPreferences.value
  }
  const query = searchQuery.value.toLowerCase()
  return allPreferences.value.filter((pref) => pref.name.toLowerCase().includes(query))
})

const selectedPreferences = computed(() => {
  return selectedPreferenceIds.value
    .map((id) => allPreferences.value.find((p) => p.preferenceId === id))
    .filter((p): p is PreferenceDto => p !== undefined)
})

const isPreferenceSelected = (preferenceId: string) => {
  return selectedPreferenceIds.value.includes(preferenceId)
}

const removePreference = (preferenceId: string) => {
  const index = selectedPreferenceIds.value.indexOf(preferenceId)
  if (index > -1) {
    selectedPreferenceIds.value.splice(index, 1)
  }
}

const getEmailPlaceholder = () => {
  switch (form.userType) {
    case 'user':
      return 'student@ox.ac.uk'
    case 'staff-user':
      return 'staff@company.com'
    case 'moderator':
      return 'moderator@company.com'
    default:
      return 'email@example.com'
  }
}

const handleUserTypeChange = (newType: 'admin' | 'user' | 'staff-user' | 'moderator' | 'scanner') => {
  if (!canChangeRole.value) {
    form.userType = newType
  }
  // Reset subtipos cuando cambia el user type
  if (newType === 'user') {
    oxfordSubtype.value = 'current_student'
  } else if (newType === 'staff-user') {
    staffSubtype.value = 'staff'
  }
}

// ✅ Limpiar el nombre de tags legacy (si existen)
const cleanName = (name: string): string => {
  return name.replace(/\s*\[(Student|Professor)\]\s*$/, '').trim()
}

const fetchUserData = async (id: string) => {
  loading.value = true
  try {
    const data = (await UserApi.get(id)) as UserDetailDto

    // Limpiar nombre de tags legacy si existen
    form.name = cleanName(data.name)
    form.email = data.email
    form.password = ''
    form.userType = data.userType

    // Cargar userRole del backend para usuarios Oxford
    if (data.userType === 'user') {
      oxfordSubtype.value = data.userRole || 'current_student'
    }

    if (data.preferences && data.preferences.length > 0) {
      const preferenceIds = data.preferences
        .map((prefName) => {
          const foundPref = allPreferences.value.find((p) => p.name === prefName)
          return foundPref ? foundPref.preferenceId : null
        })
        .filter((id): id is string => id !== null)

      selectedPreferenceIds.value = preferenceIds
    } else {
      selectedPreferenceIds.value = []
    }
  } catch (error: any) {
    console.error('Failed to load user data:', error)
    handleApiError(error)
  } finally {
    loading.value = false
  }
}

watch(
  [() => props.userId, allPreferences],
  ([newId, prefs]) => {
    searchQuery.value = ''

    if (newId && prefs.length > 0) {
      fetchUserData(newId)
    } else if (!newId) {
      form.name = ''
      form.email = ''
      form.password = ''
      form.userType = 'user'
      selectedPreferenceIds.value = []
      oxfordSubtype.value = 'current_student'
      staffSubtype.value = 'staff'
    }
  },
  { immediate: true },
)

const validateOxfordEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return false
  }

  // Accept any subdomain of ox.ac.uk (e.g., @ox.ac.uk, @lmh.ox.ac.uk, @colleges.ox.ac.uk)
  const oxfordDomainRegex = /@([\w.-]+\.)?ox\.ac\.uk$/i
  return oxfordDomainRegex.test(email)
}

const saveUser = async () => {
  // ✅ Validar que si es Oxford, tenga subtipo
  if (form.userType === 'user' && !oxfordSubtype.value) {
    console.error('Oxford users must have a userRole selected')
    return
  }

  // ✅ Validar que si es Staff, tenga subtipo
  if (form.userType === 'staff-user' && !staffSubtype.value) {
    console.error('Staff users must have a subtype selected')
    return
  }

  // ✅ Validar email Oxford para user y staff-user
  if ((form.userType === 'user' || form.userType === 'staff-user') && !validateOxfordEmail(form.email)) {
    handleApiError(new Error('Only Oxford University domains (@ox.ac.uk) are allowed'))
    return
  }

  submitting.value = true

  try {
    const preferenceNames = selectedPreferenceIds.value
      .map((prefId) => {
        const foundPref = allPreferences.value.find((p) => p.preferenceId === prefId)
        return foundPref ? foundPref.name : null
      })
      .filter((name): name is string => name !== null)

    // ✅ Solo usar el nombre limpio (sin tags legacy)
    let finalName = form.name.trim()
    finalName = cleanName(finalName)

    // ✅ Determinar el role según el subtipo de Staff
    let finalUserType = form.userType
    if (form.userType === 'staff-user' && staffSubtype.value) {
      finalUserType = staffSubtype.value === 'staff' ? 'staff-user' : 'scanner'
    }

    // ✅ Determinar userRole para usuarios Oxford
    const finalUserRole: UserRole = form.userType === 'user' ? oxfordSubtype.value : null

    const payload: any = {
      ...form,
      name: finalName,
      userType: finalUserType,
      userRole: finalUserRole,
      preferences: preferenceNames,
    }

    if (isEditing.value && !payload.password) {
      delete payload.password
    }

    console.log('📤 Saving user with payload:', JSON.stringify(payload, null, 2))
    console.log('📤 oxfordSubtype value:', oxfordSubtype.value)

    if (isEditing.value) {
      await UserApi.update(props.userId!, payload)
      emit('user-updated')
      emit('user-saved')
    } else {
      await UserApi.create(payload)
      emit('user-created')
      emit('user-saved')
    }
  } catch (error: any) {
    console.error('Save failed:', error)
    handleApiError(error)
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  document.body.style.overflow = 'hidden'

  loadingPreferences.value = true
  try {
    const prefs = await PreferencesApi.getAll()
    allPreferences.value = prefs
  } catch (error: any) {
    console.error('Failed to load preferences:', error)
    handleApiError(error)
  } finally {
    loadingPreferences.value = false
  }
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* ... (todos los estilos anteriores se mantienen igual) ... */
.modern-form {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.form-sections {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.slide-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-wrap: wrap;
}

.required {
  color: #dc2626;
}

.optional-hint {
  font-size: 0.8rem;
  font-weight: 400;
  color: #9ca3af;
  font-style: italic;
}

.info-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.field-hint {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0;
  padding-top: 0.25rem;
}

.field-hint svg {
  flex-shrink: 0;
  color: #9ca3af;
}

.user-type-selector {
  background: #f9fafb;
  padding: 1.25rem;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.user-type-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-top: 0.75rem;
}

.user-type-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem;
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.user-type-card:hover {
  border-color: #dbb067;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(219, 176, 103, 0.15);
}

.user-type-card.active {
  border-color: #dbb067;
  background: #fffbf5;
  box-shadow: 0 4px 12px rgba(219, 176, 103, 0.25);
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.card-icon.student {
  background: #f5f3ff;
  color: #6d28d9;
}

.user-type-card.active .card-icon.student {
  background: #6d28d9;
  color: #ffffff;
}

.card-icon.staff {
  background: #f0f9ff;
  color: #0369a1;
}

.user-type-card.active .card-icon.staff {
  background: #0369a1;
  color: #ffffff;
}

.card-icon.moderator {
  background: #fef3c7;
  color: #92400e;
}

.user-type-card.active .card-icon.moderator {
  background: #92400e;
  color: #ffffff;
}

.card-icon.admin {
  background: #fee2e2;
  color: #991b1b;
}

.user-type-card.active .card-icon.admin {
  background: #991b1b;
  color: #ffffff;
}

.card-content h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
}

.card-content p {
  margin: 0;
  font-size: 0.8rem;
  color: #6b7280;
}

.email-requirement {
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.25rem 0.625rem;
  background: #f3f4f6;
  border-radius: 12px;
  font-size: 0.7rem;
  color: #6b7280;
  font-weight: 500;
}

.user-type-card.active .email-requirement {
  background: #dbb067;
  color: #ffffff;
}

.oxford-subtype-selector {
  background: linear-gradient(135deg, #f5f3ff 0%, #eff6ff 100%);
  padding: 1.25rem;
  border-radius: 12px;
  border: 2px solid #dbb067;
  box-shadow: 0 4px 12px rgba(219, 176, 103, 0.1);
}

.subtype-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.subtype-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.subtype-option:hover {
  border-color: #dbb067;
  transform: translateX(6px);
  box-shadow: 0 4px 12px rgba(219, 176, 103, 0.15);
}

.subtype-option.active {
  border-color: #dbb067;
  background: linear-gradient(135deg, #fffbf5 0%, #ffffff 100%);
  box-shadow: 0 6px 16px rgba(219, 176, 103, 0.25);
  transform: translateX(8px);
}

.subtype-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: #eff6ff;
  color: #1e40af;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.25s ease;
}

.subtype-option.active .subtype-icon {
  background: linear-gradient(135deg, #6d28d9 0%, #4f46e5 100%);
  color: #ffffff;
  transform: rotate(-5deg) scale(1.05);
}

.subtype-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.subtype-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1f2937;
  transition: color 0.2s ease;
}

.subtype-option.active .subtype-title {
  color: #0d2954;
}

.subtype-desc {
  font-size: 0.8125rem;
  color: #6b7280;
}

.check-mark {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  flex-shrink: 0;
  animation: checkBounce 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes checkBounce {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.form-input,
.form-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  background: #ffffff;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.form-input:focus,
.form-select:focus {
  border-color: #dbb067;
  box-shadow: 0 0 0 3px rgba(219, 176, 103, 0.1);
  outline: none;
}

.form-select {
  cursor: pointer;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #dbb067;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid #e5e7eb;
  border-top-color: #dbb067;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.preferences-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.preferences-count {
  display: inline-flex;
  align-items: center;
  background: #f3f4f6;
  color: #6b7280;
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.preferences-count.limit-reached {
  background: #fef3c7;
  color: #92400e;
}

.limit-warning {
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: #fef3c7;
  color: #92400e;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
}

.preferences-loading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 2rem;
  justify-content: center;
  color: #6b7280;
}

.preferences-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  overflow: hidden;
}

.search-box {
  position: relative;
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.search-icon {
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.625rem 2.5rem 0.625rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9375rem;
  background: #ffffff;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.search-input:focus {
  border-color: #dbb067;
  box-shadow: 0 0 0 3px rgba(219, 176, 103, 0.1);
  outline: none;
}

.clear-search {
  position: absolute;
  right: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.clear-search:hover {
  background: #f3f4f6;
  color: #6b7280;
}

.preferences-list {
  max-height: 300px;
  overflow-y: auto;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  background: #ffffff;
  min-width: 0;
}

.preferences-list::-webkit-scrollbar {
  width: 8px;
}

.preferences-list::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 4px;
}

.preferences-list::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.preferences-list::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.preference-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  cursor: pointer;
  min-width: 0;
}

.preference-item:hover:not(.disabled) {
  background: #f3f4f6;
}

.preference-item.disabled .preference-checkbox {
  cursor: not-allowed;
}

.preference-label {
  color: #4a5568;
  font-size: 0.9375rem;
  cursor: pointer;
  user-select: none;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.preference-item.disabled .preference-label {
  cursor: not-allowed;
}

.no-results {
  text-align: center;
  padding: 2rem;
  color: #9ca3af;
}

.no-results svg {
  margin: 0 auto 0.5rem;
}

.no-results p {
  margin: 0;
  font-size: 0.875rem;
}

.selected-preferences {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.75rem;
  border-top: 1px solid #e2e8f0;
  background: #f9fafb;
  overflow: hidden;
}

.selected-header {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
}

.chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  overflow: hidden;
}

.preference-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #dbb067;
  color: #ffffff;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  animation: chipIn 0.2s ease;
  max-width: 100%;
  box-sizing: border-box;
}

@keyframes chipIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.preference-chip span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}

.chip-remove {
  background: transparent;
  border: none;
  color: #ffffff;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.chip-remove:hover {
  background: rgba(255, 255, 255, 0.2);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  margin-top: 1rem;
}

.btn-primary {
  background: #dbb067;
  color: #ffffff;
  border: none;
  padding: 0.875rem 1.75rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary:hover:not(:disabled) {
  background: #c9a05a;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(219, 176, 103, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>