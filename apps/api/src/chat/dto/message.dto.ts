import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from "class-validator";

export enum MessageType {
  _TEXT = "TEXT",
  _IMAGE = "IMAGE",
  _FILE = "FILE",
  _SYSTEM = "SYSTEM",
}

export class AttachmentDto {
  @IsString()
  key!: string;

  @IsString()
  filename!: string;

  @IsString()
  mimeType!: string;

  @IsInt()
  @Min(1)
  @Max(10 * 1024 * 1024) // 10MB máximo
  size!: number;
}

export class SendMessageDto {
  @IsString()
  @IsUUID()
  bookingId!: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsEnum(MessageType)
  type: MessageType = MessageType._TEXT;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];
}

export class MessageReadDto {
  @IsString()
  @IsUUID()
  messageId!: string;
}

export class TypingDto {
  @IsUUID()
  bookingId!: string;

  @IsOptional()
  isTyping: boolean = true;
}

export class JoinConversationDto {
  @IsUUID()
  bookingId!: string;
}

export class LeaveConversationDto {
  @IsUUID()
  bookingId!: string;
}
