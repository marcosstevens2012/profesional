import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import crypto from "crypto";
import { firstValueFrom } from "rxjs";

interface MercadoPagoItem {
  title: string;
  quantity: number;
  unit_price: number;
  category_id?: string;
  description?: string;
}

interface MercadoPagoMarketplaceSplit {
  amount: number;
  fee_amount: number;
  collector: {
    id: number; // User ID del vendedor
  };
}

interface MercadoPagoBackUrls {
  success: string;
  failure: string;
  pending: string;
}

interface MercadoPagoPaymentMethods {
  excluded_payment_methods?: Array<{ id: string }>;
  excluded_payment_types?: Array<{ id: string }>;
  installments?: number;
  default_installments?: number;
}

interface MercadoPagoPreference {
  items: MercadoPagoItem[];
  external_reference?: string;
  marketplace?: string;
  marketplace_fee?: number;
  split_payments?: MercadoPagoMarketplaceSplit[];
  back_urls?: MercadoPagoBackUrls;
  notification_url?: string;
  payment_methods?: MercadoPagoPaymentMethods;
  expires?: boolean;
  expiration_date_from?: string;
  expiration_date_to?: string;
}

@Injectable()
export class MercadoPagoService {
  private readonly logger = new Logger(MercadoPagoService.name);
  private readonly baseUrl = "https://api.mercadopago.com";
  private readonly accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  private readonly webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;

  constructor(private readonly _httpService: HttpService) {}

  async createPreference(preference: MercadoPagoPreference) {
    this.logger.debug("🔥 Creating MP marketplace preference", {
      external_reference: preference.external_reference,
      marketplace_fee: preference.marketplace_fee,
      split_payments: preference.split_payments?.length || 0,
    });

    try {
      const response = await firstValueFrom(
        this._httpService.post(
          `${this.baseUrl}/checkout/preferences`,
          preference,
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
              "Content-Type": "application/json",
              "X-Idempotency-Key": `${
                preference.external_reference
              }-${Date.now()}`, // Prevenir duplicados
            },
          }
        )
      );

      this.logger.log("✅ MP preference created successfully", {
        preference_id: response.data.id,
        collector_id: response.data.collector_id,
        external_reference: response.data.external_reference,
      });

      return response.data;
    } catch (error: any) {
      this.logger.error("❌ Error creating MP preference", {
        error: error?.response?.data || error?.message || error,
        status: error?.response?.status,
        preference: preference.external_reference,
      });
      throw error;
    }
  }

  async getPayment(paymentId: string) {
    this.logger.debug(`🔍 Getting MP payment ${paymentId}`);

    try {
      const response = await firstValueFrom(
        this._httpService.get(`${this.baseUrl}/v1/payments/${paymentId}`, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        })
      );

      this.logger.log("✅ MP payment retrieved", {
        payment_id: response.data.id,
        status: response.data.status,
        status_detail: response.data.status_detail,
        transaction_amount: response.data.transaction_amount,
        collector_id: response.data.collector_id,
      });

      return response.data;
    } catch (error: any) {
      this.logger.error(`❌ Error getting MP payment ${paymentId}`, {
        error: error?.response?.data || error?.message || error,
        status: error?.response?.status,
      });
      throw error;
    }
  }

  async getPreference(preferenceId: string) {
    this.logger.debug(`🔍 Getting MP preference ${preferenceId}`);

    try {
      const response = await firstValueFrom(
        this._httpService.get(
          `${this.baseUrl}/checkout/preferences/${preferenceId}`,
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
          }
        )
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        `❌ Error getting MP preference ${preferenceId}`,
        error
      );
      throw error;
    }
  }

  async getMerchantOrder(merchantOrderId: string) {
    this.logger.debug(`🔍 Getting MP merchant order ${merchantOrderId}`);

    try {
      const response = await firstValueFrom(
        this._httpService.get(
          `${this.baseUrl}/merchant_orders/${merchantOrderId}`,
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
          }
        )
      );

      this.logger.log("✅ MP merchant order retrieved", {
        order_id: response.data.id,
        preference_id: response.data.preference_id,
        payments: response.data.payments?.length || 0,
        order_status: response.data.order_status,
      });

      return response.data;
    } catch (error) {
      this.logger.error(
        `❌ Error getting MP merchant order ${merchantOrderId}`,
        error
      );
      throw error;
    }
  }

  async verifyWebhookSignature(
    payload: string,
    signature: string
  ): Promise<boolean> {
    if (!this.webhookSecret || !signature) {
      this.logger.warn(
        "⚠️ Missing webhook secret or signature for verification"
      );
      return false;
    }

    try {
      const expectedSignature = crypto
        .createHmac("sha256", this.webhookSecret)
        .update(payload)
        .digest("hex");

      const isValid = signature === `sha256=${expectedSignature}`;

      this.logger.debug("🔐 Webhook signature verification", {
        provided_signature: signature,
        expected_signature: `sha256=${expectedSignature}`,
        is_valid: isValid,
      });

      return isValid;
    } catch (error) {
      this.logger.error("❌ Error verifying webhook signature", error);
      return false;
    }
  }

  /**
   * Procesa una notificación de webhook según su tipo
   */
  async processWebhookNotification(notificationData: any) {
    this.logger.log("🔔 Processing MP webhook notification", {
      id: notificationData.id,
      type: notificationData.type,
      action: notificationData.action,
    });

    switch (notificationData.type) {
      case "payment":
        return await this.getPayment(notificationData.data.id);

      case "merchant_order":
        return await this.getMerchantOrder(notificationData.data.id);

      case "preference":
        return await this.getPreference(notificationData.data.id);

      default:
        this.logger.warn(
          `⚠️ Unknown webhook notification type: ${notificationData.type}`
        );
        return null;
    }
  }
}
