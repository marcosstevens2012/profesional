import { useAuth } from "@/lib/auth/auth-hooks";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

interface BookingAlert {
  bookingId: string;
  clientName: string;
  clientEmail: string;
  serviceDescription: string;
  amount: number;
  currency: string;
  scheduledAt: string;
  duration: number;
  paymentId: string;
  timestamp: string;
  urgency: "high" | "normal";
}

interface NotificationData {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  timestamp: string;
}

export function useWebSocketAlerts() {
  const { user, getToken } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [pendingAlerts, setPendingAlerts] = useState<BookingAlert[]>([]);

  // Refs para audio y control de alertas
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const alertIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentAlertRef = useRef<BookingAlert | null>(null);

  // Inicializar audio de alerta
  useEffect(() => {
    // Crear audio para alertas (sonido tipo Uber)
    audioRef.current = new Audio("/sounds/booking-alert.mp3");
    audioRef.current.volume = 0.8;
    audioRef.current.loop = true;

    // Precargar audio
    audioRef.current.load();

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Función para reproducir alerta sonora
  const playAlertSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.warn("No se pudo reproducir el sonido de alerta:", error);
      });
    }
  };

  // Función para detener alerta sonora
  const stopAlertSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (alertIntervalRef.current) {
      clearInterval(alertIntervalRef.current);
      alertIntervalRef.current = null;
    }
  };

  // Función para iniciar alerta persistente
  const startPersistentAlert = (alert: BookingAlert) => {
    currentAlertRef.current = alert;

    // Reproducir sonido inmediatamente
    playAlertSound();

    // Configurar sonido repetitivo cada 5 segundos si no se acepta
    alertIntervalRef.current = setInterval(() => {
      if (currentAlertRef.current) {
        playAlertSound();

        // Mostrar notificación visual también
        showBookingAlertToast(currentAlertRef.current);
      }
    }, 5000);
  };

  // Función para mostrar toast de alerta
  const showBookingAlertToast = (alert: BookingAlert) => {
    const scheduledDate = new Date(alert.scheduledAt);
    const formattedDate = scheduledDate.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

    const message = `🚨 Nueva Consulta Pagada\n\nCliente: ${alert.clientName}\nServicio: ${alert.serviceDescription}\nPago: $${alert.amount} ${alert.currency}\nFecha: ${formattedDate}`;

    toast.error(message, {
      duration: Infinity, // No auto-dismiss
      position: "top-center",
      className: "booking-alert-toast",
    });
  };

  // Función para aceptar booking
  const acceptBooking = async (bookingId: string) => {
    try {
      // Enviar respuesta via WebSocket
      if (socket) {
        socket.emit("accept_booking", {
          bookingId,
          response: "accept",
        });
      }

      // También hacer llamada HTTP de respaldo
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}/accept-meeting`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Consulta aceptada exitosamente");
        setPendingAlerts((prev) =>
          prev.filter((alert) => alert.bookingId !== bookingId)
        );
        currentAlertRef.current = null;
      } else {
        toast.error("Error al aceptar la consulta");
      }
    } catch (error) {
      console.error("Error accepting booking:", error);
      toast.error("Error al aceptar la consulta");
    }
  };

  // Función para rechazar booking
  const rejectBooking = async (bookingId: string) => {
    try {
      if (socket) {
        socket.emit("accept_booking", {
          bookingId,
          response: "reject",
        });
      }

      // TODO: Implementar endpoint para rechazar booking
      toast.info("Consulta rechazada");
      setPendingAlerts((prev) =>
        prev.filter((alert) => alert.bookingId !== bookingId)
      );
      currentAlertRef.current = null;
    } catch (error) {
      console.error("Error rejecting booking:", error);
      toast.error("Error al rechazar la consulta");
    }
  };

  // Configurar conexión WebSocket
  useEffect(() => {
    if (!user?.role || user.role !== "PROFESSIONAL") {
      return;
    }

    const connectSocket = async () => {
      try {
        const token = await getToken();

        const newSocket = io(
          process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3001",
          {
            auth: { token },
            query: { token },
            transports: ["websocket"],
            autoConnect: true,
          }
        );

        // Eventos de conexión
        newSocket.on("connect", () => {
          console.log("🔗 WebSocket connected");
          setIsConnected(true);
        });

        newSocket.on("disconnect", () => {
          console.log("🔌 WebSocket disconnected");
          setIsConnected(false);
        });

        // Evento principal: Nueva alerta de booking
        newSocket.on("new_booking_alert", (alert: BookingAlert) => {
          console.log("🚨 New booking alert received:", alert);

          setPendingAlerts((prev) => [...prev, alert]);
          startPersistentAlert(alert);

          // Mostrar notificación push del navegador
          if (
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            new Notification("🚨 Nueva Consulta Pagada", {
              body: `${alert.clientName} - $${alert.amount} ${alert.currency}`,
              icon: "/icons/booking-alert.png",
              tag: `booking-${alert.bookingId}`,
              requireInteraction: true,
            });
          }
        });

        // Otras notificaciones generales
        newSocket.on("notification", (notification: NotificationData) => {
          console.log("📱 Notification received:", notification);

          toast.info(notification.title, {
            description: notification.message,
          });
        });

        // Confirmación de respuesta a booking
        newSocket.on(
          "booking_response_received",
          (data: {
            bookingId: string;
            response: "accept" | "reject";
            timestamp: string;
          }) => {
            console.log("✅ Booking response confirmed:", data);
          }
        );

        // Ping/Pong para mantener conexión
        newSocket.on("pong", () => {
          console.log("🏓 Pong received");
        });

        setSocket(newSocket);
      } catch (error) {
        console.error("Error connecting WebSocket:", error);
      }
    };

    connectSocket();

    // Cleanup
    return () => {
      if (socket) {
        socket.disconnect();
      }
      stopAlertSound();
    };
  }, [user, getToken]);

  // Solicitar permisos de notificación al montar
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        console.log("🔔 Notification permission:", permission);
      });
    }
  }, []);

  // Función para testing
  const testAlert = () => {
    const testAlertData: BookingAlert = {
      bookingId: "test-123",
      clientName: "Juan Pérez",
      clientEmail: "juan@example.com",
      serviceDescription: "Consulta de prueba",
      amount: 5000,
      currency: "ARS",
      scheduledAt: new Date().toISOString(),
      duration: 60,
      paymentId: "test-payment",
      timestamp: new Date().toISOString(),
      urgency: "high",
    };

    startPersistentAlert(testAlertData);
    showBookingAlertToast(testAlertData);
  };

  return {
    socket,
    isConnected,
    pendingAlerts,
    playAlertSound,
    stopAlertSound,
    acceptBooking,
    rejectBooking,
    testAlert,
  };
}
