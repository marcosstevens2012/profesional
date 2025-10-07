"use client";

import { useState } from "react";
import { Bell, Trash2, CheckCheck, Filter } from "lucide-react";
import Link from "next/link";
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
} from "@/hooks/useNotifications";

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const { data: notifications = [], refetch } = useNotifications(filter);
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  const deleteMutation = useDeleteNotification();

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsReadMutation.mutateAsync(notificationId);
    refetch();
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsReadMutation.mutateAsync();
    refetch();
  };

  const handleDelete = async (notificationId: string) => {
    if (confirm("¿Estás seguro de eliminar esta notificación?")) {
      await deleteMutation.mutateAsync(notificationId);
      refetch();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "BOOKING_REQUEST":
        return "📅";
      case "BOOKING_CONFIRMED":
        return "✅";
      case "BOOKING_CANCELLED":
        return "❌";
      case "PAYMENT_RECEIVED":
        return "💰";
      case "REVIEW_RECEIVED":
        return "⭐";
      default:
        return "🔔";
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Notificaciones
          </h1>
          <p className="text-gray-600">
            Mantente al día con todas tus actualizaciones
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    filter === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Filter className="w-4 h-4 inline mr-1" />
                  Todas
                </button>
                <button
                  onClick={() => setFilter("unread")}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    filter === "unread"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Bell className="w-4 h-4 inline mr-1" />
                  No leídas {unreadCount > 0 && `(${unreadCount})`}
                </button>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <CheckCheck className="w-4 h-4" />
                  Marcar todas como leídas
                </button>
              )}
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {notifications.length === 0 ? (
              <div className="p-12 text-center">
                <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 text-lg">
                  No tienes notificaciones
                  {filter === "unread" ? " sin leer" : ""}
                </p>
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 transition-colors ${
                    !notification.read ? "bg-blue-50" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3
                          className={`font-semibold text-gray-900 ${
                            !notification.read ? "font-bold" : ""
                          }`}
                        >
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-1.5"></span>
                        )}
                      </div>

                      <p className="text-gray-600 mb-2">
                        {notification.message}
                      </p>

                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="text-sm text-gray-400">
                          {formatDate(notification.createdAt)}
                        </span>

                        {notification.payload?.bookingId && (
                          <Link
                            href={`/bookings/${notification.payload.bookingId}`}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Ver detalles →
                          </Link>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Marcar como leída"
                        >
                          <CheckCheck className="w-5 h-5" />
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
