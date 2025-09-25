// src/services/Api.ts

// URL base de tu API, se puede sobrescribir con Vite
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5011'

// --- TIPOS DE DATOS (DTOs) ---

// DTOs para Autenticación
export type UserAuthDto = {
  userID: string
  email: string
  name: string
  userType: 'admin' | 'user'
}

export type AuthResponseDto = {
  user: UserAuthDto
  token: string
  message?: string
}

// DTOs para Eventos
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

// --- FUNCIÓN DE REQUEST GENÉRICA ---
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    ...init,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `HTTP ${res.status}`)
  }
  if (res.status === 204) return undefined as unknown as T
  return res.json() as Promise<T>
}

// --- CLIENTES DE API ---

export const AuthApi = {
  login: (email: string, password: string) =>
    request<AuthResponseDto>(`/api/Auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
}

export const EventApi = {
  list: (params?: { q?: string; page?: number; pageSize?: number }) => {
    const searchParams = new URLSearchParams()
    if (params?.q) {
      searchParams.append('q', params.q)
    }
    if (params?.page) {
      searchParams.append('page', params.page.toString())
    }
    if (params?.pageSize) {
      searchParams.append('pageSize', params.pageSize.toString())
    }
    return request<PagedResult<EventListDto>>(`/api/Events/discover?${searchParams.toString()}`)
  },
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

export const ImageApi = {
  upload: (data: EventImageCreateDto) =>
    request<EventImageDto>(`/api/EventImages`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}
