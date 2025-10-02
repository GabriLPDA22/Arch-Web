// src/services/Api.ts
import { useAuthStore } from "@/stores/auth.store";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5011";

// --- TIPOS DE DATOS (DTOs) ---

export type UserAuthDto = {
  userID: string;
  email: string;
  name: string;
  userType: 'admin' | 'user';
};

export type AuthResponseDto = {
  user: UserAuthDto;
  token: string;
  message?: string;
};

export type PagedResult<T> = {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type EventListDto = {
  eventID: string;
  name: string;
  startDate: string;
  endDate?: string;
  address: string;
  postcode: string;
  description?: string;
  status: string;
  capacity?: number;
  price: number;
  organizer?: string;
  preferenceName?: string;
  imageUrl?: string;
  externalUrl?: string;
};

export type EventDetailDto = {
  eventID: string;
  name: string;
  startDate: string;
  endDate?: string;
  address: string;
  postcode: string;
  details?: string;
  description?: string;
  status: string;
  capacity?: number;
  price: number;
  organizer?: string;
  preferenceId?: string;
  externalUrl?: string;
  imageUrl?: string;
};

export type EventCreateDto = {
  name: string;
  startDate: string;
  endDate?: string;
  address: string;
  postcode: string;
  description?: string;
  capacity?: number;
  price?: number;
  organizer?: string;
  externalUrl?: string;
  preferenceId?: string;
  imageUrl?: string; // <-- AÑADIDO
};

export type EventUpdateDto = {
  name?: string;
  startDate?: string;
  endDate?: string;
  address?: string;
  postcode?: string;
  description?: string;
  capacity?: number;
  price?: number;
  organizer?: string;
  externalUrl?: string;
  preferenceId?: string;
  imageUrl?: string; // <-- AÑADIDO
};

export type EventImageCreateDto = {
  EventID: string;
  ImageURL: string;
  IsPrimary?: boolean;
  Caption?: string;
};

export type EventImageDto = {
  imageID: string;
  eventID: string;
  imageURL: string;
  isPrimary: boolean;
  caption?: string;
  uploadedAt: string;
};

// FUNCIÓN DE REQUEST GENÉRICA CON CAPTURA DE CÓDIGOS DE ERROR 
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const authStore = useAuthStore();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init?.headers || {}),
  };

  if (authStore.isLoggedIn && authStore.token) {
    headers['Authorization'] = `Bearer ${authStore.token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (!res.ok) {
    // 🔥 MEJORA: Intentar parsear el JSON de error para obtener mensaje y código
    try {
      const errorData = await res.json();
      const error = new Error(errorData.message || `HTTP ${res.status}`) as any;
      
      // 👉 Adjuntar el código de error si existe (ej: "NOT_ADMIN")
      if (errorData.code) {
        error.code = errorData.code;
      }
      
      // También adjuntar la respuesta completa por si necesitamos más info
      error.response = {
        data: errorData,
        status: res.status
      };
      
      throw error;
    } catch (parseError) {
      // Si no se puede parsear como JSON, usar el texto plano
      const text = await res.text().catch(() => "");
      throw new Error(text || `HTTP ${res.status}`);
    }
  }
  
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

// --- CLIENTES DE API ---

export const AuthApi = {
  login: (email: string, password: string) =>
    request<AuthResponseDto>(`/api/Auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

export const EventApi = {
  list: (params?: { q?: string, page?: number, pageSize?: number, preferenceId?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.q) {
      searchParams.append("q", params.q);
    }
    if (params?.page) {
      searchParams.append("page", params.page.toString());
    }
    if (params?.pageSize) {
      searchParams.append("pageSize", params.pageSize.toString());
    }
    if (params?.preferenceId) {
      searchParams.append("categoryId", params.preferenceId);
    }
    return request<PagedResult<EventListDto>>(`/api/Events/discover?${searchParams.toString()}`);
  },
  get: (id: string) => request<EventDetailDto>(`/api/Events/${id}`),
  create: (data: EventCreateDto) =>
    request<EventDetailDto>(`/api/Events`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: EventUpdateDto) =>
    request<EventDetailDto>(`/api/Events/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  remove: (id: string) =>
    request<void>(`/api/Events/${id}`, {
      method: "DELETE",
    }),
};

// NUEVO CLIENTE PARA SUBIDA DE ARCHIVOS
export const FilesApi = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const authStore = useAuthStore();
    const headers: HeadersInit = {};
    if (authStore.isLoggedIn && authStore.token) {
      headers['Authorization'] = `Bearer ${authStore.token}`;
    }

    return fetch(`${BASE_URL}/api/Files/upload`, {
      method: 'POST',
      body: formData,
      headers,
    }).then(async res => {
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `HTTP ${res.status}`);
      }
      return res.json() as Promise<{ imageUrl: string }>;
    });
  },
};


export const ImageApi = {
  upload: (data: EventImageCreateDto) =>
    request<EventImageDto>(`/api/EventImages`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};