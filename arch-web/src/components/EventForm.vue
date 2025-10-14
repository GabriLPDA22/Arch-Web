<template>
  <form class="modern-form">
    <div v-if="statusMessage" class="status-message" :class="{ error: isError, success: !isError }">
      {{ statusMessage }}
      <button type="button" @click="statusMessage = null" class="close-status">×</button>
    </div>

    <div class="form-sections">
      <div class="form-section">
        <h3 class="section-title">Basic Information</h3>

        <div class="form-row">
          <div class="form-group full-width">
            <label class="form-label"> Event Name <span class="required">*</span> </label>
            <div class="input-wrapper">
              <input
                v-model.trim="form.name"
                class="form-input"
                type="text"
                placeholder="Enter an amazing event name..."
                required
              />
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label"> Category </label>
            <div class="select-wrapper">
              <select
                v-model="form.preferenceId"
                class="form-select"
                :disabled="loadingPreferences"
              >
                <option :value="null">
                  {{ loadingPreferences ? 'Loading categories...' : 'Choose a category' }}
                </option>
                <option
                  v-for="preference in preferences"
                  :key="preference.preferenceId"
                  :value="preference.preferenceId"
                >
                  {{ preference.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label"> External URL </label>
            <div class="input-wrapper">
              <input
                v-model.trim="form.externalUrl"
                class="form-input"
                type="url"
                placeholder="https://event-website.com"
              />
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group full-width">
            <label class="form-label"> Description </label>
            <div class="textarea-wrapper">
              <textarea
                v-model.trim="form.description"
                class="form-textarea"
                rows="4"
                placeholder="Tell people what makes this event special..."
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3 class="section-title">Event Image</h3>
        <div class="form-group">
          <label class="form-label"> Upload an image </label>
          <div class="image-upload-wrapper">
            <input
              type="file"
              accept="image/png, image/jpeg, image/gif"
              class="file-input"
              @change="handleImageSelection"
            />
            <div v-if="imagePreviewUrl" class="image-preview">
              <img :src="imagePreviewUrl" alt="Image preview" />
            </div>
            <div v-else class="image-placeholder">Click to upload</div>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3 class="section-title">Date & Time</h3>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label"> Start Date & Time <span class="required">*</span> </label>
            <DateTimePicker
              v-model="form.startLocal"
              placeholder="Select start date & time"
              :required="true"
            />
          </div>

          <div class="form-group">
            <label class="form-label"> End Date & Time </label>
            <DateTimePicker
              v-model="form.endLocal"
              placeholder="Select end date & time"
              :min-date="form.startLocal ? new Date(form.startLocal) : undefined"
            />
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3 class="section-title">Location</h3>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label"> Address <span class="required">*</span> </label>
            <div class="input-wrapper">
              <input
                v-model.trim="form.address"
                class="form-input"
                type="text"
                placeholder="123 Event Street, City"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label"> Postcode <span class="required">*</span> </label>
            <div class="input-wrapper">
              <input
                v-model.trim="form.postcode"
                class="form-input"
                type="text"
                placeholder="SW1A 1AA"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3 class="section-title">Event Details</h3>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label"> Ticket Price (£) </label>
            <div class="input-wrapper price-input">
              <span class="currency-symbol">£</span>
              <input
                v-model.number="form.price"
                class="form-input"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label"> Capacity </label>
            <div class="input-wrapper">
              <input
                v-model.number="form.capacity"
                class="form-input"
                type="number"
                min="0"
                placeholder="100"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch, computed, onMounted, ref } from 'vue'
import type { EventDetailDto } from '@/services/Api'
import { PreferencesApi, type PreferenceDto } from '@/services/Api'
import DateTimePicker from './CustomCalendar.vue'

const props = defineProps<{
  initialData?: EventDetailDto | null
}>()

const imageFile = ref<File | null>(null)
const imagePreviewUrl = ref<string | null>(null)
const preferences = ref<PreferenceDto[]>([])
const loadingPreferences = ref(true)

// Add status message logic
const statusMessage = ref<string | null>(null)
const isError = ref(false)

// Function to show custom status messages
const showStatus = (message: string, isErrorType = false) => {
  statusMessage.value = message
  isError.value = isErrorType
  if (!isErrorType) {
    setTimeout(() => {
      statusMessage.value = null
    }, 5000)
  }
}

const fromIsoToLocal = (iso?: string): string => {
  if (!iso) return ''
  const dt = new Date(iso)
  const offset = dt.getTimezoneOffset() * 60000
  const local = new Date(dt.getTime() - offset)
  return local.toISOString().slice(0, 16)
}

const form = reactive({
  name: '',
  startLocal: '',
  endLocal: '',
  capacity: null as number | null,
  price: null as number | null,
  postcode: '',
  preferenceId: '' as string | null,
  address: '',
  externalUrl: '',
  description: '',
})

const loadPreferences = async () => {
  try {
    loadingPreferences.value = true
    preferences.value = await PreferencesApi.getAll()
  } catch (error: any) {
    console.error('Failed to load categories:', error)
    // Use custom status message
    showStatus(error.message || 'Error loading categories. Please refresh.', true)
  } finally {
    loadingPreferences.value = false
  }
}

const handleImageSelection = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    imageFile.value = file
    imagePreviewUrl.value = URL.createObjectURL(file)
  } else {
    imageFile.value = null
    imagePreviewUrl.value = null
  }
}

const validationErrors = computed(() => {
  const errors: string[] = []
  if (!form.name.trim()) errors.push('Event name is required')
  if (!form.startLocal) errors.push('Start date and time is required')
  if (!form.address.trim()) errors.push('Address is required')
  if (!form.postcode.trim()) errors.push('Postcode is required')
  if (form.endLocal && form.startLocal && new Date(form.endLocal) <= new Date(form.startLocal)) {
    errors.push('End time must be after start time')
  }
  if (form.price !== null && form.price < 0) errors.push('Price cannot be negative')
  if (form.capacity !== null && form.capacity < 0) errors.push('Capacity cannot be negative')
  return errors
})

// This 'watch' observes both the event data and the list of preferences.
watch(
  [() => props.initialData, preferences],
  ([newData, prefs]) => {
    // If we have the event data AND the preferences list is ready...
    if (newData && prefs.length > 0) {
      form.name = newData.name ?? ''
      form.startLocal = fromIsoToLocal(newData.startDate)
      form.endLocal = fromIsoToLocal(newData.endDate)
      form.capacity = newData.capacity ?? null
      form.price = newData.price ?? null
      form.postcode = newData.postcode ?? ''
      form.preferenceId = newData.preferenceId ?? null
      form.address = newData.address ?? ''
      form.externalUrl = newData.externalUrl ?? ''
      form.description = newData.description ?? ''

      imageFile.value = null
      imagePreviewUrl.value = newData.imageUrl || null
    } else if (!newData) {
      // If no data (e.g., creating a new event), reset the form
      Object.assign(form, {
        name: '',
        startLocal: '',
        endLocal: '',
        capacity: null,
        price: null,
        postcode: '',
        preferenceId: null,
        address: '',
        externalUrl: '',
        description: '',
      })
      imageFile.value = null
      imagePreviewUrl.value = null
    }
  },
  { deep: true, immediate: true },
)

onMounted(() => {
  loadPreferences()
})

// Expose the necessary variables for the parent component to call save logic and validation
defineExpose({ form, validationErrors, imageFile, showStatus })
</script>

<style scoped>
/*
  Note: Styles for .status-message, .status-message.error, .status-message.success, 
  and .close-status are the same as in UserForm.vue for consistency.
*/
.modern-form {
  color: #1a202c;
  box-sizing: border-box;
}

.modern-form * {
  box-sizing: border-box;
}

/* --- CUSTOM STATUS MESSAGE STYLES --- */
.status-message {
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  z-index: 10;
}

.status-message.error {
  background-color: #fee2e2;
  color: #c53030;
  border: 1px solid #fecaca;
}

.status-message.success {
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
/* --- END CUSTOM STATUS MESSAGE STYLES --- */

.image-upload-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  border: 2px dashed #e2e8f0;
  border-radius: 0.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
}

.image-upload-wrapper:hover {
  border-color: #dbb067;
  background-color: #f8f9fa;
}

.file-input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  color: #a0aec0;
  font-weight: 500;
}

.form-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  background: #f8f9fa;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #1a202c;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-row:last-child {
  margin-bottom: 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  box-sizing: border-box;
  min-width: 0;
}

.form-group.full-width {
  grid-column: span 2;
}

.form-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.25rem;
}

.required {
  color: #ef4444;
  font-weight: 700;
}

.input-wrapper,
.select-wrapper,
.textarea-wrapper {
  position: relative;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
}

.input-wrapper:focus-within,
.select-wrapper:focus-within,
.textarea-wrapper:focus-within {
  border-color: #dbb067;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(219, 176, 103, 0.2);
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  padding: 1rem 1.25rem;
  color: #1a202c;
  font-size: 1rem;
  font-weight: 500;
  box-sizing: border-box;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #a0aec0;
}

.form-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23dbb067' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 1rem center;
  background-repeat: no-repeat;
  background-size: 1.25rem;
  padding-right: 3rem;
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  word-wrap: break-word;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  line-height: 1.6;
}

.price-input {
  display: flex;
  align-items: center;
}

.currency-symbol {
  padding-left: 1.25rem;
  color: #dbb067;
  font-weight: 600;
  font-size: 1.1rem;
}

.price-input .form-input {
  padding-left: 0.5rem;
}

.validation-summary {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-top: 1.5rem;
}

.validation-title {
  color: #c53030;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.validation-list {
  margin: 0;
  padding-left: 1.5rem;
  list-style: none;
}

.validation-error {
  color: #c53030;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  position: relative;
}

.validation-error::before {
  content: '•';
  color: #ef4444;
  font-weight: bold;
  position: absolute;
  left: -1rem;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .form-group.full-width {
    grid-column: span 1;
  }

  .form-section {
    padding: 1rem;
  }

  .section-title {
    font-size: 1.1rem;
  }
}

.form-textarea::-webkit-scrollbar {
  width: 8px;
}

.form-textarea::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.form-textarea::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.form-textarea::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}
</style>
