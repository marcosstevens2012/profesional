"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
  useUnreadNotificationsCount,
} from "@/hooks/useNotifications";
import { useHasNewBookingRequests } from "@/hooks/useProfessionalBookings";
import {
  Bell,
  Calendar,
  Check,
  CheckCheck,
  Clock,
  DollarSign,
  Video,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: unreadCount = 0 } = useUnreadNotificationsCount();
  const { data: notifications = [], refetch } = useNotifications({
    unreadOnly: false,
  });
  const { markAsRead } = useMarkNotificationAsRead();
  const { markAllAsRead } = useMarkAllNotificationsAsRead();
  const { hasNewRequests, newRequestsCount } = useHasNewBookingRequests();

  // Total notifications including booking requests
  const totalUnread = unreadCount + (newRequestsCount || 0);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
      refetch();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      refetch();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const formatDate = (dateInput: string | Date) => {
    const date =
      typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Ahora";
    if (diffInMinutes < 60) return `Hace ${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)}h`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "BOOKING_REQUEST":
        return <Calendar className="w-4 h-4 text-orange-600" />;
      case "BOOKING_CONFIRMED":
        return <Check className="w-4 h-4 text-green-600" />;
      case "PAYMENT_COMPLETED":
        return <DollarSign className="w-4 h-4 text-green-600" />;
      case "MEETING_READY":
        return <Video className="w-4 h-4 text-blue-600" />;
      case "MEETING_REMINDER":
        return <Clock className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getNotificationLink = (notification: any) => {
    const payload = notification.payload || {};

    // Si tiene bookingId, ir a los detalles del booking
    if (payload.bookingId) {
      return `/bookings/${payload.bookingId}`;
    }

    // Según el tipo de notificación
    switch (notification.type) {
      case "BOOKING_REQUEST":
        return "/panel/professional-dashboard";
      case "BOOKING_CONFIRMED":
        return "/panel/mis-consultas";
      case "MEETING_READY":
        return payload.bookingId
          ? `/bookings/${payload.bookingId}/meeting`
          : "/panel";
      default:
        return "/notifications";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Notificaciones"
      >
        <Bell className="w-6 h-6" />
        {totalUnread > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
          >
            {totalUnread > 99 ? "99+" : totalUnread}
          </Badge>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Notificaciones
              </h3>
              <div className="flex items-center gap-2">
                {totalUnread > 0 && (
                  <Badge variant="secondary">{totalUnread} nuevas</Badge>
                )}
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="sm"
                  className="p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {totalUnread > 0 && (
              <Button
                onClick={handleMarkAllAsRead}
                variant="ghost"
                size="sm"
                className="mt-2 p-0 h-auto text-blue-600 hover:text-blue-800"
              >
                <CheckCheck className="w-4 h-4 mr-1" />
                Marcar todas como leídas
              </Button>
            )}
          </div>

          {/* Special notification for new booking requests */}
          {hasNewRequests && (
            <div className="p-3 bg-orange-50 border-b border-orange-200">
              <Link
                href="/panel/professional-dashboard"
                onClick={() => setIsOpen(false)}
                className="block hover:bg-orange-100 rounded-lg p-2 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-orange-900">
                      {newRequestsCount === 1
                        ? "Nueva solicitud de consulta"
                        : `${newRequestsCount} nuevas solicitudes de consulta`}
                    </p>
                    <p className="text-sm text-orange-700">
                      {newRequestsCount === 1
                        ? "Tienes una consulta pagada esperando tu aceptación"
                        : "Tienes consultas pagadas esperando tu aceptación"}
                    </p>
                  </div>
                  <Badge variant="destructive" className="text-xs">
                    NUEVO
                  </Badge>
                </div>
              </Link>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-60 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No hay notificaciones</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.slice(0, 10).map((notification: any) => (
                  <Link
                    key={notification.id}
                    href={getNotificationLink(notification)}
                    onClick={() => {
                      setIsOpen(false);
                      if (!notification.readAt) {
                        handleMarkAsRead(notification.id);
                      }
                    }}
                    className={`block p-3 hover:bg-gray-50 transition-colors ${
                      !notification.readAt ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm ${
                            !notification.readAt
                              ? "font-medium text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400">
                            {formatDate(notification.createdAt)}
                          </span>
                          {!notification.readAt && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <Link
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="block text-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Ver todas las notificaciones
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
