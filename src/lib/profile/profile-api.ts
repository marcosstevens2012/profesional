import { User } from "../contracts";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

export interface Profile {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
}

class ProfileAPI {
  private baseUrl = `${API_BASE_URL}/profiles`;

  async getMyProfile(token: string): Promise<Profile> {
    const response = await fetch(`${this.baseUrl}/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error obteniendo perfil");
    }

    return response.json();
  }

  async updateProfile(
    token: string,
    data: UpdateProfileRequest
  ): Promise<Profile> {
    const response = await fetch(`${this.baseUrl}/me`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error actualizando perfil");
    }

    return response.json();
  }

  async getCurrentUser(token: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error obteniendo usuario");
    }

    const result = await response.json();
    return result.user;
  }
}

export const profileAPI = new ProfileAPI();
