"use client";

import { useEffect, useRef, useState } from "react";
import { Message, useChat } from "../../../hooks/useChat";
import { useFileUpload, validateFile } from "../../../hooks/useFileUpload";
import FileUploadPreview from "./FileUploadPreview";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import TypingIndicator from "./TypingIndicator";

interface ChatContainerProps {
  bookingId: string;
  token: string;
  currentUserId: string;
}

export default function ChatContainer({
  bookingId,
  token,
  currentUserId,
}: ChatContainerProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const {
    messages,
    isLoading,
    error,
    isConnected,
    typingUsers,
    sendMessage,
    sendTyping,
    markAsRead,
  } = useChat({ bookingId, token, enabled: true });

  const { uploadFile, getDownloadUrl, uploadProgress, isUploading } =
    useFileUpload({ bookingId, token });

  // Auto-scroll al final cuando hay mensajes nuevos
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-marcar mensajes como leídos cuando están en viewport
  useEffect(() => {
    const unreadMessages = messages.filter(
      (msg: Message) => msg.senderId !== currentUserId && !msg.readAt
    );

    unreadMessages.forEach((msg: Message) => {
      markAsRead(msg.id);
    });
  }, [messages, currentUserId, markAsRead]);
  const handleSendMessage = async () => {
    if (!message.trim() && selectedFiles.length === 0) return;

    try {
      let attachments: Array<{
        key: string;
        filename: string;
        mimeType: string;
        size: number;
      }> = [];

      // Subir archivos si hay
      if (selectedFiles.length > 0) {
        const uploadPromises = selectedFiles.map(file => uploadFile(file));
        attachments = await Promise.all(uploadPromises);
      }

      // Determinar tipo de mensaje
      const messageType: Message["type"] = attachments.some(att =>
        att.mimeType.startsWith("image/")
      )
        ? "IMAGE"
        : attachments.length > 0
          ? "FILE"
          : "TEXT";

      // Enviar mensaje
      const messageData: {
        content?: string;
        type: Message["type"];
        attachments?: Array<{
          key: string;
          filename: string;
          mimeType: string;
          size: number;
        }>;
      } = {
        type: messageType,
      };

      if (message.trim()) {
        messageData.content = message.trim();
      }

      if (attachments.length > 0) {
        messageData.attachments = attachments;
      }

      sendMessage(messageData);

      // Limpiar formulario
      setMessage("");
      setSelectedFiles([]);
      setIsTyping(false);
    } catch (error) {
      console.error("Error sending message:", error);
      // TODO: Mostrar error al usuario
    }
  };

  const handleTyping = (text: string) => {
    setMessage(text);

    if (text.trim() && !isTyping) {
      setIsTyping(true);
      sendTyping(true);
    }

    // Limpiar timeout previo
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Si hay texto, programar parar de escribir en 1 segundo
    if (text.trim()) {
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        sendTyping(false);
      }, 1000);
    } else {
      // Si no hay texto, parar de escribir inmediatamente
      setIsTyping(false);
      sendTyping(false);
    }
  };

  const handleFileSelect = (files: FileList) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach(file => {
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(`${file.name}: ${validationError}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      // TODO: Mostrar errores al usuario
      console.error("File validation errors:", errors);
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg border bg-red-50">
        <div className="text-center">
          <p className="text-red-600">Error al cargar el chat</p>
          <p className="text-sm text-red-500">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-96 flex-col rounded-lg border bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-2">
        <h3 className="font-semibold">Chat</h3>
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-xs text-gray-500">
            {isConnected ? "Conectado" : "Desconectado"}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-gray-500">Cargando mensajes...</div>
          </div>
        ) : (
          <>
            <MessageList
              messages={messages}
              currentUserId={currentUserId}
              getDownloadUrl={getDownloadUrl}
            />
            <TypingIndicator
              typingUsers={typingUsers.filter(
                userId => userId !== currentUserId
              )}
            />
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* File Preview */}
      {selectedFiles.length > 0 && (
        <FileUploadPreview
          files={selectedFiles}
          onRemove={handleRemoveFile}
          uploadProgress={uploadProgress}
        />
      )}

      {/* Input */}
      <MessageInput
        message={message}
        onChange={handleTyping}
        onSend={handleSendMessage}
        onFileSelect={handleFileSelect}
        disabled={!isConnected || isUploading}
        isUploading={isUploading}
      />
    </div>
  );
}
