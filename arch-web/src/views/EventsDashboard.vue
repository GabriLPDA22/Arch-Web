<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="dashboard-title">Events Dashboard</h1>
          <p class="dashboard-subtitle">Manage your events</p>
        </div>
        <button class="create-btn" @click="openCreateModal">
          <svg width="24" height="24" viewBox="0 0 24" fill="currentColor">
            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
          </svg>
          <span>Create Event</span>
        </button>
      </div>
    </div>

    <div class="stats-grid">
       <div class="stat-card">
        <div class="stat-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z"/></svg>
        </div>
        <div class="stat-content">
          <h3 class="stat-number">{{ loading ? '-' : totalEvents }}</h3>
          <p class="stat-label">Total Events</p>
        </div>
      </div>
    </div>

    <div class="controls-header">
      <div class="search-wrapper">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="search-icon"><path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/></svg>
        <input v-model="searchQuery" class="search-input" placeholder="Search events..." type="text"/>
      </div>
      <div class="actions-wrapper">
         <button class="action-btn" @click="fetchEvents(1)" title="Refresh Events">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" /></svg>
        </button>
        <div class="view-toggle">
          <button class="action-btn" :class="{active: viewMode === 'grid'}" @click="viewMode = 'grid'" title="Grid View">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3,11H11V3H3M3,21H11V13H3M13,21H21V13H13M13,3V11H21V3"/></svg>
          </button>
          <button class="action-btn" :class="{active: viewMode === 'list'}" @click="viewMode = 'list'" title="List View">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3,4H21V6H3V4M3,11H21V13H3V11M3,18H21V20H3V18Z"/></svg>
          </button>
        </div>
      </div>
    </div>

    <div class="filter-buttons">
      <button v-for="filter in filters" :key="filter.value" :class="['filter-btn', { active: activeFilter === filter.value }]" @click="activeFilter = filter.value">{{ filter.label }}</button>
    </div>

    <div class="events-section">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading events...</p>
      </div>

      <div v-else-if="filteredEvents.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor"><path d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M8.5,12.5L10,14L12,12L14,14L15.5,12.5L13.5,10.5L15.5,8.5L14,7L12,9L10,7L8.5,8.5L10.5,10.5L8.5,12.5Z"/></svg>
        </div>
        <h3>No events found</h3>
        <p>Create your first event to get started</p>
      </div>

      <div v-else class="events-container" :class="viewMode">
        <div v-for="event in filteredEvents" :key="event.eventID" class="event-card">
          <div class="card-image">
            <img :src="event.imageUrl || 'https://via.placeholder.com/300x200/f8f9fa/6c757d?text=Event'" :alt="event.name" class="event-image" />
            <div class="card-overlay">
              <div class="event-price">£{{ event.price }}</div>
              <div class="card-actions">
                <button class="action-btn edit-btn" @click.stop="openEditModal(event)" title="Edit Event"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"/></svg></button>
                <button class="action-btn delete-btn" @click.stop="openDeleteModal(event)" title="Delete Event"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/></svg></button>
              </div>
            </div>
          </div>
          <div class="card-content">
            <div class="event-meta">
              <span class="event-category">{{ event.preferenceName || 'General' }}</span>
              <span class="event-date">{{ formatDate(event.startDate) }}</span>
            </div>
            <h3 class="event-title">{{ event.name }}</h3>
             <div class="event-location">
              <svg class="location-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/></svg>
              <span>{{ event.address }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <PaginationComponent
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-changed="goToPage"
    />

    <teleport to="body">
      <div v-if="isFormModalOpen" class="modal-overlay" @click="closeModals">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <h2 class="modal-title">{{ isEditing ? 'Edit Event' : 'Create New Event' }}</h2>
            <button class="modal-close" @click="closeModals"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/></svg></button>
          </div>
          <div class="modal-body">
            <EventForm ref="eventFormComponent" :initial-data="selectedEvent" />
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" @click="closeModals">Cancel</button>
            <button class="btn-primary" :disabled="submitting" @click="handleSaveEvent">{{ submitting ? 'Saving...' : 'Save Event' }}</button>
          </div>
        </div>
      </div>
    </teleport>

    <teleport to="body">
      <div v-if="isDeleteModalOpen" class="modal-overlay" @click="closeModals">
        <div class="modal-container delete-modal" @click.stop>
          <div class="modal-header">
            <h2 class="modal-title">Delete Event</h2>
            <button class="modal-close" @click="closeModals"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/></svg></button>
          </div>
          <div class="modal-body">
            <div class="delete-warning">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor"><path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/></svg>
              <p>Are you sure you want to delete <strong>"{{ selectedEvent?.name }}"</strong>?</p>
              <p class="warning-text">This action cannot be undone.</p>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" @click="closeModals">Cancel</button>
            <button class="btn-danger" @click="handleDeleteConfirm">Delete Forever</button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import { EventApi, type EventListDto, type EventDetailDto } from "@/services/Api";
import { PreferencesService } from "@/services/PreferencesService";
import EventForm from '@/components/EventForm.vue';
// CORREGIDO: Nombre del componente de paginación
import PaginationComponent from '@/components/PaginationComponent.vue';

// State
const events = ref<EventListDto[]>([]);
const loading = ref(false);
const submitting = ref(false);
const activeFilter = ref("all");
const searchQuery = ref("");
const viewMode = ref('grid');

// State de paginación
const currentPage = ref(1);
const totalPages = ref(1);
const totalEvents = ref(0);
const pageSize = 12;

// Modal state
const isFormModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isEditing = ref(false);
const selectedEvent = ref<EventDetailDto | null>(null);
const eventFormComponent = ref<{ form: any; validationErrors: string[]; imageFile: File | null } | null>(null);

// Filtros
const filters = ref<{ label: string; value: string; }[]>([
  { label: "All Events", value: "all" }
]);

// Computed properties
const filteredEvents = computed(() => {
  // El filtrado por categoría ahora debería aplicarse sobre los resultados paginados,
  // o idealmente, ser un parámetro más de la API. Por ahora, lo dejamos como filtro visual.
  if (activeFilter.value === "all") {
    return events.value;
  }
  return events.value.filter(event =>
    event.preferenceName?.toLowerCase().includes(activeFilter.value.toLowerCase())
  );
});

// Funciones de API
const loadFilters = async () => {
  try {
    const preferences = await PreferencesService.getAll();
    const dynamicFilters = preferences.map(p => ({
      label: p.name,
      value: p.name.toLowerCase(),
    }));
    filters.value = [{ label: "All Events", value: "all" }, ...dynamicFilters];
  } catch (error) {
    console.error("Failed to load dynamic filters:", error);
  }
};

const fetchEvents = async (page = 1) => {
  loading.value = true;
  currentPage.value = page;
  try {
    const pagedResult = await EventApi.list({
      q: searchQuery.value,
      page: currentPage.value,
      pageSize: pageSize,
    });
    events.value = pagedResult.items;
    totalPages.value = pagedResult.totalPages;
    totalEvents.value = pagedResult.totalCount;
  } catch (error) {
    console.error("Failed to load events:", error);
  } finally {
    loading.value = false;
  }
};

let debounceTimer: number;
watch(searchQuery, () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    fetchEvents(1);
  }, 500);
});

// Handlers
const goToPage = (page: number) => {
  fetchEvents(page);
};

const formatDate = (iso?: string) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const selectEvent = (event: EventListDto) => {
  console.log("Selected event:", event);
};

// Handlers de modales
const openCreateModal = () => {
  isEditing.value = false;
  selectedEvent.value = null;
  isFormModalOpen.value = true;
};

const openEditModal = (event: EventListDto) => {
  isEditing.value = true;
  selectedEvent.value = event as EventDetailDto;
  isFormModalOpen.value = true;
};

const openDeleteModal = (event: EventListDto) => {
  selectedEvent.value = event as EventDetailDto;
  isDeleteModalOpen.value = true;
};

const closeModals = () => {
  isFormModalOpen.value = false;
  isDeleteModalOpen.value = false;
  selectedEvent.value = null;
  isEditing.value = false;
};

const handleSaveEvent = async () => {
  if (!eventFormComponent.value) return;
  submitting.value = true;
  try {
    const form = eventFormComponent.value.form;
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
    };
    if (isEditing.value && selectedEvent.value?.eventID) {
      await EventApi.update(selectedEvent.value.eventID, payload);
    } else {
      await EventApi.create(payload);
    }
    await fetchEvents(currentPage.value);
    closeModals();
  } catch (error) {
    console.error("Failed to save event:", error);
  } finally {
    submitting.value = false;
  }
};

const handleDeleteConfirm = async () => {
  if (!selectedEvent.value?.eventID) return;
  try {
    await EventApi.remove(selectedEvent.value.eventID);
    await fetchEvents(1);
    closeModals();
  } catch (error) {
    console.error("Failed to delete event:", error);
  }
};

// Lifecycle
onMounted(() => {
  fetchEvents();
  loadFilters();
});
</script>

<style scoped>
.dashboard-container {
  padding: 2rem;
}
.dashboard-header {
  margin-bottom: 2rem;
}
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.dashboard-title {
  font-size: 3rem;
  font-weight: 800;
  margin: 0;
}
.dashboard-subtitle {
  color: #718096;
  font-size: 1.1rem;
  margin-top: 0.5rem;
}
.create-btn {
  background: #dbb067;
  color: #ffffff;
  border: none;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
}
.create-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(219, 176, 103, 0.3);
}
.stats-grid {
  display: flex;
  margin-bottom: 2rem;
}
.stat-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  min-width: 280px;
}
.stat-icon {
  width: 64px;
  height: 64px;
  background: #f7fafc;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4a5568;
}
.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
}
.stat-label {
  color: #718096;
  margin-top: 0.5rem;
}
.controls-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}
.search-wrapper {
  flex-grow: 1;
  position: relative;
}
.search-icon {
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: #a0aec0;
  pointer-events: none;
}
.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;
}
.search-input:focus {
  outline: none;
  border-color: #dbb067;
  box-shadow: 0 0 0 3px rgba(219, 176, 103, 0.2);
}
.actions-wrapper {
  display: flex;
  gap: 0.5rem;
}
.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #718096;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}
.action-btn:hover {
  background: #f7fafc;
  border-color: #cbd5e0;
}
.action-btn.active {
  background: #dbb067;
  border-color: #dbb067;
  color: #ffffff;
}
.view-toggle {
  display: flex;
  border-radius: 0.5rem;
  overflow: hidden;
}
.view-toggle .action-btn {
  border-radius: 0;
}
.view-toggle .action-btn:first-child {
  border-right: none;
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
}
.view-toggle .action-btn:last-child {
  border-top-right-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}
.filter-buttons {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}
.filter-btn {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  color: #4a5568;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}
.filter-btn:hover {
  background: #f7fafc;
}
.filter-btn.active {
  background: #dbb067;
  border-color: #dbb067;
  color: #ffffff;
}
.events-section {
  min-height: 400px;
}
.loading-state, .empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #718096;
}
.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #dbb067;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.empty-icon {
  color: #cbd5e0;
  margin-bottom: 1rem;
}
.events-container.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}
.event-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}
.event-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}
.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}
.event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}
.event-card:hover .event-image {
  transform: scale(1.05);
}
.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 1rem;
}
.event-price {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-weight: 600;
  font-size: 0.9rem;
}
.card-actions {
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.event-card:hover .card-actions {
  opacity: 1;
}
.card-actions .action-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
}
/* CORREGIDO: Estilos específicos para los botones */
.card-actions .edit-btn {
  background: #dbb067;
}
.card-actions .delete-btn {
  background: #ef4444;
}
.card-actions .action-btn:hover {
  transform: scale(1.1);
}
.card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.event-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}
.event-category {
  background: #f7fafc;
  color: #4a5568;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
}
.event-date {
  color: #718096;
  font-size: 0.9rem;
  font-weight: 500;
}
.event-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.75rem 0;
  flex-grow: 1;
}
.event-location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #718096;
  font-size: 0.9rem;
}
.location-icon {
  flex-shrink: 0;
  vertical-align: middle;
}
.events-container.list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.events-container.list .event-card {
  flex-direction: row;
  align-items: center;
}
.events-container.list .card-image {
  width: 200px;
  height: 120px;
  flex-shrink: 0;
}
.events-container.list .card-content {
  flex-grow: 1;
}
.modal-overlay, .modal-container, .modal-header, .modal-body, .modal-footer {
  /* Estilos de los modales aquí */
}
</style>
