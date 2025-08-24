import { Logger, UsePipes, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";
import {
  JoinConversationDto,
  LeaveConversationDto,
  MessageReadDto,
  SendMessageDto,
  TypingDto,
} from "./dto/message.dto";

interface AuthenticatedSocket extends Socket {
  userId?: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

@WebSocketGateway({
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:3000",
    ],
    credentials: true,
  },
  namespace: "/chat",
})
@UsePipes(new ValidationPipe({ transform: true }))
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private connectedUsers = new Map<string, string[]>(); // userId -> socketIds[]
  private typingUsers = new Map<string, Set<string>>(); // bookingId -> Set<userId>

  constructor(
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,
    private readonly _chatService: ChatService
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token = this.extractTokenFromSocket(client);
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = await this._jwtService.verifyAsync(token, {
        secret: this._configService.get<string>("JWT_SECRET"),
      });

      client.userId = payload.sub;
      client.user = payload;

      // Registrar conexión
      const userSockets = this.connectedUsers.get(payload.sub) || [];
      userSockets.push(client.id);
      this.connectedUsers.set(payload.sub, userSockets);

      this.logger.log(`User ${payload.sub} connected with socket ${client.id}`);
    } catch (error) {
      this.logger.error("Error during connection", error);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      const userSockets = this.connectedUsers.get(client.userId) || [];
      const updatedSockets = userSockets.filter(id => id !== client.id);

      if (updatedSockets.length === 0) {
        this.connectedUsers.delete(client.userId);
        // Limpiar typing states para este usuario
        this.typingUsers.forEach((users, bookingId) => {
          users.delete(client.userId!);
          if (users.size === 0) {
            this.typingUsers.delete(bookingId);
          }
        });
      } else {
        this.connectedUsers.set(client.userId, updatedSockets);
      }

      this.logger.log(`User ${client.userId} disconnected socket ${client.id}`);
    }
  }

  @SubscribeMessage("conversation:join")
  async handleJoinConversation(
    @MessageBody() dto: JoinConversationDto,
    @ConnectedSocket() client: AuthenticatedSocket
  ) {
    if (!client.userId) return;

    try {
      const hasAccess = await this._chatService.validateBookingAccess(
        dto.bookingId,
        client.userId
      );
      if (!hasAccess) {
        client.emit("error", {
          message: "No tienes acceso a esta conversación",
        });
        return;
      }

      await client.join(`booking:${dto.bookingId}`);

      // Notificar presencia a otros usuarios
      client.to(`booking:${dto.bookingId}`).emit("user:joined", {
        userId: client.userId,
        bookingId: dto.bookingId,
      });

      this.logger.log(`User ${client.userId} joined booking ${dto.bookingId}`);
    } catch (error) {
      this.logger.error("Error joining conversation", error);
      client.emit("error", { message: "Error al unirse a la conversación" });
    }
  }

  @SubscribeMessage("conversation:leave")
  async handleLeaveConversation(
    @MessageBody() dto: LeaveConversationDto,
    @ConnectedSocket() client: AuthenticatedSocket
  ) {
    if (!client.userId) return;

    await client.leave(`booking:${dto.bookingId}`);

    // Limpiar typing state
    const typingInBooking = this.typingUsers.get(dto.bookingId);
    if (typingInBooking) {
      typingInBooking.delete(client.userId);
      if (typingInBooking.size === 0) {
        this.typingUsers.delete(dto.bookingId);
      }
    }

    // Notificar salida
    client.to(`booking:${dto.bookingId}`).emit("user:left", {
      userId: client.userId,
      bookingId: dto.bookingId,
    });

    this.logger.log(`User ${client.userId} left booking ${dto.bookingId}`);
  }

  @SubscribeMessage("message:send")
  async handleSendMessage(
    @MessageBody() dto: SendMessageDto,
    @ConnectedSocket() client: AuthenticatedSocket
  ) {
    if (!client.userId) return;

    try {
      const message = await this._chatService.createMessage(client.userId, dto);

      // Emitir mensaje a todos los participantes de la conversación
      this.server.to(`booking:${dto.bookingId}`).emit("message:new", {
        ...message,
        bookingId: dto.bookingId,
      });

      this.logger.log(
        `Message sent by ${client.userId} in booking ${dto.bookingId}`
      );
    } catch (error) {
      this.logger.error("Error sending message", error);
      client.emit("error", { message: "Error al enviar mensaje" });
    }
  }

  @SubscribeMessage("message:received")
  async handleMessageReceived(
    @MessageBody() dto: MessageReadDto,
    @ConnectedSocket() client: AuthenticatedSocket
  ) {
    if (!client.userId) return;

    try {
      await this._chatService.markAsDelivered(dto.messageId, client.userId);

      // Notificar al remitente
      this.server.emit("message:delivered", {
        messageId: dto.messageId,
        deliveredBy: client.userId,
      });
    } catch (error) {
      this.logger.error("Error marking message as received", error);
    }
  }

  @SubscribeMessage("message:read")
  async handleMessageRead(
    @MessageBody() dto: MessageReadDto,
    @ConnectedSocket() client: AuthenticatedSocket
  ) {
    if (!client.userId) return;

    try {
      await this._chatService.markAsRead(dto.messageId, client.userId);

      // Notificar al remitente
      this.server.emit("message:read", {
        messageId: dto.messageId,
        readBy: client.userId,
      });
    } catch (error) {
      this.logger.error("Error marking message as read", error);
    }
  }

  @SubscribeMessage("typing")
  handleTyping(
    @MessageBody() dto: TypingDto,
    @ConnectedSocket() client: AuthenticatedSocket
  ) {
    if (!client.userId) return;

    const typingInBooking = this.typingUsers.get(dto.bookingId) || new Set();

    if (dto.isTyping) {
      typingInBooking.add(client.userId);
    } else {
      typingInBooking.delete(client.userId);
    }

    if (typingInBooking.size > 0) {
      this.typingUsers.set(dto.bookingId, typingInBooking);
    } else {
      this.typingUsers.delete(dto.bookingId);
    }

    // Notificar a otros participantes (excepto al remitente)
    client.to(`booking:${dto.bookingId}`).emit("typing", {
      bookingId: dto.bookingId,
      userId: client.userId,
      isTyping: dto.isTyping,
    });
  }

  private extractTokenFromSocket(client: Socket): string | null {
    const authorization = client.handshake.headers.authorization;
    if (!authorization) return null;

    const [type, token] = authorization.split(" ");
    return type === "Bearer" ? token : null;
  }
}
