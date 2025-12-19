// ==============================================
// RUTA: src/services/Api.ts
// ACCIÓN: REEMPLAZAR archivo completo
// ==============================================

import { useAuthStore } from '@/stores/auth.store'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

if (!BASE_URL) {
  throw new Error(
    'VITE_API_BASE_URL is not defined in the environment files. Please check your .env files.',
  )
}

// ==================== TIPOS DE DATOS (DTOs) ====================

export type UserAuthDto = {
  userID: string
  email: string
  name: string
  userType: 'admin' | 'user' | 'staff-user' | 'moderator' | 'scanner'
  isVerified: boolean
  dateOfBirth?: string
  profilePicture?: string
}

export type AuthResponseDto = {
  success: boolean
  message?: string
  user: UserAuthDto | null
  token: string | null
  refreshToken?: string | null
}

export type UserListDto = {
  userID: string
  name: string
  email: string
  userType: 'admin' | 'user' | 'staff-user' | 'moderator' | 'scanner'
  isVerified: boolean
  createdAt?: string
  preferences?: string[]
}

export type UserDetailDto = {
  userID: string
  name: string
  email: string
  userType: 'admin' | 'user' | 'staff-user' | 'moderator' | 'scanner'
  isVerified: boolean
  dateOfBirth?: string
  profilePicture?: string
  preferences?: string[]
  createdAt?: string
}

export type UserCreateDto = {
  name: string
  email: string
  password: string
  userType: 'admin' | 'user' | 'staff-user' | 'moderator' | 'scanner'
  preferences?: string[]
}

export type UserUpdateDto = {
  name?: string
  email?: string
  password?: string
  userType?: 'admin' | 'user' | 'staff-user' | 'moderator' | 'scanner'
  preferences?: string[]
  dateOfBirth?: string
  profilePicture?: string
  isVerified?: boolean
}

export type PagedResult<T> = {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export type EventListDto = {
  eventID: string
  name: string
  startDate: string
  endDate?: string
  address: string
  postcode: string
  description?: string
  status: string
  capacity?: number
  price: number
  organizer?: string
  preferenceName?: string
  imageUrl?: string
  externalUrl?: string
  hasOrders?: boolean
}

export type EventDetailDto = {
  eventID: string
  name: string
  startDate: string
  endDate?: string
  address: string
  postcode: string
  details?: string
  description?: string
  status: string
  capacity?: number
  price: number
  organizer?: string
  preferenceId?: string
  externalUrl?: string
  imageUrl?: string
}

export type EventCreateDto = {
  name: string
  startDate: string
  endDate?: string
  address: string
  postcode: string
  description?: string
  capacity?: number
  price?: number
  organizer?: string
  externalUrl?: string
  preferenceId?: string
  imageUrl?: string
}

export type EventUpdateDto = {
  name?: string
  startDate?: string
  endDate?: string
  address?: string
  postcode?: string
  description?: string
  capacity?: number
  price?: number
  organizer?: string
  externalUrl?: string
  preferenceId?: string
  imageUrl?: string
}

export type EventImageCreateDto = {
  EventID: string
  ImageURL: string
  IsPrimary?: boolean
  Caption?: string
}

export type EventImageDto = {
  imageID: string
  eventID: string
  imageURL: string
  isPrimary: boolean
  caption?: string
  uploadedAt: string
}

export type PreferenceDto = {
  preferenceId: string
  name: string
}

export type CreatePreferenceDto = {
  name: string
}

export type UpdatePreferenceDto = {
  name: string
}

// ==================== FUNCIÓN REQUEST ====================

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const authStore = useAuthStore()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((init?.headers as Record<string, string>) || {}),
  }

  if (authStore.isLoggedIn && authStore.token) {
    headers['Authorization'] = `Bearer ${authStore.token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers,
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)

    const error = {
      message: data?.title || data?.message || `Request failed with status ${res.status}`,
      response: {
        data: data,
        status: res.status,
      },
    }

    if (res.status === 401) {
      console.error('Received 401 Unauthorized. Logging out.')
      authStore.logout()
    }

    throw error
  }

  if (res.status === 204) return undefined as unknown as T

  const contentType = res.headers.get('content-type')
  const contentLength = res.headers.get('content-length')

  if (!contentType?.includes('application/json') || contentLength === '0') {
    return undefined as unknown as T
  }

  return res.json() as Promise<T>
}

// ==================== AUTH API ====================

export type RegisterDto = {
  name: string
  email: string
  password: string
  userType?: 'admin' | 'user' | 'staff-user' | 'moderator' | 'scanner'
}

export const AuthApi = {
  login: (email: string, password: string) =>
    request<AuthResponseDto>(`/api/Auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (data: RegisterDto) =>
    request<AuthResponseDto>(`/api/Auth/register`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  verifySession: () => request<UserDetailDto>('/api/Users/me'),
}

// ==================== USER API ====================

export const UserApi = {
  list: (params?: {
    q?: string
    page?: number
    pageSize?: number
    sortBy?: string
    sortOrder?: string
  }) => {
    const searchParams = new URLSearchParams()
    if (params?.q) searchParams.append('q', params.q)
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString())
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy)
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder)
    return request<PagedResult<UserListDto>>(`/api/Users?${searchParams.toString()}`)
  },

  getPendingStaff: () => request<UserListDto[]>(`/api/Users/pending-staff`),

  get: (id: string) => request<UserDetailDto>(`/api/Users/${id}`),

  create: (data: UserCreateDto) =>
    request<UserDetailDto>(`/api/Users`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UserUpdateDto) =>
    request<UserDetailDto>(`/api/Users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  remove: (id: string) =>
    request<void>(`/api/Users/${id}`, {
      method: 'DELETE',
    }),
}

// ==================== EVENTS API ====================

export const EventApi = {
  list: (params?: { q?: string; page?: number; pageSize?: number; preferenceId?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.q) searchParams.append('q', params.q)
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString())
    if (params?.preferenceId) searchParams.append('categoryId', params.preferenceId)
    return request<PagedResult<EventListDto>>(`/api/Events/discover?${searchParams.toString()}`)
  },

  listForAdmin: (params?: {
    q?: string
    page?: number
    pageSize?: number
    preferenceId?: string
    status?: string
    orderBy?: string
    sortOrder?: string
  }) => {
    const searchParams = new URLSearchParams()
    if (params?.q) searchParams.append('q', params.q)
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString())
    if (params?.preferenceId) searchParams.append('categoryId', params.preferenceId)
    if (params?.status) searchParams.append('status', params.status)
    if (params?.orderBy) searchParams.append('orderBy', params.orderBy)
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder)

    return request<PagedResult<EventListDto>>(`/api/Events/admin-list?${searchParams.toString()}`)
  },

  getMyEvents: () => request<EventListDto[]>(`/api/Events/my-events`),

  get: (id: string) => request<EventDetailDto>(`/api/Events/${id}`),

  create: (data: EventCreateDto) =>
    request<EventDetailDto>(`/api/Events`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: EventUpdateDto) =>
    request<EventDetailDto>(`/api/Events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  remove: (id: string) =>
    request<void>(`/api/Events/${id}`, {
      method: 'DELETE',
    }),
}

// ==================== PREFERENCES API ====================

export const PreferencesApi = {
  getAll: () => request<PreferenceDto[]>(`/api/preferences`),

  getById: (id: string) => request<PreferenceDto>(`/api/preferences/${id}`),

  create: (data: CreatePreferenceDto) =>
    request<PreferenceDto>(`/api/preferences`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdatePreferenceDto) =>
    request<void>(`/api/preferences/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<void>(`/api/preferences/${id}`, {
      method: 'DELETE',
    }),
}

// ==================== FILES API ====================

export const FilesApi = {
  uploadImage: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const authStore = useAuthStore()
    const headers: Record<string, string> = {}
    if (authStore.isLoggedIn && authStore.token) {
      headers['Authorization'] = `Bearer ${authStore.token}`
    }

    return fetch(`${BASE_URL}/api/Files/upload`, {
      method: 'POST',
      body: formData,
      headers,
    }).then(async (res) => {
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        const error = {
          message: data?.message || `Image upload failed with status ${res.status}`,
          response: {
            data: data,
            status: res.status,
          },
        }
        throw error
      }
      return res.json() as Promise<{ imageUrl: string }>
    })
  },
}

// ==================== IMAGE API ====================

export const ImageApi = {
  upload: (data: EventImageCreateDto) =>
    request<EventImageDto>(`/api/EventImages`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

// ==================== REPORTS API ====================

export type ReportedMessageInfoDto = {
  messageId: string
  senderId: string
  senderName: string
  senderProfilePicture?: string
  content: string
  messageType: string
  mediaUrls?: string[]
  sentAt: string
  matchId: string
}

export type ReportedUserProfileSummaryDto = {
  userId: string
  name: string
  age: number
  bio?: string
  photos: string[]
}

export type ReportListDto = {
  id: string
  reportType: 'user' | 'message'
  reporterName: string
  reporterEmail: string
  // Para reportes de usuario
  reportedUserId?: string
  reportedUserName?: string
  reportedUserEmail?: string
  reportedUserProfilePicture?: string
  // Para reportes de mensaje
  reportedMessageId?: string
  reportedMessage?: ReportedMessageInfoDto
  reason: string
  description?: string
  status: string
  createdAt: string
  reviewedAt?: string
  reviewedByName?: string
  reportedUserTotalReports: number
  evidenceUrls: string[]
}

export type ReportDetailDto = ReportListDto & {
  previousReports: ReportListDto[]
  reportedUserProfile?: ReportedUserProfileSummaryDto
  reportedUserPhotos: string[]
  adminNotes?: string
  actionTaken?: string
}

export type UserSummaryDto = {
  userId: string
  name: string
  profilePictureUrl?: string
}

export type ResolveReportDto = {
  actionTaken: string
  adminNotes?: string
  suspensionDays?: number
}

export type ReportStatsDto = {
  totalPending: number
  totalReviewing: number
  totalThisWeek: number
  totalThisMonth: number
  totalUserReports: number
  totalMessageReports: number
  byReason: Record<string, number>
  byStatus: Record<string, number>
  byType: Record<string, number>
  topReportedUsers: { userId: string; name: string; profilePicture?: string; reportCount: number }[]
}

export const ReportsApi = {
  list: (params?: { status?: string; reportType?: string; page?: number; pageSize?: number }) => {
    const searchParams = new URLSearchParams()
    if (params?.status) searchParams.append('status', params.status)
    if (params?.reportType) searchParams.append('reportType', params.reportType)
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString())

    return request<PagedResult<ReportListDto>>(
      `/api/admin/reports?${searchParams.toString()}`,
    )
  },

  get: (reportType: string, id: string) =>
    request<ReportDetailDto>(`/api/admin/reports/${reportType}/${id}`),

  resolve: (reportType: string, id: string, data: ResolveReportDto) =>
    request<void>(`/api/admin/reports/${reportType}/${id}/resolve`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getStats: () => request<ReportStatsDto>(`/api/admin/reports/stats`),
}
