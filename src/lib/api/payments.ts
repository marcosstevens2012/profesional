import { apiClient } from "./client";

export interface ConsultationPaymentRequest {
  bookingId: string;
  customerId: string;
  professionalId: string;
  professionalMPUserId: number;
  amount: number;
  title: string;
  description?: string;
  payerEmail?: string;
}

export interface MercadoPagoPreference {
  init_point: string;
  id: string;
}

export interface MercadoPagoPreferenceResponse {
  preference: MercadoPagoPreference;
}

export const paymentsAPI = {
  async createConsultationPayment(
    data: ConsultationPaymentRequest
  ): Promise<MercadoPagoPreference> {
    try {
      const response = await apiClient.post<MercadoPagoPreferenceResponse>(
        "/payments/mp/preference",
        {
          bookingId: data.bookingId,
          customerId: data.customerId,
          professionalId: data.professionalId,
          professionalMPUserId: data.professionalMPUserId,
          amount: data.amount,
          title: data.title,
          description: data.description,
          payerEmail: data.payerEmail,
        }
      );

      // Extraer el objeto preference de la respuesta
      if (response.data.preference) {
        return response.data.preference;
      }

      // Si no está en preference, tal vez esté directamente en data
      if ("init_point" in response.data) {
        return response.data as unknown as MercadoPagoPreference;
      }

      throw new Error("No se pudo obtener init_point de la respuesta");
    } catch (error) {
      console.error("❌ Error en createConsultationPayment:", error);
      throw error;
    }
  },

  async getPaymentStatus(paymentId: string) {
    const response = await apiClient.get(`/payments/payment/${paymentId}`);
    return response.data;
  },
};
