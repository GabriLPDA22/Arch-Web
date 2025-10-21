<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Events Management</h1>
          <p class="page-subtitle">Manage and organize all your events</p>
        </div>
        <div class="header-buttons">
          <label class="import-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M12,19L8,15H10.5V12H13.5V15H16L12,19Z" />
            </svg>
            Import Excel
            <input 
              type="file" 
              ref="excelFileInput"
              accept=".xlsx,.xls"
              @change="handleExcelImport"
              style="display: none;"
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
              :class="{ active: viewMode === 'grid' }"
              @click="viewMode = 'grid'"
              title="Grid View"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,11H11V3H3M3,21H11V13H3M13,21H21V13H13M13,3V11H21V3" />
              </svg>
            </button>
            <button
              class="toggle-btn"
              :class="{ active: viewMode === 'list' }"
              @click="viewMode = 'list'"
              title="List View"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M9,5V9H21V5M9,19H21V15H9M9,14H21V10H9M4,9H8V5H4M4,19H8V15H4M4,14H8V10H4V14Z"
                />
              </svg>
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
        :class="{ 'is-finished': isEventFinished(event) }"
      >
        <div v-if="isEventFinished(event)" class="finished-overlay">
          <span class="finished-text">Event Finished</span>
        </div>
        <div class="event-image">
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
          <div class="event-price">£{{ event.price?.toFixed(2) || '0.00' }}</div>
        </div>
        <div class="event-content">
          <div class="event-meta">
            <span class="event-category">{{ event.preferenceName || 'General' }}</span>
            <span class="event-date">{{ formatDate(event.startDate) }}</span>
          </div>
          <h3 class="event-title">{{ event.name }}</h3>
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
          Are you sure you want to delete <strong>{{ selectedEvent?.name }}</strong>?
        </p>
        <p class="warning-text">This action cannot be undone.</p>
      </div>
      <template #footer>
        <button class="btn-secondary" @click="closeModals">Cancel</button>
        <button class="btn-danger" @click="handleDeleteConfirm">Delete Event</button>
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
import { useAuthStore } from '@/stores/auth.store'
import defaultEventImage from '@/assets/images/default_event_image.jpg'
import { successMessages, handleApiError } from '@/utils/validators'

const authStore = useAuthStore()

const events = ref<EventListDto[]>([])
const loading = ref(true)
const submitting = ref(false)
const searchQuery = ref('')
const viewMode = ref('grid')
const activeFilterId = ref<string | null>('all')
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = 12
const isFormModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isEditing = ref(false)
const selectedEvent = ref<EventDetailDto | null>(null)
const eventFormComponent = ref<any>(null)
const excelFileInput = ref<HTMLInputElement | null>(null)
const filters = ref<{ label: string; id: string }[]>([])

const statusFilters = computed(() =>
  filters.value.filter((f) => ['all', 'active', 'finished'].includes(f.id)),
)
const categoryFilters = computed(() =>
  filters.value.filter((f) => !['all', 'active', 'finished'].includes(f.id)),
)

const isEventFinished = (event: EventListDto): boolean => {
  const eventEndDateString = event.endDate || event.startDate
  if (!eventEndDateString) return false
  const eventEndDate = new Date(eventEndDateString)
  const now = new Date()
  eventEndDate.setHours(23, 59, 59, 999)
  return now > eventEndDate
}

const fetchEvents = async () => {
  loading.value = true
  const params: any = {
    q: searchQuery.value,
    page: currentPage.value,
    pageSize: pageSize,
  }

  const filter = activeFilterId.value
  if (filter === 'active' || filter === 'finished') {
    params.status = filter
  } else if (filter && filter !== 'all') {
    params.preferenceId = filter
  }

  try {
    const pagedResult = await EventApi.listForAdmin(params)
    events.value = pagedResult.items || []
    totalPages.value = pagedResult.totalPages || 1
  } catch (err: any) {
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
    { label: 'Finished Events', id: 'finished' },
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
  } catch (error: any) {
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
  } catch (error: any) {
    console.error('Failed to fetch event details for editing:', error)
    handleApiError(error)
    closeModals()
  }
}

const openDeleteModal = (event: EventListDto) => {
  selectedEvent.value = event as EventDetailDto
  isDeleteModalOpen.value = true
}

const closeModals = () => {
  isFormModalOpen.value = false
  isDeleteModalOpen.value = false
  selectedEvent.value = null
  isEditing.value = false
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
    const payload = {
      name: form.name.trim(),
      description: form.description?.trim(),
      startDate: new Date(form.startLocal).toISOString(),
      endDate: form.endLocal ? new Date(form.endLocal).toISOString() : undefined,
      address: form.address.trim(),
      postcode: form.postcode.trim(),
      capacity: form.capacity,
      price: form.price || 0,
      preferenceId: form.preferenceId,
      externalUrl: form.externalUrl,
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
  } catch (err: any) {
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
  } catch (err: any) {
    console.error('Failed to delete event:', err)
    handleApiError(err)
  }
}

// 🔥 LÓGICA DE IMPORTACIÓN DE EXCEL
const handleExcelImport = async (event: Event) => {
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
      defval: null 
    }) as any[]
    
    if (jsonData.length === 0) {
      alert('El archivo Excel está vacío')
      return
    }
    
    const requiredColumns = ['name', 'startDate', 'address', 'postcode']
    const firstRow = jsonData[0]
    const missingColumns = requiredColumns.filter(col => !(col in firstRow))
    
    if (missingColumns.length > 0) {
      alert(`Faltan columnas requeridas: ${missingColumns.join(', ')}`)
      return
    }
    
    let successCount = 0
    let errorCount = 0
    const errors: string[] = []
    
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i]
      
      try {
        const payload: EventCreateDto = {
          name: row.name?.toString().trim() || '',
          startDate: parseExcelDate(row.startDate),
          endDate: row.endDate ? parseExcelDate(row.endDate) : undefined,
          address: row.address?.toString().trim() || '',
          postcode: row.postcode?.toString().trim() || '',
          description: row.description?.toString().trim() || undefined,
          capacity: row.capacity ? parseInt(row.capacity) : undefined,
          price: row.price ? parseFloat(row.price) : undefined,
          organizer: row.organizer?.toString().trim() || undefined,
          externalUrl: row.externalUrl?.toString().trim() || undefined,
          preferenceId: row.preferenceId?.toString().trim() || undefined,
          imageUrl: row.imageUrl?.toString().trim() || undefined,
        }
        
        if (!payload.name || !payload.startDate || !payload.address || !payload.postcode) {
          throw new Error(`Fila ${i + 2}: Faltan campos obligatorios`)
        }
        
        await EventApi.create(payload)
        successCount++
        
      } catch (error: any) {
        errorCount++
        errors.push(`Fila ${i + 2}: ${error.message || 'Error desconocido'}`)
        console.error(`Error en fila ${i + 2}:`, error)
      }
    }
    
    const message = `
      ✅ Importación completada
      
      Exitosos: ${successCount}
      Errores: ${errorCount}
      ${errors.length > 0 ? '\n\nErrores:\n' + errors.slice(0, 5).join('\n') : ''}
      ${errors.length > 5 ? `\n... y ${errors.length - 5} más` : ''}
    `
    
    alert(message)
    await fetchEvents()
    
  } catch (error: any) {
    console.error('Error al procesar el Excel:', error)
    alert(`Error al procesar el archivo: ${error.message}`)
  } finally {
    loading.value = false
    input.value = ''
  }
}

const parseExcelDate = (value: any): string => {
  if (!value) throw new Error('Fecha vacía')
  
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
  
  throw new Error('Formato de fecha inválido')
}

onMounted(() => {
  if (authStore.isLoggedIn) {
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
  justify-content: center;
  transition: all 0.2s ease;
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

.events-container.list {
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

.events-container.list .event-card {
  display: flex;
  height: 180px;
}

.event-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.events-container.list .event-image {
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
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
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

.event-card.is-finished {
  position: relative;
}

.event-card.is-finished .event-image,
.event-card.is-finished .event-content {
  filter: grayscale(90%);
  opacity: 0.7;
}

.finished-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 16px;
  pointer-events: none;
}

.events-container.grid .event-card.is-finished .finished-overlay {
  align-items: flex-start;
  padding-top: 30%;
}

.finished-text {
  font-size: 1.6rem;
  font-weight: 700;
  color: #ef4444;
  padding: 0.75rem 1.5rem;
  border: 3px solid #ef4444;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  transform: rotate(-10deg);
  user-select: none;
  box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
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

  .events-container.list .event-card {
    flex-direction: column;
    height: auto;
  }

  .events-container.list .event-image {
    width: 100%;
    height: 200px;
  }
}
</style>