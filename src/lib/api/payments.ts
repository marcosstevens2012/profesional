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

/**
 * Request para confirmar un pago de MercadoPago
 */
export interface ConfirmPaymentRequest {
  paymentId: string;
  collectionId?: string;
  status: string;
  externalReference: string; // booking ID
  paymentType?: string;
  merchantOrderId?: string;
  preferenceId?: string;
}

/**
 * Response de confirmación de pago
 */
export interface ConfirmPaymentResponse {
  success: boolean;
  error?: string;
  booking?: {
    id: string;
    title: string;
    scheduledAt: string;
    professional: {
      name: string;
      slug: string;
    };
    client: {
      name: string;
    };
    payment: {
      id: string;
      amount: number;
      status: string;
      method: string;
    };
  };
}

/**
 * Respuesta del endpoint /payments/status
 */
export interface PaymentStatusResponse {
  success: boolean;
  data: {
    payment: {
      id: string;
      status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
      amount: string; // Viene como string desde el backend
      currency: string;
      paymentId: string | null;
      preferenceId: string;
      paidAt: string | null;
      createdAt: string;
    };
    booking: {
      id: string;
      scheduledAt: string;
      duration: number;
      status: string;
      jitsiRoom: string;
      meetingStatus: string;
      professional: {
        id: string;
        name: string;
        email: string;
      };
      client: {
        id: string;
        name: string;
        email: string;
      };
    };
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

  /**
   * Obtiene el estado de un pago usando payment_id y external_reference
   * @param paymentId - ID del pago de MercadoPago (payment_id o collection_id)
   * @param externalReference - ID del booking (external_reference)
   * @returns Estado completo del pago y booking
   */
  async getPaymentStatus(
    paymentId: string,
    externalReference?: string
  ): Promise<PaymentStatusResponse> {
    const params = new URLSearchParams();
    params.append("payment_id", paymentId);

    if (externalReference) {
      params.append("external_reference", externalReference);
    }

    const response = await apiClient.get<PaymentStatusResponse>(
      `/payments/status?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Confirma un pago de MercadoPago y actualiza el booking
   * @deprecated - Usar getPaymentStatus en su lugar, el backend maneja la confirmación automáticamente
   * @param data Datos del pago de MercadoPago
   * @returns Detalles del booking confirmado
   */
  async confirmPayment(
    data: ConfirmPaymentRequest
  ): Promise<ConfirmPaymentResponse> {
    try {
      const response = await apiClient.post<ConfirmPaymentResponse>(
        "/payments/mp/confirm",
        {
          paymentId: data.paymentId,
          collectionId: data.collectionId,
          status: data.status,
          externalReference: data.externalReference,
          paymentType: data.paymentType,
          merchantOrderId: data.merchantOrderId,
          preferenceId: data.preferenceId,
        }
      );

      return response.data;
    } catch (error) {
      console.error("❌ Error en confirmPayment:", error);
      throw error;
    }
  },
};
