import {
  PaginatedResponse,
  ProfessionalProfile,
  SearchFilters,
} from "@profesional/contracts";

// Tipo local para sugerencias de búsqueda
export interface SearchSuggestion {
  id: string;
  text: string;
  type: "professional" | "service" | "location";
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

class SearchAPI {
  private baseUrl = `${API_BASE_URL}/search`;

  async searchProfessionals(
    filters: SearchFilters
  ): Promise<PaginatedResponse<ProfessionalProfile>> {
    const searchParams = new URLSearchParams();

    if (filters.query) searchParams.set("query", filters.query);
    if (filters.categoryId) searchParams.set("category", filters.categoryId);
    if (filters.locationId) searchParams.set("location", filters.locationId);
    if (filters.minRate)
      searchParams.set("minRate", filters.minRate.toString());
    if (filters.maxRate)
      searchParams.set("maxRate", filters.maxRate.toString());
    if (filters.rating) searchParams.set("rating", filters.rating.toString());
    if (filters.isVerified !== undefined)
      searchParams.set("isVerified", filters.isVerified.toString());
    if (filters.languages && filters.languages.length > 0)
      searchParams.set("languages", filters.languages.join(","));
    if (filters.sortBy) searchParams.set("sortBy", filters.sortBy);
    if (filters.page) searchParams.set("page", filters.page.toString());
    if (filters.limit) searchParams.set("limit", filters.limit.toString());

    // Use profiles endpoint instead of search for better compatibility
    const response = await fetch(
      `${API_BASE_URL}/profiles?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error en la búsqueda");
    }

    const result = await response.json();

    // Return mock data if no real data is available
    if (!result || !result.data) {
      return {
        success: true,
        data: [],
        pagination: {
          page: filters.page || 1,
          limit: filters.limit || 20,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };
    }

    return result;
  }

  async getSuggestions(query: string): Promise<SearchSuggestion[]> {
    const searchParams = new URLSearchParams();
    searchParams.set("query", query);

    const response = await fetch(
      `${this.baseUrl}/suggestions?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener sugerencias");
    }

    return response.json();
  }
}

export const searchAPI = new SearchAPI();
