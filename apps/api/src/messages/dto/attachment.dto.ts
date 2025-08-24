import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from "class-validator";

export class UploadTokenRequestDto {
  @IsUUID()
  bookingId!: string;

  @IsString()
  filename!: string;

  @IsString()
  contentType!: string;

  @IsInt()
  @Min(1)
  @Max(10 * 1024 * 1024) // 10MB máximo
  size!: number;
}

export class UploadTokenResponseDto {
  url!: string;
  key!: string;
  method?: "PUT" | "POST";
  headers?: Record<string, string>;
  fields?: Record<string, string>;
  expiresAt?: Date;
}

export class SignedDownloadRequestDto {
  @IsString()
  key!: string;

  @IsOptional()
  @IsString()
  filename?: string;
}

export class AttachmentMetadataDto {
  key!: string;
  filename!: string;
  mimeType!: string;
  size!: number;
  uploadedAt!: Date;
  downloadUrl?: string;
}
