import { Injectable } from "@nestjs/common";
import { ThrottlerGuard } from "@nestjs/throttler";

@Injectable()
export class MessagesThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Usar el userId del JWT para trackear rate limits por usuario
    return req.user?.sub || req.ip;
  }
}
