<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Events Management</h1>
          <p class="page-subtitle">Manage and organize all your events</p>
        </div>
        <button class="create-btn" @click="openCreateModal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
          </svg>
          Create Event
        </button>
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
          <button class="icon-btn" @click="refreshEvents" :disabled="refreshing" title="Refresh">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              :class="{ spinning: refreshing }"
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

      <div class="filters">
        <button
          v-for="filter in filters"
          :key="filter.id || 'all'"
          class="filter-btn"
          :class="{ active: activeFilterId === filter.id }"
          @click="selectFilter(filter.id)"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading events...</p>
    </div>

    <div v-else-if="!loading && filteredEvents.length === 0" class="empty-state">
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
      <div v-for="event in paginatedEvents" :key="event.eventID" class="event-card">
        <div class="event-image">
          <img :src="event.imageUrl || defaultEventImage" :alt="event.name" />
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
      v-if="!loading && filteredEvents.length > 0"
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
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { EventApi, FilesApi, type EventListDto, type EventDetailDto, PreferencesApi } from '@/services/Api'
import EventForm from '@/components/EventForm.vue'
import PaginationComponent from '@/components/PaginationComponent.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import defaultEventImage from '@/assets/images/default_event_image.jpg'

const allEvents = ref<EventListDto[]>([])
const loading = ref(false)
const refreshing = ref(false)
const submitting = ref(false)
const searchQuery = ref('')
const viewMode = ref('grid')
const activeFilterId = ref<string | null>(null)
const currentPage = ref(1)
const pageSize = 12
const isFormModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isEditing = ref(false)
const selectedEvent = ref<EventDetailDto | null>(null)
const eventFormComponent = ref<any>(null)
const filters = ref<{ label: string; id: string | null }[]>([{ label: 'All Events', id: null }])

const fetchEvents = async () => {
  loading.value = true
  try {
    const pagedResult = await EventApi.list({ pageSize: 9999, page: 1 })
    allEvents.value = pagedResult.items || []
  } catch (error) {
    console.error('Failed to load events:', error)
    allEvents.value = []
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

const filteredEvents = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  let eventsToFilter = allEvents.value

  if (activeFilterId.value) {
    const activeFilter = filters.value.find(f => f.id === activeFilterId.value)
    if (activeFilter) {
      eventsToFilter = eventsToFilter.filter(
        (event) => event.preferenceName === activeFilter.label
      )
    }
  }

  if (query) {
    eventsToFilter = eventsToFilter.filter(
      (event) =>
        (event.name && event.name.toLowerCase().includes(query)) ||
        (event.address && event.address.toLowerCase().includes(query)) ||
        (event.preferenceName && event.preferenceName.toLowerCase().includes(query))
    )
  }

  return eventsToFilter
})

const totalPages = computed(() => {
  return Math.ceil(filteredEvents.value.length / pageSize)
})

const paginatedEvents = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredEvents.value.slice(start, end)
})

const refreshEvents = async () => {
  if (refreshing.value) return
  refreshing.value = true
  await fetchEvents()
}

const loadFilters = async () => {
  try {
    const preferences = await PreferencesApi.getAll()
    const dynamicFilters = preferences.map((p) => ({
      label: p.name,
      id: p.preferenceId,
    }))
    filters.value = [{ label: 'All Events', id: null }, ...dynamicFilters]
  } catch (error) {
    console.error('Failed to load filters:', error)
  }
}

const selectFilter = (id: string | null) => {
  activeFilterId.value = id
  currentPage.value = 1
}

watch(searchQuery, () => {
  currentPage.value = 1
})

const goToPage = (page: number) => {
  currentPage.value = page
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
  } catch (error) {
    console.error('Failed to fetch event details for editing:', error)
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
    } else {
      await EventApi.create(payload)
    }

    await fetchEvents()
    closeModals()
  } catch (error) {
    console.error('Failed to save event:', error)
  } finally {
    submitting.value = false
  }
}

const handleDeleteConfirm = async () => {
  if (!selectedEvent.value?.eventID) return
  try {
    await EventApi.remove(selectedEvent.value.eventID)
    await fetchEvents()
    closeModals()
  } catch (error) {
    console.error('Failed to delete event:', error)
  }
}

onMounted(async () => {
  await fetchEvents()
  await loadFilters()
})
</script>

<style scoped>
.dashboard {
  padding: 0;
  min-height: 100vh;
}

/* ===== HEADER ===== */
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

/* ===== TOOLBAR ===== */
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

/* Search Box */
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
  right: 0.5rem;
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

/* Filters */
.filters {
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

/* Icon Button */
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

/* View Toggle */
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

/* ===== LOADING & EMPTY STATES ===== */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
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

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: #9ca3af;
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

/* ===== EVENTS GRID ===== */
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
  flex-direction: row;
}

.event-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.events-container.list .event-image {
  width: 280px;
  height: auto;
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

/* ===== MODAL BUTTONS ===== */
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

/* Delete Warning */
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

/* ===== RESPONSIVE ===== */
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
  }

  .events-container.list .event-image {
    width: 100%;
    height: 200px;
  }
}
</style>