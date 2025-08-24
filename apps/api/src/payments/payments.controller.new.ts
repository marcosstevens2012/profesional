import { Body, Controller, Get, Logger, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { MercadoPagoService } from "./mercadopago.service";
import { PaymentsService } from "./payments.service";

@ApiTags("payments")
@Controller("payments")
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(
    private readonly _paymentsService: PaymentsService,
    private readonly _mercadoPagoService: MercadoPagoService
  ) {}

  // ===== RUTAS ESPECÍFICAS PRIMERO =====

  @Post("mp/preference")
  async createMPPreference(@Body() preferenceDto: any) {
    this.logger.log("🔥 Creating MP marketplace preference");

    try {
      const preference = await this._mercadoPagoService.createPreference({
        items: [
          {
            title: preferenceDto.title || "Sesión con Profesional",
            quantity: 1,
            unit_price: preferenceDto.amount || 1000,
          },
        ],
        external_reference: `booking-${Date.now()}`,
      });

      this.logger.log("✅ MP preference created successfully", {
        id: preference.id,
      });

      return {
        success: true,
        data: {
          id: preference.id,
          init_point: preference.init_point,
          sandbox_init_point: preference.sandbox_init_point,
        },
      };
    } catch (error) {
      this.logger.error("❌ Error creating MP preference", error);
      return {
        success: false,
        message: "Error creando preferencia de pago",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  @Post("webhook")
  async handleWebhook(@Body() webhookData: any) {
    this.logger.log("📨 Received MP webhook", { type: webhookData.type });

    try {
      await this._paymentsService.handleWebhook(webhookData, "");
      return { status: "ok", processed: true };
    } catch (error) {
      this.logger.error("❌ Error processing webhook", error);
      return {
        status: "error",
        processed: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  @Post("test-cards")
  async testWithCards(@Body() cardDto: any) {
    this.logger.log("🧪 Testing payment with test cards");

    const testCards = [
      {
        number: "5031755734530604",
        cvv: "123",
        exp: "11/30",
        status: "approved",
      },
      {
        number: "4013540682746260",
        cvv: "123",
        exp: "11/30",
        status: "rejected",
      },
      {
        number: "5508050001234567",
        cvv: "123",
        exp: "11/30",
        status: "pending",
      },
    ];

    return {
      success: true,
      message: "Test cards information",
      data: {
        cards: testCards,
        selectedCard: cardDto.cardNumber || testCards[0].number,
        amount: cardDto.amount || 1000,
      },
    };
  }

  // ===== RUTAS PARAMÉTRICAS AL FINAL =====

  @Get("payment/:id")
  async getPayment(@Param("id") id: string) {
    this.logger.log(`Getting payment ${id}`);

    try {
      const payment = await this._paymentsService.getPayment(id);
      return {
        success: true,
        data: payment,
      };
    } catch (error) {
      this.logger.error(`Error getting payment ${id}`, error);
      return {
        success: false,
        message: "Payment not found",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
