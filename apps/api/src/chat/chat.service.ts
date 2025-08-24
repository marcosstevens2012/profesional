import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { SendMessageDto } from "./dto/message.dto";

@Injectable()
export class ChatService {
  constructor(private readonly _prisma: PrismaService) {}

  // Funciones para agregar logging cuando sea necesario
  // private log(message: string) {
  //   const logger = new Logger(ChatService.name);
  //   logger.log(message);
  // }

  async createMessage(userId: string, dto: SendMessageDto) {
    // Verificar que el usuario tiene acceso al booking
    const booking = await this._prisma.booking.findFirst({
      where: {
        id: dto.bookingId,
        OR: [{ clientId: userId }, { professional: { userId } }],
      },
      include: {
        client: true,
        professional: { include: { user: true } },
      },
    });

    if (!booking) {
      throw new ForbiddenException("No tienes acceso a esta conversación");
    }

    // Crear o buscar la conversación
    let conversation = await this._prisma.conversation.findUnique({
      where: { bookingId: dto.bookingId },
    });

    if (!conversation) {
      conversation = await this._prisma.conversation.create({
        data: { bookingId: dto.bookingId },
      });
    }

    // Crear el mensaje
    const message = await this._prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: userId,
        content: dto.content,
        type: dto.type,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                avatar: true,
              },
            },
          },
        },
        attachments: true,
      },
    });

    // Si hay adjuntos, crearlos
    if (dto.attachments?.length) {
      const attachments = await Promise.all(
        dto.attachments.map(attachment =>
          this._prisma.attachment.create({
            data: {
              messageId: message.id,
              key: attachment.key,
              filename: attachment.filename,
              mimeType: attachment.mimeType,
              size: attachment.size,
              uploadedBy: userId,
            },
          })
        )
      );

      // Actualizar el mensaje con los adjuntos
      return {
        ...message,
        attachments,
      };
    }

    return message;
  }

  async markAsDelivered(messageId: string, userId: string) {
    const message = await this._prisma.message.findFirst({
      where: {
        id: messageId,
        conversation: {
          booking: {
            OR: [{ clientId: userId }, { professional: { userId } }],
          },
        },
      },
    });

    if (!message) {
      throw new NotFoundException("Mensaje no encontrado");
    }

    await this._prisma.message.update({
      where: { id: messageId },
      data: { deliveredAt: new Date() },
    });
  }

  async markAsRead(messageId: string, userId: string) {
    const message = await this._prisma.message.findFirst({
      where: {
        id: messageId,
        conversation: {
          booking: {
            OR: [{ clientId: userId }, { professional: { userId } }],
          },
        },
      },
    });

    if (!message) {
      throw new NotFoundException("Mensaje no encontrado");
    }

    await this._prisma.message.update({
      where: { id: messageId },
      data: { readAt: new Date() },
    });
  }

  async getConversationMessages(
    bookingId: string,
    userId: string,
    page = 1,
    limit = 50
  ) {
    // Verificar acceso
    const booking = await this._prisma.booking.findFirst({
      where: {
        id: bookingId,
        OR: [{ clientId: userId }, { professional: { userId } }],
      },
    });

    if (!booking) {
      throw new ForbiddenException("No tienes acceso a esta conversación");
    }

    const conversation = await this._prisma.conversation.findUnique({
      where: { bookingId },
    });

    if (!conversation) {
      return { messages: [], total: 0, page, limit };
    }

    const [messages, total] = await Promise.all([
      this._prisma.message.findMany({
        where: { conversationId: conversation.id },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              profile: {
                select: {
                  avatar: true,
                },
              },
            },
          },
          attachments: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this._prisma.message.count({
        where: { conversationId: conversation.id },
      }),
    ]);

    return {
      messages: messages.reverse(), // Más recientes al final
      total,
      page,
      limit,
    };
  }

  async validateBookingAccess(
    bookingId: string,
    userId: string
  ): Promise<boolean> {
    const booking = await this._prisma.booking.findFirst({
      where: {
        id: bookingId,
        OR: [{ clientId: userId }, { professional: { userId } }],
      },
    });

    return !!booking;
  }
}
