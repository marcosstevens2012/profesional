import {
  CreateProfessionalProfileDTO,
  PaginatedResponse,
  ProfessionalProfile,
  Profile,
  UpdateProfessionalProfileDTO,
  UpdateProfileDTO,
} from "../contracts";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Types for new endpoints
export interface AvailabilitySlot {
  id: string;
  type: "RECURRING" | "ONE_TIME";
  dayOfWeek?:
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY";
  startTime?: string;
  endTime?: string;
  specificDate?: string;
  specificStart?: string;
  specificEnd?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAvailabilitySlotDTO {
  type: "RECURRING" | "ONE_TIME";
  dayOfWeek?: string;
  startTime?: string;
  endTime?: string;
  specificDate?: string;
  specificStart?: string;
  specificEnd?: string;
  isActive?: boolean;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  response?: string;
  clientName: string;
  createdAt: Date;
  hasResponse: boolean;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  recentReviews: Review[];
}

export interface Analytics {
  bookingStats: {
    totalBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    pendingBookings: number;
    completionRate: number;
    averageSessionDuration: number;
  };
  revenueStats: {
    totalRevenue: number;
    revenueThisMonth: number;
    revenueLastMonth: number;
    averageSessionValue: number;
  };
  profileStats: {
    profileViews: number;
    profileViewsThisMonth: number;
    conversionRate: number;
    averageRating: number;
    totalReviews: number;
  };
}

export interface ActiveStatusResponse {
  isActive: boolean;
}

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

  // Get my profile (returns basic Profile, not ProfessionalProfile)
  async getMyProfile(token: string): Promise<Profile> {
    const response = await fetch(`${this.baseUrl}/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener tu perfil");
    }

    return response.json();
  }

  // Update my profile
  async updateMyProfile(
    data: UpdateProfileDTO,
    token: string
  ): Promise<Profile> {
    const response = await fetch(`${this.baseUrl}/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al actualizar tu perfil");
    }

    return response.json();
  }

  // Toggle active status
  async toggleActiveStatus(token: string): Promise<ActiveStatusResponse> {
    const response = await fetch(`${this.baseUrl}/me/toggle-active`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al cambiar el estado");
    }

    return response.json();
  }

  // Get active status
  async getActiveStatus(token: string): Promise<ActiveStatusResponse> {
    const response = await fetch(`${this.baseUrl}/me/active-status`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener el estado");
    }

    return response.json();
  }

  // === AVAILABILITY ENDPOINTS ===

  async createAvailabilitySlot(
    data: CreateAvailabilitySlotDTO,
    token: string
  ): Promise<AvailabilitySlot> {
    const response = await fetch(`${this.baseUrl}/me/availability`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al crear disponibilidad");
    }

    return response.json();
  }

  async getMyAvailability(
    token: string,
    params?: {
      type?: "RECURRING" | "ONE_TIME";
      dayOfWeek?: string;
      isActive?: boolean;
      fromDate?: string;
      toDate?: string;
    }
  ): Promise<AvailabilitySlot[]> {
    const searchParams = new URLSearchParams();
    if (params?.type) searchParams.set("type", params.type);
    if (params?.dayOfWeek) searchParams.set("dayOfWeek", params.dayOfWeek);
    if (params?.isActive !== undefined)
      searchParams.set("isActive", params.isActive.toString());
    if (params?.fromDate) searchParams.set("fromDate", params.fromDate);
    if (params?.toDate) searchParams.set("toDate", params.toDate);

    const response = await fetch(
      `${this.baseUrl}/me/availability?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener disponibilidad");
    }

    return response.json();
  }

  async getProfessionalAvailability(
    professionalId: string,
    params?: {
      type?: "RECURRING" | "ONE_TIME";
      dayOfWeek?: string;
      isActive?: boolean;
      fromDate?: string;
      toDate?: string;
    }
  ): Promise<AvailabilitySlot[]> {
    const searchParams = new URLSearchParams();
    if (params?.type) searchParams.set("type", params.type);
    if (params?.dayOfWeek) searchParams.set("dayOfWeek", params.dayOfWeek);
    if (params?.isActive !== undefined)
      searchParams.set("isActive", params.isActive.toString());
    if (params?.fromDate) searchParams.set("fromDate", params.fromDate);
    if (params?.toDate) searchParams.set("toDate", params.toDate);

    const response = await fetch(
      `${this.baseUrl}/${professionalId}/availability?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener disponibilidad");
    }

    return response.json();
  }

  async updateAvailabilitySlot(
    slotId: string,
    data: Partial<CreateAvailabilitySlotDTO>,
    token: string
  ): Promise<AvailabilitySlot> {
    const response = await fetch(`${this.baseUrl}/me/availability/${slotId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al actualizar disponibilidad");
    }

    return response.json();
  }

  async deleteAvailabilitySlot(slotId: string, token: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/me/availability/${slotId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al eliminar disponibilidad");
    }
  }

  // === REVIEWS ENDPOINTS ===

  async getMyReviews(
    token: string,
    params?: {
      page?: number;
      limit?: number;
      rating?: number;
      hasResponse?: boolean;
      orderBy?: "createdAt" | "rating";
      orderDirection?: "asc" | "desc";
    }
  ): Promise<PaginatedResponse<Review>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.rating) searchParams.set("rating", params.rating.toString());
    if (params?.hasResponse !== undefined)
      searchParams.set("hasResponse", params.hasResponse.toString());
    if (params?.orderBy) searchParams.set("orderBy", params.orderBy);
    if (params?.orderDirection)
      searchParams.set("orderDirection", params.orderDirection);

    const response = await fetch(
      `${this.baseUrl}/me/reviews?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener reseñas");
    }

    return response.json();
  }

  async getMyReviewStats(token: string): Promise<ReviewStats> {
    const response = await fetch(`${this.baseUrl}/me/reviews/stats`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener estadísticas");
    }

    return response.json();
  }

  async respondToReview(
    reviewId: string,
    response: string,
    token: string
  ): Promise<Review> {
    const res = await fetch(`${this.baseUrl}/me/reviews/${reviewId}/respond`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ response }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Error al responder reseña");
    }

    return res.json();
  }

  async getProfessionalReviews(
    professionalId: string,
    params?: {
      page?: number;
      limit?: number;
      rating?: number;
      orderBy?: "createdAt" | "rating";
      orderDirection?: "asc" | "desc";
    }
  ): Promise<PaginatedResponse<Review>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.rating) searchParams.set("rating", params.rating.toString());
    if (params?.orderBy) searchParams.set("orderBy", params.orderBy);
    if (params?.orderDirection)
      searchParams.set("orderDirection", params.orderDirection);

    const response = await fetch(
      `${this.baseUrl}/${professionalId}/reviews?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener reseñas");
    }

    return response.json();
  }

  // === ANALYTICS ENDPOINTS ===

  async getAnalytics(
    token: string,
    params?: {
      fromDate?: string;
      toDate?: string;
      period?: "day" | "week" | "month" | "year";
    }
  ): Promise<Analytics> {
    const searchParams = new URLSearchParams();
    if (params?.fromDate) searchParams.set("fromDate", params.fromDate);
    if (params?.toDate) searchParams.set("toDate", params.toDate);
    if (params?.period) searchParams.set("period", params.period);

    const response = await fetch(
      `${this.baseUrl}/me/analytics?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener analíticas");
    }

    return response.json();
  }

  async getBookingStats(token: string): Promise<Analytics["bookingStats"]> {
    const response = await fetch(`${this.baseUrl}/me/analytics/bookings`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || "Error al obtener estadísticas de reservas"
      );
    }

    return response.json();
  }

  async getRevenueStats(token: string): Promise<Analytics["revenueStats"]> {
    const response = await fetch(`${this.baseUrl}/me/analytics/revenue`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || "Error al obtener estadísticas de ingresos"
      );
    }

    return response.json();
  }

  async getProfileStats(token: string): Promise<Analytics["profileStats"]> {
    const response = await fetch(`${this.baseUrl}/me/analytics/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || "Error al obtener estadísticas del perfil"
      );
    }

    return response.json();
  }
}

export const profilesAPI = new ProfilesAPI();
