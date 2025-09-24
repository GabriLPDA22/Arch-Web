// src/services/api.ts

// URL base de tu API, se puede sobrescribir con Vite
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5011";

// --- NUEVOS TIPOS DE DATOS (DTOs) ---
// Estos tipos coinciden con tus DTOs en C#
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
  imageUrl?: string; // No es un array de DTOs de imagen, es solo la primaria
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
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

export const EventApi = {
  // Llama al nuevo endpoint de la API con los filtros de búsqueda
  // Nota: si no pasas ningún parámetro, devolverá la primera página de la lista completa
  list: (
    from?: string,
    to?: string,
    postcode?: string,
    preferenceId?: string,
    q?: string,
    page: number = 1,
    pageSize: number = 10
  ) => {
    const params = new URLSearchParams();
    if (from) params.append("from", from);
    if (to) params.append("to", to);
    if (postcode) params.append("postcode", postcode);
    if (preferenceId) params.append("preferenceId", preferenceId);
    if (q) params.append("q", q);
    params.append("page", String(page));
    params.append("pageSize", String(pageSize));

    return request<PagedResult<EventListDto>>(`/api/events/discover?${params.toString()}`);
  },

  // Obtiene el detalle de un evento por su ID
  get: (id: string) => request<EventDetailDto>(`/api/events/${id}`),

  // Crea un evento, usando el DTO correcto
  create: (data: EventCreateDto) =>
    request<EventDetailDto>(`/api/events`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Actualiza un evento, usando el DTO correcto
  update: (id: string, data: EventUpdateDto) =>
    request<EventDetailDto>(`/api/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Borra un evento por su ID
  remove: (id: string) =>
    request<void>(`/api/events/${id}`, {
      method: "DELETE",
    }),
};