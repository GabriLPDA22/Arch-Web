<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">My Events</h1>
          <p class="page-subtitle">Manage your organization's events</p>
        </div>
        <div class="header-buttons">
          <label class="import-btn" :class="{ disabled: !isVerified }">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M12,19L8,15H10.5V12H13.5V15H16L12,19Z"
              />
            </svg>
            Import Excel
            <input
              type="file"
              ref="excelFileInput"
              accept=".xlsx,.xls"
              @change="handleExcelImport"
              :disabled="!isVerified"
              style="display: none"
            />
          </label>
          <button class="create-btn" @click="openCreateModal" :disabled="!isVerified">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
            </svg>
            Create Event
          </button>
        </div>
      </div>
    </div>

    <!-- Warning si no está verificado -->
    <div v-if="!isVerified" class="info-banner warning">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16"
        />
      </svg>
      <span>
        Your account is pending verification. You cannot create events until an admin approves your organization.
      </span>
    </div>

    <div v-if="isVerified" class="info-banner">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"
        />
      </svg>
      <span
        >Events marked with <strong class="orders-indicator">📋 HAS ORDERS</strong> have associated
        ticket purchases and require order cancellation before deletion.</span
      >
    </div>

    <AlertMessage
      v-model="showAlert"
      :type="alertType"
      :message="alertMessage"
      :dismissible="true"
    />

    <!-- View Toggle -->
    <div v-if="!loading && events.length > 0" class="view-controls">
      <div class="view-toggle">
        <button
          class="toggle-btn"
          :class="{ active: viewMode === 'table' }"
          @click="viewMode = 'table'"
          title="Table View"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3,3H21V5H3V3M3,7H21V9H3V7M3,11H21V13H3V11M3,15H21V17H3V15M3,19H21V21H3V19Z" />
          </svg>
          <span>Table</span>
        </button>
        <button
          class="toggle-btn"
          :class="{ active: viewMode === 'grid' }"
          @click="viewMode = 'grid'"
          title="Grid View"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3,11H11V3H3M3,21H11V13H3M13,11H21V3H13M13,21H21V13H13Z" />
          </svg>
          <span>Grid</span>
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading events...</p>
    </div>

    <div v-else-if="!loading && events.length === 0" class="empty-state">
      <svg
        width="80"
        height="80"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <path
          d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1"
        />
      </svg>
      <h3>No events found</h3>
      <p>Start by creating your first event</p>
      <button class="create-btn-empty" @click="openCreateModal" :disabled="!isVerified">
        Create Event
      </button>
    </div>

    <div v-else class="events-container" :class="viewMode">
      <div
        v-for="(event, index) in events"
        :key="event.eventID"
        class="event-card"
      >
        <div class="event-image">
          <span v-if="isEventFinished(event)" class="finished-badge">Finished</span>
          <img
            :src="event.imageUrl || defaultEventImage"
            :alt="event.name"
            :fetchpriority="index === 0 ? 'high' : 'auto'"
          />
          <div class="event-actions">
            <button class="action-btn edit" @click.stop="openEditModal(event)" title="Edit">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"
                />
              </svg>
            </button>
            <button class="action-btn delete" @click.stop="openDeleteModal(event)" title="Delete">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
                />
              </svg>
            </button>
          </div>
          <div class="event-price">
            {{ event.price === 0 || !event.price ? 'FREE' : `£${event.price.toFixed(2)}` }}
          </div>
        </div>
        <div class="event-content">
          <div class="event-meta">
            <span class="event-category">{{ event.preferenceName || 'General' }}</span>
            <span class="event-date">{{ formatDate(event.startDate) }}</span>
          </div>
          <div class="event-title-wrapper">
            <h3 class="event-title">{{ event.name }}</h3>
            <span v-if="event.hasOrders" class="orders-badge" title="This event has ticket orders">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M20,8H4V6H20M20,18H4V12H20M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"
                />
              </svg>
              HAS ORDERS
            </span>
          </div>
          <div class="event-location">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"
              />
            </svg>
            <span>{{ event.address }}</span>
          </div>
        </div>
      </div>
    </div>

    <ModalComponent
      :show="isFormModalOpen"
      :title="isEditing ? 'Edit Event' : 'Create New Event'"
      @close="closeModals"
    >
      <EventForm ref="eventFormComponent" :initial-data="selectedEvent" />
      <template #footer>
        <button class="btn-secondary" @click="closeModals">Cancel</button>
        <button class="btn-primary" :disabled="submitting" @click="handleSaveEvent">
          {{ submitting ? 'Saving...' : 'Save Event' }}
        </button>
      </template>
    </ModalComponent>

    <ModalComponent :show="isDeleteModalOpen" title="Delete Event" @close="closeModals">
      <div class="delete-warning">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16" />
        </svg>
        <p>
          Are you sure you want to delete <strong>{{ selectedEvent?.name }}</strong
          >?
        </p>
        <p class="warning-text">This action cannot be undone.</p>
      </div>
      <template #footer>
        <button class="btn-secondary" @click="closeModals">Cancel</button>
        <button class="btn-danger" :disabled="submitting" @click="handleDeleteConfirm">
          {{ submitting ? 'Deleting...' : 'Delete Event' }}
        </button>
      </template>
    </ModalComponent>

    <ModalComponent
      :show="isDeleteWithOrdersModalOpen"
      title="⚠️ Delete Event with Orders"
      @close="closeDeleteWithOrdersModal"
      class="delete-orders-modal"
    >
      <div class="delete-orders-warning">
        <div class="warning-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16" />
          </svg>
        </div>

        <div class="warning-content">
          <h3 class="warning-title">Dangerous Action</h3>
          <p class="warning-description">
            You are about to delete <strong>{{ selectedEvent?.name }}</strong> which has
            <strong class="text-danger">{{ selectedEventOrderCount }} ticket order(s)</strong>
            associated.
          </p>

          <div class="warning-details">
            <p><strong>This action will:</strong></p>
            <ul>
              <li>Permanently delete the event</li>
              <li>Delete all associated ticket orders ({{ selectedEventOrderCount }} orders)</li>
              <li>This action <strong>CANNOT be undone</strong></li>
            </ul>
          </div>

          <div class="confirmation-input-wrapper">
            <label for="delete-confirmation">
              To confirm deletion, type <code class="confirmation-code">delete</code> below:
            </label>
            <input
              id="delete-confirmation"
              v-model="deleteConfirmationText"
              type="text"
              class="confirmation-input"
              placeholder="Type 'delete' to confirm"
              @keyup.enter="confirmDeleteWithOrders"
            />
          </div>

          <p class="warning-footer">
            <strong>⚠️ Warning:</strong> All users with tickets for this event will lose their
            bookings.
          </p>
        </div>
      </div>

      <template #footer>
        <button class="btn-secondary" @click="closeDeleteWithOrdersModal">Cancel</button>
        <button
          class="btn-danger"
          @click="confirmDeleteWithOrders"
          :disabled="deleteConfirmationText.toLowerCase() !== 'delete' || submitting"
        >
          {{ submitting ? 'Deleting...' : 'Delete Event & Orders' }}
        </button>
      </template>
    </ModalComponent>

    <ModalComponent :show="showImportResultModal" title="Import Results" @close="closeImportResultModal">
      <div class="import-results">
        <div class="results-summary">
          <div class="result-item success">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
            </svg>
            <span>Successfully imported: <strong>{{ importResult.successCount }}</strong> events</span>
          </div>
          <div v-if="importResult.errorCount > 0" class="result-item error">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
            </svg>
            <span>Failed to import: <strong>{{ importResult.errorCount }}</strong> events</span>
          </div>
        </div>
        <div v-if="importResult.errors.length > 0" class="errors-list">
          <h4>Errors:</h4>
          <ul>
            <li v-for="(error, index) in importResult.errors" :key="index">{{ error }}</li>
          </ul>
        </div>
      </div>
      <template #footer>
        <button class="btn-primary" @click="closeImportResultModal">Close</button>
      </template>
    </ModalComponent>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import * as XLSX from 'xlsx'
import { useAuthStore } from '@/stores/auth.store'
import { EventApi, type EventListDto, type EventCreateDto, type EventDetailDto } from '@/services/Api'
import EventForm from '@/components/forms/EventForm.vue'
import ModalComponent from '@/components/ui/ModalComponent.vue'
import AlertMessage from '@/components/common/AlertMessage.vue'
import defaultEventImage from '@/assets/images/default_event_image.jpg'
import { successMessages, handleApiError } from '@/utils/validators'

const authStore = useAuthStore()
const isVerified = computed(() => authStore.user?.isVerified ?? false)

const loading = ref(false)
const events = ref<EventListDto[]>([])
const viewMode = ref<'table' | 'grid'>('grid')
const isFormModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isDeleteWithOrdersModalOpen = ref(false)
const isEditing = ref(false)
const selectedEvent = ref<EventDetailDto | null>(null)
const submitting = ref(false)
const eventFormComponent = ref<InstanceType<typeof EventForm> | null>(null)
const excelFileInput = ref<HTMLInputElement | null>(null)
const showImportResultModal = ref(false)
const deleteConfirmationText = ref('')
const selectedEventOrderCount = ref(0)
const importResult = ref({
  successCount: 0,
  errorCount: 0,
  errors: [] as string[],
})
const showAlert = ref(false)
const alertType = ref<'error' | 'success' | 'warning' | 'info'>('info')
const alertMessage = ref('')

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const isEventFinished = (event: EventListDto) => {
  if (!event.endDate) return false
  return new Date(event.endDate) < new Date()
}

const loadEvents = async () => {
  if (!isVerified.value) return

  loading.value = true
  try {
    const response = await EventApi.getMyEvents()
    
    // Manejar diferentes formatos de respuesta
    if (Array.isArray(response)) {
      events.value = response
    } else if (response && typeof response === 'object' && 'items' in response) {
      events.value = (response as { items: EventListDto[] }).items
    } else if (response && typeof response === 'object' && 'data' in response) {
      events.value = (response as { data: EventListDto[] }).data
    } else {
      console.warn('Unexpected response format from my-events endpoint:', response)
      events.value = []
    }
  } catch (error: unknown) {
    console.error('Failed to load events:', error)
    events.value = []
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  if (!isVerified.value) {
    return
  }
  isEditing.value = false
  selectedEvent.value = null
  isFormModalOpen.value = true
}

const openEditModal = async (event: EventListDto) => {
  isEditing.value = true
  try {
    const fullEventDetails = await EventApi.get(event.eventID)
    selectedEvent.value = fullEventDetails
    isFormModalOpen.value = true
  } catch (error: unknown) {
    console.error('Failed to fetch event details for editing:', error)
    handleApiError(error)
    closeModals()
  }
}

const openDeleteModal = async (event: EventListDto) => {
  try {
    const fullEventDetails = await EventApi.get(event.eventID)
    selectedEvent.value = fullEventDetails

    if (event.hasOrders) {
      selectedEventOrderCount.value = 1
      deleteConfirmationText.value = ''
      isDeleteWithOrdersModalOpen.value = true
      return
    }

    isDeleteModalOpen.value = true
  } catch (error: unknown) {
    console.error('Failed to fetch event details:', error)
    handleApiError(error)
  }
}

const showAlertMessage = (type: 'error' | 'success' | 'warning' | 'info', message: string) => {
  alertType.value = type
  alertMessage.value = message
  showAlert.value = true

  setTimeout(() => {
    showAlert.value = false
  }, 5000)
}

const closeModals = () => {
  isFormModalOpen.value = false
  isDeleteModalOpen.value = false
  isDeleteWithOrdersModalOpen.value = false
  deleteConfirmationText.value = ''
  selectedEvent.value = null
  isEditing.value = false
}

const closeDeleteWithOrdersModal = () => {
  isDeleteWithOrdersModalOpen.value = false
  deleteConfirmationText.value = ''
  selectedEventOrderCount.value = 0
}

const handleSaveEvent = async () => {
  if (!eventFormComponent.value) return

  submitting.value = true
  try {
    const form = eventFormComponent.value.form

    // Validar que las fechas sean válidas
    if (!form.startLocal) {
      showAlertMessage('error', 'Start date is required')
      submitting.value = false
      return
    }

    const startDate = new Date(form.startLocal)
    if (isNaN(startDate.getTime())) {
      showAlertMessage('error', 'Invalid start date')
      submitting.value = false
      return
    }

    // ✅ EndDate ahora es obligatorio
    if (!form.endLocal) {
      showAlertMessage('error', 'End date is required')
      submitting.value = false
      return
    }
    const endDate = new Date(form.endLocal)
    if (isNaN(endDate.getTime())) {
      showAlertMessage('error', 'Invalid end date')
      submitting.value = false
      return
    }
    if (endDate <= startDate) {
      showAlertMessage('error', 'End date must be after start date')
      submitting.value = false
      return
    }

    const eventData = {
      name: form.name.trim(),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      address: form.address.trim(),
      postcode: form.postcode.trim(),
      description: form.description?.trim() || undefined,
      capacity: form.capacity || undefined,
      price: form.price || 0,
      preferenceId: form.preferenceId || undefined,
      externalUrl: form.externalUrl?.trim() || undefined,
    }

    if (isEditing.value && selectedEvent.value) {
      await EventApi.update(selectedEvent.value.eventID, eventData)
      successMessages.updated('event')
    } else {
      await EventApi.create(eventData)
      successMessages.created('event')
    }

    closeModals()
    await loadEvents()
  } catch (error: unknown) {
    console.error('Failed to save event:', error)
    handleApiError(error)
  } finally {
    submitting.value = false
  }
}

const handleDeleteConfirm = async () => {
  if (!selectedEvent.value) return

  submitting.value = true
  try {
    await EventApi.remove(selectedEvent.value.eventID)
    closeModals()
    await loadEvents()
    successMessages.deleted('event')
  } catch (error: unknown) {
    console.error('Failed to delete event:', error)
    handleApiError(error)
  } finally {
    submitting.value = false
  }
}

const confirmDeleteWithOrders = async () => {
  if (deleteConfirmationText.value.toLowerCase() !== 'delete') {
    showAlertMessage('error', 'Please type "delete" to confirm deletion')
    return
  }

  if (!selectedEvent.value?.eventID) return

  submitting.value = true
  try {
    await EventApi.remove(selectedEvent.value.eventID)

    closeDeleteWithOrdersModal()
    await loadEvents()

    showAlertMessage(
      'success',
      `Event "${selectedEvent.value.name}" and all associated orders have been deleted successfully.`,
    )

    successMessages.deleted('event')
  } catch (error: unknown) {
    console.error('Failed to delete event with orders:', error)
    handleApiError(error)
    showAlertMessage('error', 'Failed to delete event. Please try again.')
  } finally {
    submitting.value = false
  }
}

const parseExcelDate = (value: unknown): string => {
  if (!value) throw new Error('Empty date')

  if (value instanceof Date) {
    return value.toISOString()
  }

  if (typeof value === 'string') {
    const date = new Date(value)
    if (!isNaN(date.getTime())) {
      return date.toISOString()
    }
  }

  if (typeof value === 'number') {
    const excelEpoch = new Date(1899, 11, 30)
    const date = new Date(excelEpoch.getTime() + value * 86400000)
    return date.toISOString()
  }

  throw new Error('Invalid date format')
}

const handleExcelImport = async (event: Event) => {
  if (!isVerified.value) {
    return
  }

  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  loading.value = true

  try {
    const data = await file.arrayBuffer()
    const workbook = XLSX.read(data, { cellDates: true, cellNF: true })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      raw: false,
      defval: null,
    }) as unknown[]

    if (jsonData.length === 0) {
      alert('The Excel file is empty')
      return
    }

    const requiredColumns = ['name', 'startDate', 'address', 'postcode']
    const firstRow = jsonData[0] as Record<string, unknown>
    const missingColumns = requiredColumns.filter((col) => !(col in firstRow))

    if (missingColumns.length > 0) {
      alert(`Missing required columns: ${missingColumns.join(', ')}`)
      return
    }

    let successCount = 0
    let errorCount = 0
    const errors: string[] = []

    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i] as Record<string, unknown>

      try {
        // Validate endDate is present (now required)
        if (!row.endDate) {
          throw new Error('End date is required')
        }

        const payload: EventCreateDto = {
          name: (row.name?.toString().trim() || '') as string,
          startDate: parseExcelDate(row.startDate),
          endDate: parseExcelDate(row.endDate),
          address: (row.address?.toString().trim() || '') as string,
          postcode: (row.postcode?.toString().trim() || '') as string,
          description: row.description?.toString().trim() || undefined,
          capacity: row.capacity ? parseInt(row.capacity.toString()) : undefined,
          price: row.price ? parseFloat(row.price.toString()) : undefined,
          externalUrl: row.externalUrl?.toString().trim() || undefined,
          preferenceId: row.preferenceId?.toString().trim() || undefined,
          imageUrl: row.imageUrl?.toString().trim() || undefined,
        }

        if (!payload.name || !payload.startDate || !payload.endDate || !payload.address || !payload.postcode) {
          throw new Error('Required fields are missing')
        }

        await EventApi.create(payload)
        successCount++
      } catch (error: unknown) {
        errorCount++
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        errors.push(`Row ${i + 2}: ${errorMessage}`)
        console.error(`Error in row ${i + 2}:`, error)
      }
    }

    importResult.value = {
      successCount,
      errorCount,
      errors,
    }
    showImportResultModal.value = true

    await loadEvents()
  } catch (error: unknown) {
    console.error('Error processing Excel:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    alert(`Error processing file: ${errorMessage}`)
  } finally {
    loading.value = false
    if (input) {
      input.value = ''
    }
  }
}

const closeImportResultModal = () => {
  showImportResultModal.value = false
}

onMounted(() => {
  if (isVerified.value) {
    loadEvents()
  }
})
</script>

<style scoped>
.dashboard {
  padding: 0;
  min-height: 100vh;
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
  box-shadow: 0 4px 12px rgba(219, 176, 103, 0.3);
  flex-shrink: 0;
}

.create-btn:hover:not(:disabled) {
  background: #c9a05a;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(219, 176, 103, 0.4);
}

.create-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.info-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2.5rem;
  background: #fef3c7;
  border-bottom: 1px solid #fde68a;
  color: #92400e;
  font-size: 0.875rem;
  max-width: 1600px;
  margin: 10px auto 0 auto;
}

.info-banner.warning {
  background: #fef3c7;
  border-bottom: 1px solid #fde68a;
  color: #92400e;
}

.info-banner svg {
  flex-shrink: 0;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: #6b7280;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #dbb067;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.empty-state svg {
  margin-bottom: 1.5rem;
  color: #d1d5db;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #4b5563;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  color: #9ca3af;
  margin: 0 0 2rem 0;
}

.create-btn-empty {
  background: #0d2954;
  color: #ffffff;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.create-btn-empty:hover:not(:disabled) {
  background: #1a3d6e;
}

.create-btn-empty:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.events-container {
  display: grid;
  gap: 1.5rem;
  padding: 0 2.5rem 2rem 2.5rem;
  max-width: 1600px;
  margin: 0 auto;
}

.events-container.grid {
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
}

.events-container.table {
  grid-template-columns: 1fr;
}

.event-card {
  position: relative;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.event-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-4px);
}

.events-container.table .event-card {
  display: flex;
  height: 180px;
}

.finished-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(239, 68, 68, 0.9);
  backdrop-filter: blur(8px);
  color: #ffffff;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 5;
}

.event-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.events-container.table .event-image {
  width: 280px;
  height: 100%;
  flex-shrink: 0;
}

.event-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.event-card:hover .event-image img {
  transform: scale(1.05);
}

.event-actions {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.event-card:hover .event-actions {
  opacity: 1;
}

.action-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);
}

.action-btn.edit {
  background: rgba(59, 130, 246, 0.9);
  color: #ffffff;
}

.action-btn.edit:hover {
  background: rgba(37, 99, 235, 1);
}

.action-btn.delete {
  background: rgba(239, 68, 68, 0.9);
  color: #ffffff;
}

.action-btn.delete:hover {
  background: rgba(220, 38, 38, 1);
}

.event-price {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
}

.event-content {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.event-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.event-category {
  background: #f3f4f6;
  color: #6b7280;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.event-date {
  color: #9ca3af;
  font-size: 0.875rem;
  font-weight: 500;
}

.event-title-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  margin-bottom: 0.75rem;
}

.event-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
  line-height: 1.4;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-word;
  hyphens: auto;
}

.event-location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.event-location svg {
  flex-shrink: 0;
  color: #9ca3af;
}

.delete-warning {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem;
  gap: 1rem;
}

.delete-warning svg {
  color: #ef4444;
  margin-bottom: 0.5rem;
}

.delete-warning p {
  margin: 0;
  color: #374151;
  font-size: 1rem;
}

.delete-warning strong {
  color: #1a202c;
  font-weight: 700;
}

.warning-text {
  color: #6b7280;
  font-size: 0.875rem;
}

.btn-secondary {
  background: #f3f4f6;
  color: #4b5563;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-primary {
  background: #0d2954;
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover:not(:disabled) {
  background: #1a3d6e;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-danger {
  background: #ef4444;
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
}

.btn-danger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.header-buttons {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.import-btn {
  background: #ffffff;
  color: #1a202c;
  border: 1px solid #e2e8f0;
  padding: 1rem 1.75rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
}

.import-btn:hover:not(.disabled) {
  background: #f9fafb;
  border-color: #dbb067;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.import-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.import-results {
  padding: 1rem 0;
}

.results-summary {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.9375rem;
}

.result-item.success {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.result-item.success svg {
  color: #22c55e;
  flex-shrink: 0;
}

.result-item.error {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.result-item.error svg {
  color: #ef4444;
  flex-shrink: 0;
}

.errors-list {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.errors-list h4 {
  margin: 0 0 0.75rem 0;
  color: #374151;
  font-size: 0.9375rem;
  font-weight: 600;
}

.errors-list ul {
  margin: 0;
  padding-left: 1.5rem;
  max-height: 200px;
  overflow-y: auto;
}

.errors-list li {
  margin: 0.5rem 0;
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
}

.info-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  border: 1px solid #bbdefb;
  border-radius: 12px;
  margin: 10px auto 1.5rem auto;
  max-width: 1600px;
  font-size: 0.875rem;
  color: #1565c0;
  animation: slideDown 0.3s ease-out;
}

.info-banner svg {
  flex-shrink: 0;
  opacity: 0.8;
}

.info-banner .orders-indicator {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  background: rgba(255, 193, 7, 0.2);
  border-radius: 4px;
  color: #f57c00;
  font-weight: 600;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.orders-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.2) 0%, rgba(255, 152, 0, 0.15) 100%);
  border: 1.5px solid rgba(255, 193, 7, 0.5);
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  color: #f57c00;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(255, 193, 7, 0.1);
}

.orders-badge svg {
  opacity: 0.9;
  flex-shrink: 0;
}

.delete-orders-warning {
  padding: 0.5rem 0;
}

.warning-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.warning-icon svg {
  color: #f44336;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

.warning-content {
  text-align: left;
}

.warning-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #d32f2f;
  margin: 0 0 1rem 0;
  text-align: center;
}

.warning-description {
  font-size: 1rem;
  color: #333;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.text-danger {
  color: #d32f2f;
  font-weight: 700;
}

.warning-details {
  background: #fff3e0;
  border-left: 4px solid #ff9800;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 4px;
}

.warning-details p {
  margin: 0 0 0.5rem 0;
  font-weight: 600;
  color: #e65100;
}

.warning-details ul {
  margin: 0.5rem 0 0 0;
  padding-left: 1.5rem;
}

.warning-details li {
  margin: 0.35rem 0;
  color: #555;
  line-height: 1.5;
}

.confirmation-input-wrapper {
  margin: 1.5rem 0;
}

.confirmation-input-wrapper label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #333;
  font-size: 0.938rem;
}

.confirmation-code {
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  padding: 2px 8px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.938rem;
  color: #d32f2f;
  font-weight: 600;
}

.confirmation-input {
  width: 95%;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Courier New', monospace;
  transition: all 0.2s ease;
}

.confirmation-input:focus {
  outline: none;
  border-color: #d32f2f;
  box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
}

.confirmation-input::placeholder {
  font-family: system-ui, -apple-system, sans-serif;
  color: #999;
}

.warning-footer {
  background: #ffebee;
  border: 1px solid #ffcdd2;
  padding: 0.875rem;
  border-radius: 8px;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: #c62828;
  line-height: 1.5;
}

.warning-footer strong {
  font-weight: 700;
}

.view-controls {
  display: flex;
  justify-content: center;
  padding: 1rem 2.5rem;
  max-width: 1600px;
  margin: 0 auto;
}

.view-toggle {
  display: flex;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0.25rem;
}

.toggle-btn {
  background: transparent;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;
}

.toggle-btn span {
  display: none;
}

@media (min-width: 640px) {
  .toggle-btn span {
    display: inline;
  }
}

.toggle-btn:hover {
  color: #0d2954;
}

.toggle-btn.active {
  background: #0d2954;
  color: #ffffff;
}
</style>
