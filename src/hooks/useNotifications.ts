import { getAuthHeaders } from "@/lib/utils/auth-helpers";
import { useQuery } from "@tanstack/react-query";

interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  payload: any;
  readAt: Date | null;
  createdAt: Date;
}

interface UseNotificationsOptions {
  unreadOnly?: boolean;
  enabled?: boolean;
}

/**
 * Hook para obtener notificaciones del usuario
 */
export function useNotifications(options: UseNotificationsOptions = {}) {
  const { unreadOnly = false, enabled = true } = options;

  const endpoint = unreadOnly ? "/notifications/unread" : "/notifications";

  return useQuery({
    queryKey: ["notifications", unreadOnly ? "unread" : "all"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener notificaciones");
      }

      return response.json() as Promise<Notification[]>;
    },
    enabled,
    refetchInterval: 30000, // Refetch cada 30 segundos
  });
}

/**
 * Hook para obtener el contador de notificaciones no leídas
 */
export function useUnreadNotificationsCount() {
  return useQuery({
    queryKey: ["notifications", "unread", "count"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/unread/count`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener contador");
      }

      const data = await response.json();
      return data.count as number;
    },
    refetchInterval: 30000, // Refetch cada 30 segundos
  });
}

/**
 * Hook para marcar notificaciones como leídas
 */
export function useMarkNotificationAsRead() {
  const markAsRead = async (notificationId: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/notifications/${notificationId}/read`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Error al marcar como leída");
    }

    return response.json();
  };

  return { markAsRead };
}

/**
 * Hook para marcar todas las notificaciones como leídas
 */
export function useMarkAllNotificationsAsRead() {
  const markAllAsRead = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/notifications/read-all`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Error al marcar todas como leídas");
    }

    return response.json();
  };

  return { markAllAsRead };
}

/**
 * Hook para eliminar una notificación
 */
export function useDeleteNotification() {
  const deleteNotification = async (notificationId: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/notifications/${notificationId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Error al eliminar notificación");
    }

    return response.json();
  };

  return { deleteNotification };
}
