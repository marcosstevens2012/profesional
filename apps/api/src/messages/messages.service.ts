import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { PrismaService } from "../database/prisma.service";
import { StorageProvider } from "../storage/storage.provider";
import {
  SignedDownloadRequestDto,
  UploadTokenRequestDto,
} from "./dto/attachment.dto";

// Lista blanca de tipos MIME permitidos
const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "application/pdf",
  "text/plain",
];

// Lista negra de extensiones/tipos peligrosos
const DANGEROUS_EXTENSIONS = [
  ".exe",
  ".bat",
  ".cmd",
  ".com",
  ".scr",
  ".pif",
  ".msi",
  ".sh",
  ".bash",
  ".zsh",
  ".fish",
  ".ps1",
  ".vbs",
  ".js",
  ".jar",
];

const DANGEROUS_MIME_TYPES = [
  "application/x-msdownload",
  "application/x-ms-dos-executable",
  "application/x-executable",
  "application/x-shellscript",
  "text/javascript",
  "application/javascript",
];

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(
    @Inject("STORAGE_PROVIDER")
    private readonly _storageProvider: StorageProvider,
    private readonly _prisma: PrismaService
  ) {}

  async generateUploadToken(userId: string, dto: UploadTokenRequestDto) {
    // Verificar acceso al booking
    const booking = await this._prisma.booking.findFirst({
      where: {
        id: dto.bookingId,
        OR: [{ clientId: userId }, { professional: { userId } }],
      },
    });

    if (!booking) {
      throw new ForbiddenException("No tienes acceso a esta conversación");
    }

    // Validar tipo MIME
    if (!ALLOWED_MIME_TYPES.includes(dto.contentType)) {
      throw new BadRequestException("Tipo de archivo no permitido");
    }

    // Validar que no sea un archivo peligroso
    const fileExtension = this.getFileExtension(dto.filename);
    if (
      DANGEROUS_EXTENSIONS.some(ext =>
        fileExtension.endsWith(ext.toLowerCase())
      )
    ) {
      throw new BadRequestException(
        "Tipo de archivo no permitido por seguridad"
      );
    }

    if (DANGEROUS_MIME_TYPES.includes(dto.contentType)) {
      throw new BadRequestException(
        "Tipo de archivo no permitido por seguridad"
      );
    }

    // Generar clave única para el archivo
    const key = this.generateStorageKey(dto.bookingId, dto.filename);

    try {
      const uploadToken = await this._storageProvider.generateUploadToken(key, {
        contentType: dto.contentType,
        maxSize: dto.size,
      });

      // Registrar la intención de upload para auditoría
      await this.logAuditEvent(userId, dto.bookingId, "upload_requested", {
        key,
        filename: dto.filename,
        contentType: dto.contentType,
        size: dto.size,
      });

      return {
        ...uploadToken,
        key,
      };
    } catch (error) {
      this.logger.error("Error generating upload token", {
        error,
        userId,
        bookingId: dto.bookingId,
      });
      throw new BadRequestException("Error al generar token de subida");
    }
  }

  async generateSignedDownloadUrl(
    userId: string,
    dto: SignedDownloadRequestDto
  ) {
    // Buscar el adjunto y verificar acceso
    const attachment = await this._prisma.attachment.findFirst({
      where: {
        key: dto.key,
        message: {
          conversation: {
            booking: {
              OR: [{ clientId: userId }, { professional: { userId } }],
            },
          },
        },
      },
      include: {
        message: {
          include: {
            conversation: {
              include: {
                booking: true,
              },
            },
          },
        },
      },
    });

    if (!attachment) {
      throw new NotFoundException("Archivo no encontrado o sin acceso");
    }

    try {
      // Si el provider es público, devolver URL pública
      if (this._storageProvider.isPublic) {
        const url = this._storageProvider.getPublicUrl(dto.key);
        return {
          url,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 año
        };
      }

      // Para providers privados, generar URL firmada
      const signedUrl = await this._storageProvider.generateSignedDownloadUrl(
        dto.key,
        {
          filename: dto.filename || attachment.filename,
        }
      );

      // Registrar la descarga para auditoría
      await this.logAuditEvent(
        userId,
        attachment.message.conversation.booking.id,
        "download_requested",
        {
          key: dto.key,
          filename: attachment.filename,
        }
      );

      return signedUrl;
    } catch (error) {
      this.logger.error("Error generating download URL", {
        error,
        userId,
        key: dto.key,
      });
      throw new BadRequestException("Error al generar URL de descarga");
    }
  }

  async getAttachmentMetadata(userId: string, key: string) {
    const attachment = await this._prisma.attachment.findFirst({
      where: {
        key,
        message: {
          conversation: {
            booking: {
              OR: [{ clientId: userId }, { professional: { userId } }],
            },
          },
        },
      },
    });

    if (!attachment) {
      throw new NotFoundException("Archivo no encontrado o sin acceso");
    }

    return {
      key: attachment.key,
      filename: attachment.filename,
      mimeType: attachment.mimeType,
      size: attachment.size,
      uploadedAt: attachment.uploadedAt,
    };
  }

  private generateStorageKey(bookingId: string, filename: string): string {
    const timestamp = Date.now();
    const uuid = uuidv4();
    const extension = this.getFileExtension(filename);

    return `attachments/${bookingId}/${timestamp}-${uuid}${extension}`;
  }

  private getFileExtension(filename: string): string {
    const lastDotIndex = filename.lastIndexOf(".");
    return lastDotIndex >= 0 ? filename.substring(lastDotIndex) : "";
  }

  private async logAuditEvent(
    userId: string,
    bookingId: string,
    action: string,
    metadata: Record<string, any>
  ) {
    try {
      // Por ahora solo log, pero se podría guardar en DB para auditoría
      this.logger.log("Attachment audit event", {
        userId,
        bookingId,
        action,
        metadata,
        timestamp: new Date().toISOString(),
        storageProvider: this._storageProvider.name,
      });
    } catch (error) {
      this.logger.error("Error logging audit event", error);
      // No fallar la operación principal por errores de auditoría
    }
  }
}
