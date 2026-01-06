// src/services/StaffService.ts
// Service for Staff registration and verification
// Supports both mock mode and real backend integration

import { AuthApi, UserApi, EventApi, type AuthResponseDto, type UserListDto, type EventListDto, type EventCreateDto, type EventUpdateDto } from './Api'

export interface StaffRegisterDto {
  organizationName: string
  email: string
  password: string
}

export interface StaffRegisterResponse {
  success: boolean
  message: string
  userId?: string
}

export interface PendingStaffUser {
  userID: string
  name: string
  email: string
  userType: 'staff-user'
  isVerified: boolean
  createdAt: string
}

export interface VerifyStaffResponse {
  success: boolean
  message: string
}

// Mock data storage (en producción esto vendría del backend)
let mockPendingStaff: PendingStaffUser[] = []

// Mock events storage para staff
let mockStaffEvents: StaffEventDto[] = []

// Flag para usar mock o backend real (cambiar a false cuando el backend esté listo)
const USE_MOCK = import.meta.env.VITE_USE_MOCK_STAFF === 'true' || false

/**
 * Register a new staff/organization
 * Uses the backend Auth/register endpoint with userType: 'staff-user'
 */
export const StaffApi = {
  register: async (data: StaffRegisterDto): Promise<StaffRegisterResponse> => {
    if (USE_MOCK) {
      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Accept any subdomain of ox.ac.uk (e.g., @ox.ac.uk, @lmh.ox.ac.uk, @colleges.ox.ac.uk)
      const oxfordDomainRegex = /@([\w.-]+\.)?ox\.ac\.uk$/i
      const isValidDomain = oxfordDomainRegex.test(data.email)

      if (!isValidDomain) {
        throw new Error('Only Oxford organizations allowed')
      }

      const newStaff: PendingStaffUser = {
        userID: `mock-${Date.now()}`,
        name: data.organizationName,
        email: data.email,
        userType: 'staff-user',
        isVerified: false,
        createdAt: new Date().toISOString(),
      }

      mockPendingStaff.push(newStaff)
      console.log(`📧 [MOCK EMAIL] New Organization "${data.organizationName}" wants to join. Email: ${data.email}`)

      return {
        success: true,
        message: 'Registration successful. Please wait for admin verification.',
        userId: newStaff.userID,
      }
    }

    // Real backend implementation
    try {
      // Usar el endpoint de registro existente con userType: 'staff-user'
      // El backend creará el usuario con isVerified: false por defecto
      const response = await AuthApi.register({
        name: data.organizationName,
        email: data.email,
        password: data.password,
        userType: 'staff-user', // ✅ CRUCIAL: Tipo de usuario staff
      })

      if (!response.success || !response.user) {
        throw new Error(response.message || 'Registration failed')
      }

      // El backend debería enviar un email de notificación al admin automáticamente
      // a través del INotificationService

      return {
        success: true,
        message: 'Registration successful. Please wait for admin verification.',
        userId: response.user.userID,
      }
    } catch (error: unknown) {
      // Manejar errores del backend
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
        (error as { message?: string })?.message ||
        'Registration failed. Please try again.'
      throw new Error(errorMessage)
    }
  },

  /**
   * Get all pending staff users (for admin)
   * Uses the optimized endpoint /api/Users/pending-staff
   */
  getPendingStaff: async (): Promise<PendingStaffUser[]> => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return mockPendingStaff.filter((staff) => !staff.isVerified)
    }

    // Real backend implementation - usando endpoint optimizado
    try {
      const response = await UserApi.getPendingStaff()

      // Debug: ver qué está devolviendo el backend
      console.log('Pending staff response:', response, 'Type:', typeof response, 'Is Array:', Array.isArray(response))

      // Manejar diferentes formatos de respuesta
      let users: UserListDto[]
      if (Array.isArray(response)) {
        users = response
      } else if (response && typeof response === 'object' && 'items' in response) {
        // Si viene como PagedResult
        users = (response as { items: UserListDto[] }).items
      } else if (response && typeof response === 'object' && 'data' in response) {
        // Si viene envuelto en data
        users = (response as { data: UserListDto[] }).data
      } else {
        console.warn('Unexpected response format from pending-staff endpoint:', response)
        users = []
      }

      // Mapear a PendingStaffUser
      return users.map(
        (user): PendingStaffUser => ({
          userID: user.userID,
          name: user.name,
          email: user.email,
          userType: 'staff-user',
          isVerified: user.isVerified,
          createdAt: user.createdAt || new Date().toISOString(),
        }),
      )
    } catch (error: unknown) {
      console.error('Error fetching pending staff:', error)
      throw new Error('Failed to load pending staff requests')
    }
  },

  /**
   * Approve a staff user
   * Updates user isVerified to true
   */
  approveStaff: async (userId: string): Promise<VerifyStaffResponse> => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 800))

      const staffIndex = mockPendingStaff.findIndex((s) => s.userID === userId)
      if (staffIndex === -1) {
        throw new Error('Staff user not found')
      }

      mockPendingStaff[staffIndex].isVerified = true
      const staff = mockPendingStaff[staffIndex]

      console.log(`📧 [MOCK EMAIL] Welcome email sent to ${staff.email}`)
      console.log(`✅ Staff "${staff.name}" has been approved`)

      return {
        success: true,
        message: `Staff "${staff.name}" has been approved and welcome email sent.`,
      }
    }

    // Real backend implementation
    try {
      // Obtener el usuario actual para obtener su nombre
      const user = await UserApi.get(userId)
      if (!user) {
        throw new Error('Staff user not found')
      }

      // Actualizar el usuario marcándolo como verificado
      // El backend debería manejar el envío del email de bienvenida
      await UserApi.update(userId, {
        isVerified: true, // Marcar como verificado
      })

      // Nota: El backend debería tener lógica para enviar email de bienvenida
      // cuando isVerified cambia de false a true. Si no, necesitarás crear
      // un endpoint específico en el backend para esto.

      return {
        success: true,
        message: `Staff "${user.name}" has been approved and welcome email sent.`,
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
        (error as { message?: string })?.message ||
        'Failed to approve staff'
      throw new Error(errorMessage)
    }
  },

  /**
   * Reject a staff user
   * Deletes the user request
   */
  rejectStaff: async (userId: string): Promise<VerifyStaffResponse> => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const staffIndex = mockPendingStaff.findIndex((s) => s.userID === userId)
      if (staffIndex === -1) {
        throw new Error('Staff user not found')
      }

      const staff = mockPendingStaff[staffIndex]
      mockPendingStaff.splice(staffIndex, 1)

      console.log(`❌ Staff request from "${staff.name}" has been rejected and deleted`)

      return {
        success: true,
        message: `Staff request from "${staff.name}" has been rejected.`,
      }
    }

    // Real backend implementation
    try {
      // Obtener el usuario antes de eliminarlo para el mensaje
      const user = await UserApi.get(userId)
      if (!user) {
        throw new Error('Staff user not found')
      }

      const userName = user.name

      // Eliminar el usuario
      await UserApi.remove(userId)

      return {
        success: true,
        message: `Staff request from "${userName}" has been rejected.`,
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
        (error as { message?: string })?.message ||
        'Failed to reject staff'
      throw new Error(errorMessage)
    }
  },
}

// ==================== STAFF EVENTS API ====================

export interface StaffEventDto {
  eventID: string
  title: string
  dateTime: string
  location: string
  description: string
  status: string
  createdBy: string
}

export interface CreateEventDto {
  title: string
  dateTime: string
  location: string
  postcode: string
  description: string
}

export interface UpdateEventDto {
  title?: string
  dateTime?: string
  location?: string
  postcode?: string
  description?: string
}

/**
 * Staff Events Management API
 * Now uses real backend endpoints
 */
export const StaffEventsApi = {
  /**
   * Get all events created by the current staff user
   * Uses GET /api/Events/my-events
   */
  getMyEvents: async (): Promise<StaffEventDto[]> => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return mockStaffEvents
    }

    try {
      const response = await EventApi.getMyEvents()

      // Manejar diferentes formatos de respuesta
      let eventsList: EventListDto[]
      if (Array.isArray(response)) {
        eventsList = response
      } else if (response && typeof response === 'object' && 'items' in response) {
        // Si viene como PagedResult
        eventsList = (response as { items: EventListDto[] }).items
      } else if (response && typeof response === 'object' && 'data' in response) {
        // Si viene envuelto en data
        eventsList = (response as { data: EventListDto[] }).data
      } else {
        console.warn('Unexpected response format from my-events endpoint:', response)
        eventsList = []
      }

      // Mapear EventListDto a StaffEventDto
      return eventsList.map((event): StaffEventDto => ({
        eventID: event.eventID,
        title: event.name, // name → title
        dateTime: event.startDate, // startDate → dateTime
        location: event.address, // address → location
        description: event.description || '',
        status: event.status,
        createdBy: event.organizer || '',
      }))
    } catch (error: unknown) {
      console.error('Error fetching my events:', error)
      throw new Error('Failed to load events')
    }
  },

  /**
   * Create a new event
   * Uses POST /api/Events
   * Maps form fields to backend format
   */
  createEvent: async (data: CreateEventDto): Promise<StaffEventDto> => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 800))

      const newEvent: StaffEventDto = {
        eventID: `event-${Date.now()}`,
        title: data.title,
        dateTime: data.dateTime,
        location: data.location,
        description: data.description,
        status: 'Published',
        createdBy: 'current-staff-user-id',
      }

      mockStaffEvents.push(newEvent)
      return newEvent
    }

    try {
      // Mapear CreateEventDto a EventCreateDto del backend
      const backendData: EventCreateDto = {
        name: data.title, // title → name
        startDate: data.dateTime, // dateTime → startDate
        address: data.location, // location → address
        postcode: data.postcode, // postcode (requerido)
        description: data.description,
        price: 0, // Valor por defecto
      }

      const event = await EventApi.create(backendData)

      // Mapear respuesta a StaffEventDto
      return {
        eventID: event.eventID,
        title: event.name,
        dateTime: event.startDate,
        location: event.address,
        description: event.description || '',
        status: event.status,
        createdBy: event.organizer || '',
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
        (error as { message?: string })?.message ||
        'Failed to create event'
      throw new Error(errorMessage)
    }
  },

  /**
   * Update an event
   * Uses PUT /api/Events/{id}
   * Maps form fields to backend format
   */
  updateEvent: async (eventId: string, data: UpdateEventDto): Promise<StaffEventDto> => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 600))

      const eventIndex = mockStaffEvents.findIndex((e) => e.eventID === eventId)
      if (eventIndex === -1) {
        throw new Error('Event not found')
      }

      mockStaffEvents[eventIndex] = {
        ...mockStaffEvents[eventIndex],
        ...data,
      }

      return mockStaffEvents[eventIndex]
    }

    try {
      // Mapear UpdateEventDto a EventUpdateDto del backend
      const backendData: EventUpdateDto = {}
      if (data.title) backendData.name = data.title
      if (data.dateTime) backendData.startDate = data.dateTime
      if (data.location) backendData.address = data.location
      if (data.postcode) backendData.postcode = data.postcode
      if (data.description) backendData.description = data.description

      const event = await EventApi.update(eventId, backendData)

      // Mapear respuesta a StaffEventDto
      return {
        eventID: event.eventID,
        title: event.name,
        dateTime: event.startDate,
        location: event.address,
        description: event.description || '',
        status: event.status,
        createdBy: event.organizer || '',
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
        (error as { message?: string })?.message ||
        'Failed to update event'
      throw new Error(errorMessage)
    }
  },

  /**
   * Delete an event
   * Uses DELETE /api/Events/{id}
   */
  deleteEvent: async (eventId: string): Promise<void> => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 400))

      const eventIndex = mockStaffEvents.findIndex((e) => e.eventID === eventId)
      if (eventIndex === -1) {
        throw new Error('Event not found')
      }

      mockStaffEvents.splice(eventIndex, 1)
      return
    }

    try {
      await EventApi.remove(eventId)
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
        (error as { message?: string })?.message ||
        'Failed to delete event'
      throw new Error(errorMessage)
    }
  },
}

