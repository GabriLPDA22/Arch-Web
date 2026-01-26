<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Events Management</h1>
          <p class="page-subtitle">Manage and organize all your events</p>
        </div>
        <div class="header-buttons">
          <button class="download-template-btn" @click="downloadExcelTemplate">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M12,19L8,15H10.5V12H13.5V15H16L12,19Z"
              />
            </svg>
            Download Template
          </button>
          <label class="import-btn">
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
              style="display: none"
            />
          </label>
          <button class="create-btn" @click="openCreateModal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
            </svg>
            Create Event
          </button>
        </div>
      </div>
    </div>

    <div class="info-banner">
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

    <div class="toolbar">
      <div class="toolbar-top">
        <div class="search-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="search-icon">
            <path
              d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
            />
          </svg>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search events..."
            class="search-input"
          />
          <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
              />
            </svg>
          </button>
        </div>

        <div class="toolbar-right">
          <button class="icon-btn" @click="fetchEvents" :disabled="loading" title="Refresh">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              :class="{ spinning: loading }"
            >
              <path
                d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"
              />
            </svg>
          </button>

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
      </div>

      <div class="filters-wrapper">
        <div class="filter-section">
          <h3 class="filter-group-title">Status</h3>
          <div class="filters-group">
            <button
              v-for="filter in statusFilters"
              :key="filter.id"
              class="filter-btn"
              :class="{ active: activeFilterId === filter.id }"
              @click="activeFilterId = filter.id"
            >
              {{ filter.label }}
            </button>
          </div>
        </div>

        <div v-if="categoryFilters.length > 0" class="filter-section">
          <h3 class="filter-group-title">Categories</h3>
          <div class="filters-group">
            <button
              v-for="filter in categoryFilters"
              :key="filter.id"
              class="filter-btn"
              :class="{ active: activeFilterId === filter.id }"
              @click="activeFilterId = filter.id"
            >
              {{ filter.label }}
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- Skeleton loading state -->
    <div v-if="loading" class="events-container" :class="viewMode">
      <EventCardSkeleton v-for="i in pageSize" :key="i" :view-mode="viewMode" />
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
      <p>
        {{ searchQuery ? 'Try a different search term' : 'Start by creating your first event' }}
      </p>
      <button class="create-btn-empty" @click="openCreateModal">Create Event</button>
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

    <PaginationComponent
      v-if="!loading && events.length > 0"
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-changed="goToPage"
    />

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
        <button class="btn-danger" @click="handleDeleteConfirm">Delete Event</button>
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
          :disabled="deleteConfirmationText.toLowerCase() !== 'delete'"
        >
          Delete Event & Orders
        </button>
      </template>
    </ModalComponent>

    <ModalComponent
      :show="showImportResultModal"
      title="Import Results"
      @close="closeImportResultModal"
    >
      <div class="import-result">
        <div class="result-summary">
          <div class="result-icon" :class="importResult.errorCount === 0 ? 'success' : 'warning'">
            <svg
              v-if="importResult.errorCount === 0"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
            </svg>
            <svg v-else width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
              />
            </svg>
          </div>

          <h3 class="result-title">
            {{
              importResult.errorCount === 0 ? 'Import successful!' : 'Import completed with errors'
            }}
          </h3>

          <p class="result-message">
            {{ importResult.successCount }} event{{ importResult.successCount !== 1 ? 's' : '' }}
            imported successfully
            <span v-if="importResult.errorCount > 0">, {{ importResult.errorCount }} failed</span>
          </p>
        </div>

        <div v-if="importResult.errors.length > 0" class="errors-section">
          <h4>Error details:</h4>
          <div class="errors-list">
            <div
              v-for="(error, index) in importResult.errors.slice(0, 5)"
              :key="index"
              class="error-item"
            >
              {{ error }}
            </div>
            <div v-if="importResult.errors.length > 5" class="more-errors">
              ... and {{ importResult.errors.length - 5 }} more errors
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <button class="btn-primary" @click="closeImportResultModal">Close</button>
      </template>
    </ModalComponent>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import * as XLSX from 'xlsx'
import {
  EventApi,
  FilesApi,
  type EventListDto,
  type EventDetailDto,
  type EventCreateDto,
  PreferencesApi,
} from '@/services/Api'
import EventForm from '@/components/forms/EventForm.vue'
import PaginationComponent from '@/components/ui/PaginationComponent.vue'
import ModalComponent from '@/components/ui/ModalComponent.vue'
import AlertMessage from '@/components/common/AlertMessage.vue'
import EventCardSkeleton from '@/components/ui/EventCardSkeleton.vue'
import { useAuthStore } from '@/stores/auth.store'
import defaultEventImage from '@/assets/images/default_event_image.jpg'
import { successMessages, handleApiError } from '@/utils/validators'

const authStore = useAuthStore()

const events = ref<EventListDto[]>([])
const loading = ref(true)
const submitting = ref(false)
const searchQuery = ref('')
const viewMode = ref<'table' | 'grid'>('grid')
const activeFilterId = ref<string | null>('all')

const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = 12
const isFormModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isEditing = ref(false)
const selectedEvent = ref<EventDetailDto | null>(null)
const eventFormComponent = ref<InstanceType<typeof EventForm> | null>(null)
const excelFileInput = ref<HTMLInputElement | null>(null)
const filters = ref<{ label: string; id: string }[]>([])
const showImportResultModal = ref(false)
const importResult = ref({
  successCount: 0,
  errorCount: 0,
  errors: [] as string[],
})

const isDeleteWithOrdersModalOpen = ref(false)
const deleteConfirmationText = ref('')
const selectedEventOrderCount = ref(0)

const showAlert = ref(false)
const alertType = ref<'error' | 'success' | 'warning' | 'info'>('info')
const alertMessage = ref('')

const isProduction = import.meta.env.PROD

const statusFilters = computed(() => {
  const baseFilters = filters.value.filter((f) => ['all', 'active', 'finished'].includes(f.id))
  // En producción, ocultar el filtro "Finished Events"
  if (isProduction) {
    return baseFilters.filter((f) => f.id !== 'finished')
  }
  return baseFilters
})
const categoryFilters = computed(() =>
  filters.value.filter((f) => !['all', 'active', 'finished'].includes(f.id)),
)

/**
 * Determines if an event has finished.
 * Uses UK timezone (Europe/London) for comparison since all events are UK-based.
 * An event is considered finished if the current UK time is past the event's end date/time.
 */
const isEventFinished = (event: EventListDto): boolean => {
  const eventEndDateString = event.endDate || event.startDate
  if (!eventEndDateString) return false
  
  // Parse the event end date (stored in ISO format / UTC)
  const eventEndDate = new Date(eventEndDateString)
  
  // Get current time in UK timezone
  const nowInUK = new Date(new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' }))
  
  // For the comparison, we consider the event finished after 23:59:59 UK time on the end date
  // First, convert the event end date to UK timezone for accurate day comparison
  const eventEndInUK = new Date(eventEndDate.toLocaleString('en-GB', { timeZone: 'Europe/London' }))
  eventEndInUK.setHours(23, 59, 59, 999)
  
  return nowInUK > eventEndInUK
}

const fetchEvents = async () => {
  loading.value = true
  const params: {
    q: string
    page: number
    pageSize: number
    orderBy: string
    sortOrder: string
    status?: string
    preferenceId?: string
  } = {
    q: searchQuery.value,
    page: currentPage.value,
    pageSize: pageSize,
    orderBy: 'startDate',
    sortOrder: 'asc',
  }

  const filter = activeFilterId.value
  
  // En producción, si el filtro es "finished", cambiarlo a "all"
  if (isProduction && filter === 'finished') {
    activeFilterId.value = 'all'
  }
  
  // Determinar el status a enviar al backend
  if (filter === 'active') {
    params.status = 'active'
  } else if (filter === 'finished') {
    // Solo permitir "finished" en desarrollo
    if (!isProduction) {
      params.status = 'finished'
    }
  } else if (filter === 'all') {
    // En producción, cuando es "all", enviar "active" para excluir finished en el backend
    // Esto asegura que la paginación funcione correctamente
    if (isProduction) {
      params.status = 'active'
    }
    // En desarrollo, no enviamos status para obtener todos los eventos
  } else if (filter && filter !== 'all') {
    // Es un filtro de categoría (preferenceId)
    params.preferenceId = filter
    // En producción, también excluir eventos terminados cuando se filtra por categoría
    if (isProduction) {
      params.status = 'active'
    }
  }

  try {
    const pagedResult = await EventApi.listForAdmin(params)
    events.value = pagedResult.items || []
    totalPages.value = pagedResult.totalPages || 1
  } catch (err: unknown) {
    console.error('Failed to load events:', err)
    if (authStore.isLoggedIn) {
      handleApiError(err)
    }
    events.value = []
    totalPages.value = 1
  } finally {
    loading.value = false
  }
}

watch([searchQuery, activeFilterId], () => {
  currentPage.value = 1
  fetchEvents()
})

const goToPage = (page: number) => {
  currentPage.value = page
  fetchEvents()
}

const loadFilters = async () => {
  const staticFilters = [
    { label: 'All Events', id: 'all' },
    { label: 'Active Events', id: 'active' },
    // En producción, no incluir el filtro "Finished Events"
    ...(isProduction ? [] : [{ label: 'Finished Events', id: 'finished' }]),
  ]

  const cachedPreferences = localStorage.getItem('preferencesCache')
  const cacheTimestamp = localStorage.getItem('preferencesCacheTimestamp')
  const now = new Date().getTime()

  if (cachedPreferences && cacheTimestamp && now - parseInt(cacheTimestamp, 10) < 3600000) {
    const dynamicFilters = JSON.parse(cachedPreferences)
    filters.value = [...staticFilters, ...dynamicFilters]
    return
  }

  try {
    const preferences = await PreferencesApi.getAll()
    const dynamicFilters = preferences.map((p) => ({
      label: p.name,
      id: p.preferenceId,
    }))

    localStorage.setItem('preferencesCache', JSON.stringify(dynamicFilters))
    localStorage.setItem('preferencesCacheTimestamp', now.toString())

    filters.value = [...staticFilters, ...dynamicFilters]
  } catch (error: unknown) {
    console.error('Failed to load filters:', error)
    handleApiError(error)
    filters.value = staticFilters
  }
}

const formatDate = (iso?: string) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const openCreateModal = () => {
  isEditing.value = false
  selectedEvent.value = null
  isFormModalOpen.value = true
}

const openEditModal = async (event: EventListDto) => {
  isEditing.value = true
  selectedEvent.value = null
  isFormModalOpen.value = true
  try {
    const fullEventDetails = await EventApi.get(event.eventID)
    selectedEvent.value = fullEventDetails
  } catch (error: unknown) {
    console.error('Failed to fetch event details for editing:', error)
    handleApiError(error)
    closeModals()
  }
}

const openDeleteModal = async (event: EventListDto) => {
  selectedEvent.value = event as EventDetailDto

  if (event.hasOrders) {
    selectedEventOrderCount.value = 1
    deleteConfirmationText.value = ''
    isDeleteWithOrdersModalOpen.value = true
    return
  }

  isDeleteModalOpen.value = true
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

const confirmDeleteWithOrders = async () => {
  if (deleteConfirmationText.value.toLowerCase() !== 'delete') {
    showAlertMessage('error', 'Please type "delete" to confirm deletion')
    return
  }

  if (!selectedEvent.value?.eventID) return

  try {
    await EventApi.remove(selectedEvent.value.eventID)

    closeDeleteWithOrdersModal()
    await fetchEvents()

    showAlertMessage(
      'success',
      `Event "${selectedEvent.value.name}" and all associated orders have been deleted successfully.`,
    )

    successMessages.deleted('event')
  } catch (err: unknown) {
    console.error('Failed to delete event with orders:', err)
    handleApiError(err)
    showAlertMessage('error', 'Failed to delete event. Please try again.')
  }
}

const closeImportResultModal = () => {
  showImportResultModal.value = false
}

const handleSaveEvent = async () => {
  if (!eventFormComponent.value) return
  submitting.value = true
  let imageUrl: string | undefined = isEditing.value ? selectedEvent.value?.imageUrl : undefined

  try {
    const imageFile = eventFormComponent.value.imageFile
    if (imageFile) {
      const uploadResult = await FilesApi.uploadImage(imageFile)
      imageUrl = uploadResult.imageUrl
    }

    const form = eventFormComponent.value.form
    
    // Validate dates before converting to ISO
    const startDate = new Date(form.startLocal)
    if (!form.startLocal || isNaN(startDate.getTime())) {
      throw new Error('Start date is invalid')
    }
    
    // ✅ EndDate is now required
    if (!form.endLocal) {
      throw new Error('End date is required')
    }
    const endDate = new Date(form.endLocal)
    if (isNaN(endDate.getTime())) {
      throw new Error('End date is invalid')
    }
    if (endDate <= startDate) {
      throw new Error('End date must be after start date')
    }
    const endDateISO = endDate.toISOString()
    
    const payload = {
      name: form.name.trim(),
      description: form.description?.trim(),
      startDate: startDate.toISOString(),
      endDate: endDateISO,
      address: form.address.trim(),
      postcode: form.postcode.trim(),
      capacity: form.capacity ?? undefined,
      price: form.price || 0,
      preferenceId: form.preferenceId ?? undefined,
      externalUrl: form.externalUrl || undefined,
      imageUrl: imageUrl,
    }

    if (isEditing.value && selectedEvent.value?.eventID) {
      await EventApi.update(selectedEvent.value.eventID, payload)
      successMessages.updated('event')
    } else {
      await EventApi.create(payload)
      successMessages.created('event')
    }
    await fetchEvents()
    closeModals()
  } catch (err: unknown) {
    console.error('Failed to save event:', err)
    handleApiError(err)
  } finally {
    submitting.value = false
  }
}

const handleDeleteConfirm = async () => {
  if (!selectedEvent.value?.eventID) return

  try {
    await EventApi.remove(selectedEvent.value.eventID)
    closeModals()
    await fetchEvents()
    successMessages.deleted('event')
  } catch (err: unknown) {
    console.error('Failed to delete event:', err)
    handleApiError(err)
  }
}

const handleExcelImport = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  loading.value = true

  try {
    const data = await file.arrayBuffer()
    const workbook = XLSX.read(data, { 
      cellDates: true, 
      cellNF: false,
      type: 'array',
    })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      raw: true, // Keep raw values to preserve Date objects
      defval: null,
      dateNF: 'yyyy-mm-dd hh:mm:ss',
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

        // Helper function to convert empty strings to undefined
        const toOptionalString = (value: unknown): string | undefined => {
          const str = value?.toString().trim()
          return str && str.length > 0 ? str : undefined
        }

        // Helper function to parse optional number
        const toOptionalNumber = (value: unknown): number | undefined => {
          if (value === null || value === undefined || value === '') return undefined
          const num = typeof value === 'number' ? value : parseFloat(value.toString())
          return !isNaN(num) ? num : undefined
        }

        // Build payload, only including defined values
        const payload: EventCreateDto = {
          name: (row.name?.toString().trim() || '') as string,
          startDate: parseExcelDate(row.startDate),
          endDate: parseExcelDate(row.endDate),
          address: (row.address?.toString().trim() || '') as string,
          postcode: (row.postcode?.toString().trim() || '') as string,
        }

        // Add optional fields only if they have values
        const description = toOptionalString(row.description)
        if (description !== undefined) {
          payload.description = description
        }

        const capacity = toOptionalNumber(row.capacity)
        if (capacity !== undefined) {
          payload.capacity = capacity
        }

        const price = toOptionalNumber(row.price)
        if (price !== undefined) {
          payload.price = price
        }

        const organizer = toOptionalString(row.organizer)
        if (organizer !== undefined) {
          payload.organizer = organizer
        }

        const externalUrl = toOptionalString(row.externalUrl)
        if (externalUrl !== undefined) {
          payload.externalUrl = externalUrl
        }

        // preferenceId is not included - backend will assign "General" by default

        if (!payload.name || !payload.startDate || !payload.endDate || !payload.address || !payload.postcode) {
          throw new Error('Required fields are missing')
        }

        await EventApi.create(payload)
        successCount++
      } catch (error: unknown) {
        errorCount++
        let errorMessage = 'Unknown error'
        
        if (error instanceof Error) {
          errorMessage = error.message
        } else if (error && typeof error === 'object' && 'response' in error) {
          // Handle API error response
          const apiError = error as { response?: { data?: { errors?: Record<string, string[]> } } }
          if (apiError.response?.data?.errors) {
            const validationErrors = Object.entries(apiError.response.data.errors)
              .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
              .join('; ')
            errorMessage = `Validation errors: ${validationErrors}`
          } else if (apiError.response?.data && typeof apiError.response.data === 'object' && 'title' in apiError.response.data) {
            errorMessage = (apiError.response.data as { title?: string }).title || errorMessage
          }
        }
        
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

    await fetchEvents()
  } catch (error: unknown) {
    console.error('Error processing Excel:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    alert(`Error processing file: ${errorMessage}`)
  } finally {
    loading.value = false
    input.value = ''
  }
}

const parseExcelDate = (value: unknown): string => {
  if (!value && value !== 0) throw new Error('Empty date')

  // If it's already a Date object
  if (value instanceof Date) {
    if (isNaN(value.getTime())) {
      throw new Error('Invalid date')
    }
    return value.toISOString()
  }

  // If it's a string, try to parse it
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) throw new Error('Empty date string')
    
    // Try ISO format first
    let date = new Date(trimmed)
    if (!isNaN(date.getTime())) {
      return date.toISOString()
    }
    
    // Try common date formats
    // Format: YYYY-MM-DD HH:MM:SS or YYYY-MM-DDTHH:MM:SS
    const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2}):(\d{2}))?/)
    if (isoMatch) {
      const [, year, month, day, hour = '00', minute = '00', second = '00'] = isoMatch
      date = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`)
      if (!isNaN(date.getTime())) {
        return date.toISOString()
      }
    }
    
    // Try DD/MM/YYYY or MM/DD/YYYY format
    const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/)
    if (slashMatch) {
      const [, part1, part2, year, hour = '00', minute = '00', second = '00'] = slashMatch
      // Try both DD/MM/YYYY and MM/DD/YYYY
      date = new Date(`${year}-${part2}-${part1}T${hour}:${minute}:${second}`)
      if (isNaN(date.getTime())) {
        date = new Date(`${year}-${part1}-${part2}T${hour}:${minute}:${second}`)
      }
      if (!isNaN(date.getTime())) {
        return date.toISOString()
      }
    }
    
    throw new Error(`Invalid date format: ${trimmed}`)
  }

  // If it's a number, treat it as Excel serial date
  if (typeof value === 'number') {
    // Excel epoch is December 30, 1899
    const excelEpoch = new Date(1899, 11, 30)
    const date = new Date(excelEpoch.getTime() + value * 86400000)
    if (isNaN(date.getTime())) {
      throw new Error('Invalid Excel date number')
    }
    return date.toISOString()
  }

  throw new Error(`Invalid date format: ${typeof value}`)
}

const downloadExcelTemplate = () => {
  // Define the template data with headers and example row
  // Using Date objects for proper Excel date formatting
  const exampleStartDate = new Date('2024-01-15T10:00:00')
  const exampleEndDate = new Date('2024-01-15T18:00:00')
  
  const templateData = [
    {
      name: 'Event Name',
      startDate: exampleStartDate,
      endDate: exampleEndDate,
      address: '123 Main Street',
      postcode: 'SW1A 1AA',
      description: '',
      capacity: '',
      price: '',
      organizer: '',
      externalUrl: '',
    },
  ]

  // Create a new workbook
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(templateData, {
    cellDates: true,
    dateNF: 'yyyy-mm-dd hh:mm:ss',
  })

  // Set column widths for better readability
  const colWidths = [
    { wch: 25 }, // name
    { wch: 20 }, // startDate
    { wch: 20 }, // endDate
    { wch: 30 }, // address
    { wch: 15 }, // postcode
    { wch: 40 }, // description
    { wch: 10 }, // capacity
    { wch: 10 }, // price
    { wch: 25 }, // organizer
    { wch: 30 }, // externalUrl
  ]
  ws['!cols'] = colWidths

  // Format date columns
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1')
  for (let row = 1; row <= range.e.r; row++) {
    // Column B (startDate) and C (endDate) - 0-indexed
    const startDateCell = XLSX.utils.encode_cell({ r: row, c: 1 })
    const endDateCell = XLSX.utils.encode_cell({ r: row, c: 2 })
    
    if (ws[startDateCell]) {
      ws[startDateCell].z = 'yyyy-mm-dd hh:mm:ss'
    }
    if (ws[endDateCell]) {
      ws[endDateCell].z = 'yyyy-mm-dd hh:mm:ss'
    }
  }

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Events Template')

  // Generate Excel file and download
  XLSX.writeFile(wb, 'events_template.xlsx')
}

onMounted(() => {
  if (authStore.isLoggedIn) {
    // En producción, si el filtro activo es "finished", cambiarlo a "all"
    if (isProduction && activeFilterId.value === 'finished') {
      activeFilterId.value = 'all'
    }
    fetchEvents()
    loadFilters()
  } else {
    loading.value = false
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

.header-buttons {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.download-template-btn {
  background: #ffffff;
  color: #1a202c;
  border: 1px solid #e5e7eb;
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

.download-template-btn:hover {
  background: #f9fafb;
  border-color: #0d2954;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.import-btn {
  background: #ffffff;
  color: #1a202c;
  border: 1px solid #e5e7eb;
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

.import-btn:hover {
  background: #f9fafb;
  border-color: #dbb067;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
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

.create-btn:hover {
  background: #c9a05a;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(219, 176, 103, 0.4);
}

.create-btn:active {
  transform: translateY(0);
}

.toolbar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem 2.5rem;
  max-width: 1600px;
  margin: 0 auto;
}

.toolbar-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.toolbar-right {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 280px;
  max-width: 450px;
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
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.95rem;
  background: #ffffff;
  transition: all 0.2s ease;
  outline: none;
}

.search-input:focus {
  border-color: #dbb067;
  box-shadow: 0 0 0 3px rgba(219, 176, 103, 0.1);
}

.clear-btn {
  position: absolute;
  right: -3.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.filters-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.filter-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.filter-group-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4b5563;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding-left: 0.25rem;
  margin: 0;
}

.filters-group {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.75rem 1.25rem;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  border-radius: 10px;
  color: #6b7280;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  border-color: #dbb067;
  color: #0d2954;
}

.filter-btn.active {
  background: #0d2954;
  border-color: #0d2954;
  color: #ffffff;
}

.icon-btn {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: all 0.2s ease;
}

.icon-btn:hover {
  border-color: #dbb067;
  color: #0d2954;
}

.icon-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
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

.create-btn-empty:hover {
  background: #1a3d6e;
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
  border: 1px solid #e5e7eb;
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
  display: inline-block;
  padding: 0.375rem 0.75rem;
  background: #eff6ff;
  color: #1e40af;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
}

.event-date {
  font-size: 0.875rem;
  color: #6b7280;
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
}

.btn-primary,
.btn-secondary,
.btn-danger {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.btn-primary {
  background: #dbb067;
  color: #ffffff;
}

.btn-primary:hover {
  background: #c9a05a;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #4b5563;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-danger {
  background: #ef4444;
  color: #ffffff;
}

.btn-danger:hover {
  background: #dc2626;
}

.delete-warning {
  text-align: center;
  padding: 1rem;
}

.delete-warning svg {
  color: #f59e0b;
  margin-bottom: 1rem;
}

.delete-warning p {
  color: #4b5563;
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.delete-warning strong {
  color: #1a202c;
}

.warning-text {
  color: #9ca3af;
  font-size: 0.875rem;
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

/* Estilos para el modal de importación */
.import-result {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem 0;
}

.result-summary {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
}

.result-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-icon.success {
  background: #d1fae5;
  color: #047857;
}

.result-icon.warning {
  background: #fef3c7;
  color: #d97706;
}

.result-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.result-message {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
}

.errors-section {
  margin-top: 0.5rem;
}

.errors-section h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #ef4444;
  margin: 0 0 0.75rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.errors-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
}

.error-item {
  background: #fef2f2;
  border-left: 3px solid #ef4444;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #991b1b;
}

.more-errors {
  text-align: center;
  padding: 0.5rem;
  color: #6b7280;
  font-weight: 600;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .dashboard-header,
  .toolbar,
  .events-container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .dashboard-header {
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-title {
    font-size: 1.75rem;
  }

  .header-buttons {
    width: 100%;
    flex-direction: column;
  }

  .download-template-btn,
  .import-btn,
  .create-btn {
    width: 100%;
    justify-content: center;
  }

  .toolbar {
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
  }

  .toolbar-top {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .search-box {
    max-width: 100%;
  }

  .toolbar-right {
    width: 100%;
    justify-content: space-between;
  }

  .events-container.grid {
    grid-template-columns: 1fr;
  }

  .events-container.table .event-card {
    flex-direction: column;
    height: auto;
  }

  .events-container.table .event-image {
    width: 100%;
    height: 200px;
  }
}

/* ✅ Info Banner */
.info-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  border: 1px solid #bbdefb;
  border-radius: 12px;
  margin-top: 10px;
  margin-bottom: 1.5rem;
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

/* ✅ Orders Badge */
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

.event-title-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  margin-bottom: 8px;
}

.event-title-wrapper .event-title {
  margin: 0;
  width: 100%;
}

/* ✅ Modal AWS */
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
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
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

.btn-danger:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: #bdbdbd;
  border-color: #bdbdbd;
}

</style>
