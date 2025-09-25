// services/PreferencesService.ts

export interface PreferenceDto {
  preferenceId: string;
  name: string;
}

export interface CreatePreferenceDto {
  name: string;
}

export interface UpdatePreferenceDto {
  name: string;
}

export class PreferencesService {
  private static readonly BASE_URL = '/api/preferences';

  /**
   * Obtiene todas las preferencias disponibles
   */
  static async getAll(): Promise<PreferenceDto[]> {
    const response = await fetch(this.BASE_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch preferences: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Obtiene una preferencia por ID
   */
  static async getById(id: string): Promise<PreferenceDto> {
    const response = await fetch(`${this.BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch preference: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Crea una nueva preferencia
   */
  static async create(dto: CreatePreferenceDto): Promise<PreferenceDto> {
    const response = await fetch(this.BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    });
    if (!response.ok) {
      throw new Error(`Failed to create preference: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Actualiza una preferencia existente
   */
  static async update(id: string, dto: UpdatePreferenceDto): Promise<void> {
    const response = await fetch(`${this.BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    });
    if (!response.ok) {
      throw new Error(`Failed to update preference: ${response.statusText}`);
    }
  }

  /**
   * Elimina una preferencia
   */
  static async delete(id: string): Promise<void> {
    const response = await fetch(`${this.BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete preference: ${response.statusText}`);
    }
  }
}
