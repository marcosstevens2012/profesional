"use client";

import { Download, File, Image as ImageIcon } from "lucide-react";
import React, { useState } from "react";
import { Attachment, Message } from "../../../hooks/useChat";
import { cn } from "../../../lib/utils";

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  showSender: boolean;
  getDownloadUrl: (_key: string, _filename?: string) => Promise<string>;
}

export default function MessageBubble({
  message,
  isOwnMessage,
  showSender,
  getDownloadUrl,
}: MessageBubbleProps) {
  return (
    <div className={cn("flex", isOwnMessage ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-xs sm:max-w-md",
          isOwnMessage ? "order-2" : "order-1"
        )}
      >
        {/* Sender name */}
        {showSender && !isOwnMessage && (
          <div className="mb-1 text-xs text-gray-500">
            {message.sender.name || "Usuario"}
          </div>
        )}

        <div
          className={cn(
            "rounded-lg px-3 py-2",
            isOwnMessage
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-900"
          )}
        >
          {/* Text content */}
          {message.content && (
            <div className="mb-2 whitespace-pre-wrap break-words">
              {message.content}
            </div>
          )}

          {/* Attachments */}
          {message.attachments.length > 0 && (
            <div className="space-y-2">
              {message.attachments.map(attachment => (
                <AttachmentPreview
                  key={attachment.id}
                  attachment={attachment}
                  getDownloadUrl={getDownloadUrl}
                />
              ))}
            </div>
          )}

          {/* Timestamp and status */}
          <div
            className={cn(
              "mt-1 flex items-center justify-end gap-1 text-xs",
              isOwnMessage ? "text-blue-100" : "text-gray-500"
            )}
          >
            <span>
              {new Date(message.createdAt).toLocaleTimeString("es-AR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {isOwnMessage && (
              <div className="flex gap-1">
                {message.deliveredAt && (
                  <div className="h-2 w-2 rounded-full bg-current opacity-60" />
                )}
                {message.readAt && (
                  <div className="h-2 w-2 rounded-full bg-current" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface AttachmentPreviewProps {
  attachment: Attachment;
  getDownloadUrl: (_key: string, _filename?: string) => Promise<string>;
}

function AttachmentPreview({
  attachment,
  getDownloadUrl,
}: AttachmentPreviewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isImage = attachment.mimeType.startsWith("image/");

  const handleDownload = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const url = await getDownloadUrl(attachment.key, attachment.filename);

      if (isImage) {
        setImageUrl(url);
      } else {
        // Descargar archivo
        const link = document.createElement("a");
        link.href = url;
        link.download = attachment.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      setError("Error al descargar el archivo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageLoad = () => {
    if (!imageUrl && isImage) {
      handleDownload();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  React.useEffect(() => {
    if (isImage) {
      handleImageLoad();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isImage]);

  return (
    <div className="rounded border bg-white p-2">
      {isImage && imageUrl ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={attachment.filename}
            className="max-h-48 w-full rounded object-cover"
            onError={() => setError("Error al cargar la imagen")}
          />
          <div className="mt-1 text-xs text-gray-500">
            {attachment.filename}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0">
            {isImage ? (
              <ImageIcon className="h-8 w-8 text-gray-400" />
            ) : (
              <File className="h-8 w-8 text-gray-400" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {attachment.filename}
            </div>
            <div className="text-xs text-gray-500">
              {formatFileSize(attachment.size)}
            </div>
          </div>

          <button
            onClick={handleDownload}
            disabled={isLoading}
            className="flex-shrink-0 rounded p-1 hover:bg-gray-100 disabled:opacity-50"
          >
            <Download className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      )}

      {error && <div className="mt-1 text-xs text-red-500">{error}</div>}
    </div>
  );
}
