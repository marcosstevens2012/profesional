import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
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
import { Throttle } from "@nestjs/throttler";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import {
  AttachmentMetadataDto,
  SignedDownloadRequestDto,
  UploadTokenRequestDto,
} from "./dto/attachment.dto";
import { MessagesThrottlerGuard } from "./guards/messages-throttler.guard";
import { MessagesService } from "./messages.service";

@ApiTags("Messages")
@ApiBearerAuth()
@Controller("messages")
@UseGuards(JwtAuthGuard, MessagesThrottlerGuard)
export class MessagesController {
  constructor(private readonly _messagesService: MessagesService) {}

  @Post("upload-token")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 uploads por minuto
  @ApiOperation({ summary: "Obtener token para subir archivo" })
  @ApiResponse({
    status: 200,
    description: "Token de subida generado exitosamente",
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: "Datos inválidos o tipo de archivo no permitido",
  })
  @ApiResponse({ status: 403, description: "Sin acceso al booking" })
  @ApiResponse({ status: 429, description: "Demasiadas solicitudes de upload" })
  async generateUploadToken(
    @Request() req: any,
    @Body() dto: UploadTokenRequestDto
  ) {
    return this._messagesService.generateUploadToken(req.user.sub, dto);
  }

  @Get("signed-download")
  @ApiOperation({ summary: "Obtener URL firmada para descargar archivo" })
  @ApiResponse({
    status: 200,
    description: "URL de descarga generada exitosamente",
    type: Object,
  })
  @ApiResponse({
    status: 404,
    description: "Archivo no encontrado o sin acceso",
  })
  async generateSignedDownloadUrl(
    @Request() req: any,
    @Query() dto: SignedDownloadRequestDto
  ) {
    return this._messagesService.generateSignedDownloadUrl(req.user.sub, dto);
  }

  @Get("attachment-metadata")
  @ApiOperation({ summary: "Obtener metadatos de un adjunto" })
  @ApiResponse({
    status: 200,
    description: "Metadatos obtenidos exitosamente",
    type: AttachmentMetadataDto,
  })
  @ApiResponse({
    status: 404,
    description: "Archivo no encontrado o sin acceso",
  })
  async getAttachmentMetadata(@Request() req: any, @Query("key") key: string) {
    return this._messagesService.getAttachmentMetadata(req.user.sub, key);
  }
}
