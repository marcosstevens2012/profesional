import { ServiceCategory } from "@profesional/contracts";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

class ServicesAPI {
  private baseUrl = `${API_BASE_URL}/services`;

  async getCategories(): Promise<ServiceCategory[]> {
    const response = await fetch(`${this.baseUrl}/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener categorías");
    }

    return response.json();
  }
}

export const servicesAPI = new ServicesAPI();
