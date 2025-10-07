"use client";

import { CreditCard, Calendar, User, DollarSign, Loader2 } from "lucide-react";
import { useCreateBookingPayment } from "@/hooks/useCreateBookingPayment";

interface PaymentCheckoutProps {
  bookingId: string;
  professionalName: string;
  sessionDate: string;
  sessionTime: string;
  price: number;
}

export default function PaymentCheckout({
  bookingId,
  professionalName,
  sessionDate,
  sessionTime,
  price,
}: PaymentCheckoutProps) {
  const { createPayment, isLoading, error } = useCreateBookingPayment();

  const handlePayment = async () => {
    await createPayment(bookingId);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Confirmar Pago
        </h2>
        <p className="text-gray-600">
          Revisa los detalles antes de proceder con el pago
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
          <User className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <div className="text-sm text-gray-500">Profesional</div>
            <div className="font-medium text-gray-900">{professionalName}</div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
          <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <div className="text-sm text-gray-500">Fecha y Hora</div>
            <div className="font-medium text-gray-900">
              {sessionDate} - {sessionTime}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
          <DollarSign className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <div className="text-sm text-gray-500">Precio por Sesión</div>
            <div className="font-medium text-gray-900">
              ${price.toLocaleString("es-AR")}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">Total</span>
          <span className="text-2xl font-bold text-blue-600">
            ${price.toLocaleString("es-AR")}
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            Error al procesar el pago. Por favor, intenta nuevamente.
          </p>
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Procesando...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Pagar con MercadoPago
          </>
        )}
      </button>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-800 text-center">
          🔒 Pago seguro procesado por MercadoPago. Serás redirigido al checkout
          oficial.
        </p>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Al continuar aceptas los términos y condiciones del servicio
        </p>
      </div>
    </div>
  );
}
