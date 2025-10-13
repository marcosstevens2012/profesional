import { apiClient } from "./client";

/**
 * Request para crear una preferencia de pago simple
 * Crea una booking con pago integrado
 */
export interface ConsultationPaymentRequest {
  clientId: string; // ID del usuario cliente
  professionalId: string; // ID del perfil profesional
  scheduledAt: string; // Fecha/hora en formato ISO 8601
  price: number; // Precio de la consulta
  title: string; // Título de la consulta
  professionalSlug: string; // Slug del profesional
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
  booking?: {
    id: string;
    title: string;
    scheduledAt: string;
  };
}

export const paymentsAPI = {
  /**
   * Crea una preferencia de pago simple (booking + pago integrado)
   * @param data Datos de la consulta y pago
   * @returns Preferencia de MercadoPago con init_point para redirigir
   */
  async createConsultationPayment(
    data: ConsultationPaymentRequest
  ): Promise<MercadoPagoPreferenceResponse> {
    try {
      const response = await apiClient.post<MercadoPagoPreferenceResponse>(
        "/payments/mp/simple-preference",
        {
          clientId: data.clientId,
          professionalId: data.professionalId,
          scheduledAt: data.scheduledAt,
          price: data.price,
          title: data.title,
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
