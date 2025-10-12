import { apiClient } from "@/lib/api/client";

export interface GlobalConfig {
  key: string;
  value: any;
  description?: string;
}

export interface ConsultationPriceConfig {
  amount: number;
  currency: string;
}

export const configAPI = {
  async getConsultationPrice(): Promise<ConsultationPriceConfig> {
    const response = await apiClient.get<GlobalConfig>(
      "/config/consultation_price"
    );
    return response.data.value;
  },

  async getAllConfigs(): Promise<GlobalConfig[]> {
    const response = await apiClient.get<GlobalConfig[]>("/config");
    return response.data;
  },
};
