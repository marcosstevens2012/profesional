import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { ChatService } from "./chat.service";

@ApiTags("Chat")
@ApiBearerAuth()
@Controller("chat")
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly _chatService: ChatService) {}

  @Get("conversations/:bookingId/messages")
  @ApiOperation({ summary: "Obtener mensajes de una conversación" })
  @ApiResponse({
    status: 200,
    description: "Mensajes obtenidos exitosamente",
  })
  @ApiResponse({ status: 403, description: "Sin acceso a la conversación" })
  async getConversationMessages(
    @Request() req: any,
    @Param("bookingId") bookingId: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 50;

    return this._chatService.getConversationMessages(
      bookingId,
      req.user.sub,
      pageNum,
      limitNum
    );
  }
}
