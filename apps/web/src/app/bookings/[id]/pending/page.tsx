"use client";

import { useSearchParams } from "next/navigation";
import { Clock } from "lucide-react";
import Link from "next/link";

export default function PaymentPendingPage({
  params,
}: {
  params: { id: string };
}) {
  const searchParams = useSearchParams();
  const bookingId = params.id;
  const paymentId = searchParams.get("payment_id");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <Clock className="w-20 h-20 text-yellow-500 mx-auto animate-pulse" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Pago Pendiente
        </h1>

        <p className="text-gray-600 mb-6">
          Tu pago está siendo procesado. Te notificaremos cuando se confirme la
          transacción.
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

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>⏳ Tiempo estimado:</strong> El procesamiento puede demorar
            hasta 48 horas dependiendo del medio de pago utilizado.
          </p>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            📧 Te enviaremos un email cuando el pago se confirme.
          </p>
        </div>
      </div>
    </div>
  );
}
