"use client";

import { Message } from "../../../hooks/useChat";
import MessageBubble from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  getDownloadUrl: (_key: string, _filename?: string) => Promise<string>;
}

export default function MessageList({
  messages,
  currentUserId,
  getDownloadUrl,
}: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <div className="text-center text-gray-500">
          <p>No hay mensajes aún</p>
          <p className="text-sm">¡Envía el primer mensaje para comenzar!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {messages.map((message, index) => {
        const previousMessage = index > 0 ? messages[index - 1] : null;
        const showSender =
          !previousMessage || previousMessage.senderId !== message.senderId;

        return (
          <MessageBubble
            key={message.id}
            message={message}
            isOwnMessage={message.senderId === currentUserId}
            showSender={showSender}
            getDownloadUrl={getDownloadUrl}
          />
        );
      })}
    </div>
  );
}
