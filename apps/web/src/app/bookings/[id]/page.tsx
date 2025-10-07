"use client";

import { useParams } from "next/navigation";
import { Calendar, Clock, User, MapPin, Video } from "lucide-react";
import PaymentCheckout from "@/components/PaymentCheckout";

// Este es un ejemplo de cómo integrar el componente PaymentCheckout
// en una página de detalles de booking

interface Booking {
  id: string;
  status: string;
  scheduledAt: string;
  duration: number;
  professional: {
    id: string;
    user: {
      name: string;
      email: string;
    };
    pricePerSession: number;
    specialty: string;
  };
  payment?: {
    id: string;
    status: string;
    amount: number;
  };
}

export default function BookingDetailsPage() {
  const params = useParams();
  const bookingId = params.id as string;

  // En producción, obtener booking con React Query:
  // const { data: booking } = useQuery({
  //   queryKey: ["booking", bookingId],
  //   queryFn: () => fetch(`/api/bookings/${bookingId}`).then(r => r.json())
  // });

  // Ejemplo de datos (reemplazar con datos reales)
  const booking: Booking = {
    id: bookingId,
    status: "PENDING_PAYMENT",
    scheduledAt: "2024-05-15T14:00:00Z",
    duration: 60,
    professional: {
      id: "prof-123",
      user: {
        name: "Dr. Juan Pérez",
        email: "juan@example.com",
      },
      pricePerSession: 15000,
      specialty: "Psicología Clínica",
    },
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const showPaymentCheckout = booking.status === "PENDING_PAYMENT";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Detalles de la Reserva
          </h1>
          <p className="text-gray-600">
            ID: <span className="font-mono text-sm">{booking.id}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda: Información de la reserva */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card de estado */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Estado</h2>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    booking.status === "PENDING_PAYMENT"
                      ? "bg-yellow-100 text-yellow-800"
                      : booking.status === "CONFIRMED"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {booking.status === "PENDING_PAYMENT"
                    ? "Pago Pendiente"
                    : booking.status === "CONFIRMED"
                      ? "Confirmada"
                      : booking.status}
                </span>
              </div>

              {showPaymentCheckout && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    ⚠️ <strong>Acción requerida:</strong> Completa el pago para
                    confirmar tu reserva.
                  </p>
                </div>
              )}
            </div>

            {/* Card de profesional */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Profesional
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {booking.professional.user.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.professional.specialty}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card de fecha y hora */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Fecha y Hora
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {formatDate(booking.scheduledAt)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {formatTime(booking.scheduledAt)} ({booking.duration}{" "}
                      minutos)
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Video className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">
                      Videollamada (Jitsi)
                    </div>
                    <div className="text-sm text-gray-500">
                      El link se enviará por email
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Información de pago si existe */}
            {booking.payment && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Información de Pago
                </h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID de Pago:</span>
                    <span className="font-mono text-sm">
                      {booking.payment.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado:</span>
                    <span
                      className={`font-medium ${
                        booking.payment.status === "COMPLETED"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {booking.payment.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monto:</span>
                    <span className="font-semibold text-gray-900">
                      ${booking.payment.amount.toLocaleString("es-AR")}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Columna derecha: Payment Checkout o Info */}
          <div className="lg:col-span-1">
            {showPaymentCheckout ? (
              <PaymentCheckout
                bookingId={booking.id}
                professionalName={booking.professional.user.name}
                sessionDate={formatDate(booking.scheduledAt)}
                sessionTime={formatTime(booking.scheduledAt)}
                price={booking.professional.pricePerSession}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Próximos Pasos
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600">1.</span>
                    <span>
                      Recibirás un email con el link de la videollamada 24hs
                      antes
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600">2.</span>
                    <span>
                      Asegúrate de tener buena conexión a internet y un espacio
                      tranquilo
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600">3.</span>
                    <span>
                      Si necesitas cancelar, hazlo con al menos 48hs de
                      anticipación
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
