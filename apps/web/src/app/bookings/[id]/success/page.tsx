"use client";

import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function PaymentSuccessPage({
  params,
}: {
  params: { id: string };
}) {
  const searchParams = useSearchParams();
  const bookingId = params.id;
  const paymentId = searchParams.get("payment_id");
  const status = searchParams.get("status");

  useEffect(() => {
    // Aquí podrías hacer un tracking event
    console.log("Payment success", { bookingId, paymentId, status });
  }, [bookingId, paymentId, status]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto animate-bounce" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          ¡Pago Exitoso!
        </h1>

        <p className="text-gray-600 mb-6">
          Tu pago ha sido procesado correctamente. El profesional ha sido
          notificado y pronto recibirás una confirmación.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="text-sm text-gray-500 mb-1">ID de Reserva</div>
          <div className="font-mono text-sm text-gray-900">{bookingId}</div>
        </div>

        {paymentId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-500 mb-1">ID de Pago</div>
            <div className="font-mono text-sm text-gray-900">{paymentId}</div>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href={`/bookings/${bookingId}`}
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Ver Detalles de la Reserva
          </Link>

          <Link
            href="/dashboard"
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Ir al Dashboard
          </Link>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Próximos pasos:</strong> El profesional revisará tu
            solicitud y te confirmará la fecha y hora de la consulta.
          </p>
        </div>
      </div>
    </div>
  );
}
