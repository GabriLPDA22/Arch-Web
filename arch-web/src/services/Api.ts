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

// Helper: Si la URL base termina en /api-dev, las rutas no deben incluir /api/
const isDevelopmentApi = BASE_URL.endsWith('/api-dev')
const normalizePath = (path: string): string => {
  if (isDevelopmentApi && path.startsWith('/api/')) {
    // En desarrollo, eliminar /api/ de la ruta porque la base ya incluye /api-dev
    return path.replace(/^\/api\//, '/')
  }
  return path
}

// ==================== TIPOS DE DATOS (DTOs) ====================

export type UserRole = 'current_student' | 'alumni' | null

export type UserAuthDto = {
  userID: string
  email: string
  name: string
  userType: 'admin' | 'user' | 'staff-user' | 'moderator' | 'scanner' | 'org-members'
  userRole: UserRole
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
  userType: 'admin' | 'user' | 'staff-user' | 'moderator' | 'scanner' | 'org-members'
  userRole: UserRole
  isVerified: boolean
  createdAt?: string
  preferences?: string[]
}

export type UserDetailDto = {
  userID: string
  name: string
  email: string
  userType: 'admin' | 'user' | 'staff-user' | 'moderator' | 'scanner' | 'org-members'
  userRole: UserRole
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
  userType: 'admin' | 'user' | 'staff-user' | 'moderator' | 'scanner' | 'org-members'
  userRole?: UserRole
  preferences?: string[]
}

export type UserUpdateDto = {
  name?: string
  email?: string
  password?: string
  userType?: 'admin' | 'user' | 'staff-user' | 'moderator' | 'scanner' | 'org-members'
  userRole?: UserRole
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

export type UserRelatedDataDto = {
  hasDatingProfile: boolean
  swipeActionsCount: number
  likesCount: number
  matchesCount: number
  messagesCount: number
  ordersCount: number
  hasRelatedData: boolean
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

  const normalizedPath = normalizePath(path)
  const res = await fetch(`${BASE_URL}${normalizedPath}`, {
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
  userType?: 'admin' | 'user' | 'staff-user' | 'moderator' | 'scanner' | 'org-members'
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

  remove: (id: string, confirm?: boolean) =>
    request<void>(`/api/Users/${id}${confirm ? '?confirm=DELETE' : ''}`, {
      method: 'DELETE',
    }),

  getRelatedData: (id: string) =>
    request<UserRelatedDataDto>(`/api/Users/${id}/related-data`),
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

    return fetch(`${BASE_URL}${normalizePath('/api/Files/upload')}`, {
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

// ==================== JOBS API ====================

// Matches backend: ArchBackend.DTOs.Job.JobListDto
export type JobListDto = {
  id: string
  organizationId?: string
  organizationName: string
  title: string
  companyName: string
  locationText?: string
  durationText?: string
  isPaid: boolean
  description?: string
  applyUrl?: string
  imageUrl?: string
  categories: string[]          // e.g. ["Finance", "Law", "IT"] - multiple categories per job
  applicationDeadline?: string  // DateTime ISO string (e.g. "2024-02-16T00:00:00Z")
  applicationDeadlineWeek?: string  // Oxford Week format (e.g. "Friday Week 5") - calculated by backend
  payRange?: string             // e.g. "£1500-£2000"
  isFromAlumni: boolean         // true = job for Alumni (golden tick)
  createdAt: string
  publishedAt?: string
  interestedCandidatesCount: number
}

// Matches backend: ArchBackend.DTOs.Job.JobResponseDto
export type JobDetailDto = {
  id: string
  organizationId?: string
  createdByUserId: string
  title: string
  companyName: string
  locationText?: string
  durationText?: string
  isPaid: boolean
  description?: string
  applyUrl?: string
  imageUrl?: string
  categories: string[]          // e.g. ["Finance", "Law", "IT"] - multiple categories per job
  applicationDeadline?: string  // DateTime ISO string (e.g. "2024-02-16T00:00:00Z")
  applicationDeadlineWeek?: string  // Oxford Week format (e.g. "Friday Week 5") - calculated by backend
  payRange?: string
  isFromAlumni: boolean
  createdAt: string
  updatedAt: string
  publishedAt?: string
  // Extra fields for dashboard compatibility (may not be in all responses)
  organizationName?: string
  createdByName?: string
  interestedCandidatesCount?: number
}

// Matches backend: ArchBackend.DTOs.Job.JobCreateDto
export type JobCreateDto = {
  organizationId?: string
  title: string
  companyName: string
  locationText?: string
  durationText?: string
  description?: string
  applyUrl?: string
  imageUrl?: string
  isPaid?: boolean              // default: false
  categories?: string[]         // default: ["Other"] - multiple categories per job
  applicationDeadline?: string  // DateTime ISO string (e.g. "2024-02-16T00:00:00Z")
  payRange?: string
  isFromAlumni?: boolean        // default: false
}

// Matches backend: ArchBackend.DTOs.Job.JobUpdateDto
export type JobUpdateDto = {
  title?: string
  companyName?: string
  locationText?: string
  durationText?: string
  isPaid?: boolean
  description?: string
  applyUrl?: string
  imageUrl?: string
  categories?: string[]         // multiple categories per job
  applicationDeadline?: string  // DateTime ISO string (e.g. "2024-02-16T00:00:00Z")
  payRange?: string
  isFromAlumni?: boolean
}

export type JobSearchParams = {
  query?: string
  location?: string
  isPaid?: boolean
  durationText?: string
  organizationId?: string
  category?: string
  page?: number
  pageSize?: number
}

// Job Categories
export type JobCategoryDto = {
  id: string
  name: string
  description?: string
  icon?: string
  displayOrder: number
  isActive: boolean
  createdAt: string
}

export type CreateJobCategoryDto = {
  name: string
  description?: string
  icon?: string
  displayOrder?: number
  isActive?: boolean
}

export type UpdateJobCategoryDto = {
  name?: string
  description?: string
  icon?: string
  displayOrder?: number
  isActive?: boolean
}

export type InterestedCandidateDto = {
  candidateUserId: string
  candidateName: string
  candidateEmail?: string
  candidateProfilePicture?: string
  expressedInterestAt: string
}

// ==================== CANDIDATE PROFILES (CV) ====================

export type CandidateProfileDto = {
  userId: string
  sellingPoints: string
  college?: string
  course?: string
}

export type ParsedCvPoints = {
  top?: string
  second?: string
  third?: string
}

/**
 * Utilidad para extraer hasta 3 "highlights" del CV a partir del campo `sellingPoints`.
 * Admite texto separado por saltos de línea, `;` o `|`.
 */
export const parseCvPoints = (sellingPoints?: string | null): ParsedCvPoints => {
  if (!sellingPoints) {
    return { top: undefined, second: undefined, third: undefined }
  }

  const parts = sellingPoints
    .split(/[\n|;]+/)
    .map((p) => p.trim())
    .filter(Boolean)

  return {
    top: parts[0],
    second: parts[1],
    third: parts[2],
  }
}

export const CandidateProfilesApi = {
  getByUserId: (userId: string) =>
    request<CandidateProfileDto>(`/api/candidate-profiles/${userId}`),
}

export const JobsApi = {
  list: (params?: {
    category?: string
    organizationId?: string
    page?: number
    pageSize?: number
  }) => {
    const searchParams = new URLSearchParams()
    if (params?.category) searchParams.append('category', params.category)
    if (params?.organizationId) searchParams.append('organizationId', params.organizationId)
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString())
    return request<PagedResult<JobListDto>>(`/api/jobs?${searchParams.toString()}`)
  },

  get: (id: string) => request<JobDetailDto>(`/api/jobs/${id}`),

  search: (params?: JobSearchParams) => {
    const searchParams = new URLSearchParams()
    if (params?.query) searchParams.append('query', params.query)
    if (params?.location) searchParams.append('location', params.location)
    if (params?.isPaid !== undefined) searchParams.append('isPaid', params.isPaid.toString())
    if (params?.durationText) searchParams.append('durationText', params.durationText)
    if (params?.organizationId) searchParams.append('organizationId', params.organizationId)
    if (params?.category) searchParams.append('category', params.category)
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString())
    return request<PagedResult<JobListDto>>(`/api/jobs/search?${searchParams.toString()}`)
  },

  getCategories: () => request<string[]>(`/api/jobs/categories`),

  // Job Categories Management
  getCategoriesFull: () => request<JobCategoryDto[]>(`/api/jobcategories`),
  getCategoryById: (id: string) => request<JobCategoryDto>(`/api/jobcategories/${id}`),
  createCategory: (data: CreateJobCategoryDto) =>
    request<JobCategoryDto>(`/api/jobcategories`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCategory: (id: string, data: UpdateJobCategoryDto) =>
    request<JobCategoryDto>(`/api/jobcategories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteCategory: (id: string) =>
    request<void>(`/api/jobcategories/${id}`, {
      method: 'DELETE',
    }),
  reorderCategories: (categoryIds: string[]) =>
    request<void>(`/api/jobcategories/reorder`, {
      method: 'POST',
      body: JSON.stringify(categoryIds),
    }),

  getMyJobs: () => request<JobListDto[]>(`/api/jobs/my`),

  create: (data: JobCreateDto) =>
    request<JobDetailDto>(`/api/jobs`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: JobUpdateDto) =>
    request<JobDetailDto>(`/api/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  remove: (id: string) =>
    request<void>(`/api/jobs/${id}`, {
      method: 'DELETE',
    }),

  getInterestedCandidates: (id: string) =>
    request<InterestedCandidateDto[]>(`/api/jobs/${id}/candidates`),

  expressInterest: (id: string) =>
    request<void>(`/api/jobs/${id}/interest`, {
      method: 'POST',
    }),

  removeInterest: (id: string) =>
    request<void>(`/api/jobs/${id}/interest`, {
      method: 'DELETE',
    }),

  uploadImage: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const authStore = useAuthStore()
    const headers: Record<string, string> = {}
    if (authStore.isLoggedIn && authStore.token) {
      headers['Authorization'] = `Bearer ${authStore.token}`
    }

    return fetch(`${BASE_URL}${normalizePath('/api/jobs/upload-image')}`, {
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

// ==================== ORGANIZATIONS API ====================

export type OrganizationListDto = {
  id: string
  name: string
  logoUrl?: string
  websiteUrl?: string
  createdAt: string
  updatedAt: string
}

export type OrganizationDetailDto = OrganizationListDto & {
  // Additional detail fields if needed
}

export type OrganizationCreateDto = {
  name: string
  logoUrl?: string
  websiteUrl?: string
}

export type OrganizationUpdateDto = {
  name?: string
  logoUrl?: string
  websiteUrl?: string
}

export type OrganizationMemberListDto = {
  id: string
  organizationId: string
  userId: string
  userName: string
  userEmail: string
  role: 'Admin' | 'Member' | 'Editor'
  createdAt: string
}

export type OrganizationMemberCreateDto = {
  organizationId: string
  name: string
  email: string
  password: string
  role: 'Admin' | 'Member' | 'Editor'
  dateOfBirth?: string
  profilePicture?: string
}

export type OrganizationMemberUpdateDto = {
  role: 'Admin' | 'Member' | 'Editor'
}

export type UserOrganizationMembershipDto = {
  organizationId: string
  organizationName: string
  organizationLogoUrl?: string
  role: 'Admin' | 'Member' | 'Editor'
  memberId: string
}

export const OrganizationsApi = {
  list: () => request<OrganizationListDto[]>(`/api/organizations`),

  get: (id: string) => request<OrganizationDetailDto>(`/api/organizations/${id}`),

  getMy: () => request<OrganizationListDto[]>(`/api/organizations/my`),

  getMyMemberships: async (): Promise<UserOrganizationMembershipDto[]> => {
    try {
      // Obtener las organizaciones del usuario usando el endpoint documentado
      const organizations = await request<OrganizationListDto[]>(`/api/organizations/my`)
      const memberships: UserOrganizationMembershipDto[] = []

      // Obtener información del usuario actual desde el endpoint /api/Users/me
      const userData = await request<UserDetailDto>(`/api/Users/me`)
      const userId = userData.userID

      if (!userId) {
        return []
      }

      // Para cada organización, obtener los miembros y encontrar el rol del usuario actual
      for (const org of organizations) {
        try {
          const members = await request<OrganizationMemberListDto[]>(`/api/organizations/${org.id}/members`)
          const userMember = members.find(m => m.userId === userId)
          
          if (userMember) {
            memberships.push({
              organizationId: org.id,
              organizationName: org.name,
              organizationLogoUrl: org.logoUrl,
              role: userMember.role,
              memberId: userMember.id,
            })
          }
        } catch (err) {
          console.warn(`Failed to get members for organization ${org.id}:`, err)
        }
      }

      return memberships
    } catch (error) {
      console.error('Failed to get organization memberships:', error)
      return []
    }
  },

  create: (data: OrganizationCreateDto) =>
    request<OrganizationDetailDto>(`/api/organizations`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: OrganizationUpdateDto) =>
    request<OrganizationDetailDto>(`/api/organizations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  remove: (id: string) =>
    request<void>(`/api/organizations/${id}`, {
      method: 'DELETE',
    }),

  // Organization Members endpoints
  getMembers: (id: string) =>
    request<OrganizationMemberListDto[]>(`/api/organizations/${id}/members`),

  addMember: (id: string, data: OrganizationMemberCreateDto) =>
    request<OrganizationMemberListDto>(`/api/organizations/${id}/members`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateMember: (id: string, memberId: string, data: OrganizationMemberUpdateDto) =>
    request<OrganizationMemberListDto>(`/api/organizations/${id}/members/${memberId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  removeMember: (id: string, memberId: string) =>
    request<void>(`/api/organizations/${id}/members/${memberId}`, {
      method: 'DELETE',
    }),
}
