"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { socketService } from "../lib/socket";

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string | null;
  type: "TEXT" | "IMAGE" | "FILE" | "SYSTEM";
  deliveredAt: string | null;
  readAt: string | null;
  createdAt: string;
  sender: {
    id: string;
    name: string | null;
    profile: {
      avatar: string | null;
    } | null;
  };
  attachments: Attachment[];
}

export interface Attachment {
  id: string;
  key: string;
  filename: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

export interface TypingUser {
  userId: string;
  isTyping: boolean;
}

interface ChatOptions {
  bookingId: string;
  token: string;
  enabled?: boolean;
}

export function useChat({ bookingId, token, enabled = true }: ChatOptions) {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Obtener mensajes
  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    error: messagesError,
  } = useQuery({
    queryKey: ["messages", bookingId],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chat/conversations/${bookingId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error al cargar mensajes");
      }
      return response.json();
    },
    enabled: enabled && !!bookingId && !!token,
  });

  // Enviar mensaje
  const sendMessageMutation = useMutation({
    mutationFn: async (data: {
      content?: string;
      type: Message["type"];
      attachments?: Array<{
        key: string;
        filename: string;
        mimeType: string;
        size: number;
      }>;
    }) => {
      socketService.emit("message:send", {
        bookingId,
        ...data,
      });
    },
  });

  // Conectar al socket
  useEffect(() => {
    if (!enabled || !token || !bookingId) return;

    let mounted = true;
    let cleanup: (() => void) | undefined;

    const connectSocket = async (): Promise<void> => {
      try {
        const socket = await socketService.connect(token);

        if (!mounted) return;

        // Event listeners
        const handleConnect = () => {
          setIsConnected(true);
          socketService.emit("conversation:join", { bookingId });
        };

        const handleDisconnect = () => {
          setIsConnected(false);
        };

        const handleNewMessage = (message: Message) => {
          queryClient.setQueryData(["messages", bookingId], (old: any) => {
            if (!old)
              return { messages: [message], total: 1, page: 1, limit: 50 };

            const existingMessage = old.messages.find(
              (m: Message) => m.id === message.id
            );
            if (existingMessage) return old;

            return {
              ...old,
              messages: [...old.messages, message],
              total: old.total + 1,
            };
          });

          // Auto-marcar como recibido
          setTimeout(() => {
            socketService.emit("message:received", { messageId: message.id });
          }, 100);
        };

        const handleTyping = ({
          userId,
          isTyping,
        }: {
          userId: string;
          isTyping: boolean;
        }) => {
          setTypingUsers(prev => {
            const newSet = new Set(prev);
            if (isTyping) {
              newSet.add(userId);
            } else {
              newSet.delete(userId);
            }
            return newSet;
          });
        };

        const handleUserJoined = ({ userId }: { userId: string }) => {
          setOnlineUsers(prev => new Set(Array.from(prev).concat(userId)));
        };

        const handleUserLeft = ({ userId }: { userId: string }) => {
          setOnlineUsers(prev => {
            const newSet = new Set(prev);
            newSet.delete(userId);
            return newSet;
          });
        };

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("message:new", handleNewMessage);
        socket.on("typing", handleTyping);
        socket.on("user:joined", handleUserJoined);
        socket.on("user:left", handleUserLeft);

        if (socket.connected) {
          handleConnect();
        }

        cleanup = () => {
          socket.off("connect", handleConnect);
          socket.off("disconnect", handleDisconnect);
          socket.off("message:new", handleNewMessage);
          socket.off("typing", handleTyping);
          socket.off("user:joined", handleUserJoined);
          socket.off("user:left", handleUserLeft);
        };
      } catch (error) {
        console.error("Error connecting to chat:", error);
      }
    };

    connectSocket();

    return () => {
      mounted = false;
      cleanup?.();
      socketService.emit("conversation:leave", { bookingId });
    };
  }, [enabled, token, bookingId, queryClient]);

  // Función para enviar typing indicator
  const sendTyping = useCallback(
    (isTyping: boolean) => {
      if (!isConnected) return;

      socketService.emit("typing", { bookingId, isTyping });

      if (isTyping) {
        // Auto-stop typing después de 3 segundos
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
          socketService.emit("typing", { bookingId, isTyping: false });
        }, 3000);
      }
    },
    [isConnected, bookingId]
  );

  // Función para marcar mensaje como leído
  const markAsRead = useCallback(
    (messageId: string) => {
      if (!isConnected) return;
      socketService.emit("message:read", { messageId });
    },
    [isConnected]
  );

  return {
    messages: messagesData?.messages || [],
    isLoading: isLoadingMessages,
    error: messagesError,
    isConnected,
    typingUsers: Array.from(typingUsers),
    onlineUsers: Array.from(onlineUsers),
    sendMessage: sendMessageMutation.mutate,
    sendTyping,
    markAsRead,
    isLoadingMessages,
  };
}
