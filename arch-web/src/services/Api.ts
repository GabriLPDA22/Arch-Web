// src/services/api.ts
// Base URL of your API — override via Vite env.
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5011";

export type EventDto = {
  id?: number | string;
  title: string;
  description?: string;
  startDateUtc: string;    // ISO string (UTC)
  endDateUtc?: string;     // ISO string (UTC)
  location?: string;
  capacity?: number | null;
  category?: string;
  isPublic?: boolean;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
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
  list: () => request<EventDto[]>("/api/events"),
  create: (data: EventDto) =>
    request<EventDto>("/api/events", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number | string, data: EventDto) =>
    request<EventDto>(`/api/events/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id: number | string) =>
    request<void>(`/api/events/${id}`, { method: "DELETE" }),
};
