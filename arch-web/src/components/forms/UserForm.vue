<template>
  <form @submit.prevent="saveUser" class="modern-form">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading user data...</p>
    </div>
    <div v-else class="form-sections">
      <div class="form-group">
        <label class="form-label">Name <span class="required">*</span></label>
        <input v-model="form.name" class="form-input" type="text" required placeholder="John Doe" />
      </div>

      <div class="form-group">
        <label class="form-label">Email <span class="required">*</span></label>
        <input
          v-model="form.email"
          class="form-input"
          type="email"
          required
          placeholder="john.doe@example.com"
        />
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
        <select v-model="form.userType" class="form-select">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
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
      <button type="submit" class="btn-primary" :disabled="submitting || loading">
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
import { ref, reactive, watch, onMounted, computed } from 'vue'
import { UserApi, PreferencesApi, type PreferenceDto, type UserDetailDto } from '@/services/Api'

const props = defineProps<{ userId?: string | null }>()

// ✅ Eventos actualizados para trabajar con toasts
const emit = defineEmits(['user-saved', 'user-created', 'user-updated', 'error'])

const maxPreferences = 5
const isEditing = computed(() => !!props.userId)
const loading = ref(false)
const searchQuery = ref('')

const form = reactive({
  name: '',
  email: '',
  password: '',
  userType: 'user' as 'admin' | 'user',
})

const selectedPreferenceIds = ref<string[]>([])
const allPreferences = ref<PreferenceDto[]>([])
const loadingPreferences = ref(false)
const submitting = ref(false)

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
    .filter((p) => p !== undefined) as PreferenceDto[]
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

const fetchUserData = async (id: string) => {
  loading.value = true
  try {
    const data = (await UserApi.get(id)) as UserDetailDto

    form.name = data.name
    form.email = data.email
    form.password = ''
    form.userType = data.userType

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
    const errorMessage = error?.response?.data?.message || 'Failed to load user data'
    emit('error', errorMessage)
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
    }
  },
  { immediate: true },
)

// ✅ Función saveUser actualizada para emitir eventos correctos
const saveUser = async () => {
  if (selectedPreferenceIds.value.length > maxPreferences) {
    emit('error', `You can select a maximum of ${maxPreferences} preferences.`)
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

    const payload: any = {
      ...form,
      preferences: preferenceNames,
    }

    if (isEditing.value && !payload.password) {
      delete payload.password
    }

    if (isEditing.value) {
      await UserApi.update(props.userId!, payload)
      // ✅ Emitir evento específico para actualización
      emit('user-updated')
      emit('user-saved') // Mantener compatibilidad
    } else {
      await UserApi.create(payload)
      // ✅ Emitir evento específico para creación
      emit('user-created')
      emit('user-saved') // Mantener compatibilidad
    }
  } catch (error: any) {
    console.error('Save failed:', error)
    const errorMessage =
      error?.response?.data?.message || error?.message || 'Unknown error while saving user'
    // ✅ Emitir evento de error
    emit('error', errorMessage)
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  loadingPreferences.value = true
  try {
    const prefs = await PreferencesApi.getAll()
    allPreferences.value = prefs
  } catch (error) {
    console.error('Failed to load preferences:', error)
    emit('error', 'Failed to load preferences')
  } finally {
    loadingPreferences.value = false
  }
})
</script>

<style scoped>
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
.preferences-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.preferences-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  color: #6b7280;
  padding: 0.25rem 0.625rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  transition: all 0.2s ease;
}
.preferences-count.limit-reached {
  background: #fef2f2;
  color: #dc2626;
}
.limit-warning {
  font-size: 0.875rem;
  color: #dc2626;
  font-weight: 500;
  animation: fadeIn 0.3s ease;
}
.preferences-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem;
  color: #6b7280;
}
.preferences-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1rem;
  background: #f9fafb;
  overflow: hidden;
}
.search-box {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}
.search-icon {
  position: absolute;
  left: 1rem;
  color: #9ca3af;
  pointer-events: none;
}
.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
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
  right: 0.75rem;
  background: transparent;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  transition: color 0.2s ease;
}
.clear-search:hover {
  color: #4b5563;
}
.preferences-list {
  max-height: 240px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
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
.preference-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.preference-checkbox {
  cursor: pointer;
  width: 18px;
  height: 18px;
  accent-color: #dbb067;
  flex-shrink: 0;
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
  padding-top: 0.75rem;
  border-top: 1px solid #e2e8f0;
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
.preference-chip span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.chip-remove {
  background: transparent;
  border: none;
  color: #ffffff;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  transition: opacity 0.2s ease;
  flex-shrink: 0;
}
.chip-remove:hover {
  opacity: 0.8;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}
.btn-primary {
  background: #dbb067;
  color: #ffffff;
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: 12px;
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
}
.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}
.btn-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.loading-state {
  text-align: center;
  padding: 3rem;
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
.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  flex-shrink: 0;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
@media (max-width: 640px) {
  .preferences-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .chips-container {
    max-width: 100%;
  }
}
</style>
