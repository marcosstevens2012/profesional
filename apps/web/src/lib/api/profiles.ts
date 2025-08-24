import {
  CreateProfessionalProfileDTO,
  PaginatedResponse,
  ProfessionalProfile,
  UpdateProfessionalProfileDTO,
} from "@profesional/contracts";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

class ProfilesAPI {
  private baseUrl = `${API_BASE_URL}/profiles`;

  async getAllProfiles(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<ProfessionalProfile>> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.search) searchParams.set("search", params.search);

    const response = await fetch(`${this.baseUrl}?${searchParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener perfiles");
    }

    return response.json();
  }

  async getProfileById(id: string): Promise<ProfessionalProfile> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Perfil profesional no encontrado");
      }
      const error = await response.json();
      throw new Error(error.message || "Error al obtener el perfil");
    }

    return response.json();
  }

  async getProfileBySlug(slug: string): Promise<ProfessionalProfile> {
    const response = await fetch(`${this.baseUrl}/slug/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Perfil profesional no encontrado");
      }
      const error = await response.json();
      throw new Error(error.message || "Error al obtener el perfil");
    }

    return response.json();
  }

  async createProfile(
    data: CreateProfessionalProfileDTO,
    token: string
  ): Promise<ProfessionalProfile> {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al crear el perfil");
    }

    return response.json();
  }

  async updateProfile(
    id: string,
    data: UpdateProfessionalProfileDTO,
    token: string
  ): Promise<ProfessionalProfile> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al actualizar el perfil");
    }

    return response.json();
  }

  async deleteProfile(id: string, token: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al eliminar el perfil");
    }
  }
}

export const profilesAPI = new ProfilesAPI();
