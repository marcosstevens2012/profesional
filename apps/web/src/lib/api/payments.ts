import { apiClient } from "./client";

export interface ConsultationPaymentRequest {
  professionalId: number;
  professionalName: string;
  amount: number;
}

export interface MercadoPagoPreference {
  init_point: string;
  id: string;
}

export const paymentsAPI = {
  async createConsultationPayment(
    data: ConsultationPaymentRequest
  ): Promise<MercadoPagoPreference> {
    const response = await apiClient.post<MercadoPagoPreference>(
      "/payments/mp/preference",
      {
        title: `Consulta con ${data.professionalName}`,
        amount: data.amount,
        professionalId: data.professionalId,
        external_reference: `consultation_${data.professionalId}_${Date.now()}`,
      }
    );
    return response.data;
  },

  async getPaymentStatus(paymentId: string) {
    const response = await apiClient.get(`/payments/payment/${paymentId}`);
    return response.data;
  },
};
