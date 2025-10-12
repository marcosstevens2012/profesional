import { apiClient } from "./client";

export interface ConsultationPaymentRequest {
  title: string;
  amount: number;
  professionalSlug: string;
}

export interface MercadoPagoPreference {
  init_point: string;
  sandbox_init_point: string;
  preference_id: string;
  external_reference: string;
}

export interface MercadoPagoPreferenceResponse {
  success: boolean;
  preference_id: string;
  init_point: string;
  sandbox_init_point: string;
  external_reference: string;
  auto_return_enabled: boolean;
  back_urls?: {
    success: string;
    failure: string;
    pending: string;
  };
  metadata?: {
    amount: number;
    professional_slug: string;
    is_sandbox: boolean;
  };
}

export const paymentsAPI = {
  async createConsultationPayment(
    data: ConsultationPaymentRequest
  ): Promise<MercadoPagoPreferenceResponse> {
    try {
      const response = await apiClient.post<MercadoPagoPreferenceResponse>(
        "/payments/mp/preference",
        {
          title: data.title,
          amount: data.amount,
          professionalSlug: data.professionalSlug,
        }
      );

      return response.data;
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
