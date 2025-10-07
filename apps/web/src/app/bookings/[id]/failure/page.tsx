"use client";

import { useSearchParams } from "next/navigation";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentFailurePage({
  params,
}: {
  params: { id: string };
}) {
  const searchParams = useSearchParams();
  const bookingId = params.id;
  const status = searchParams.get("status");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <XCircle className="w-20 h-20 text-red-500 mx-auto" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Pago Rechazado
        </h1>

        <p className="text-gray-600 mb-6">
          Lo sentimos, tu pago no pudo ser procesado. Por favor, verifica tus
          datos e intenta nuevamente.
        </p>

        {status && (
          <div className="bg-red-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-red-500 mb-1">Estado</div>
            <div className="font-mono text-sm text-red-900">{status}</div>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href={`/bookings/${bookingId}/payment`}
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Intentar Nuevamente
          </Link>

          <Link
            href={`/bookings/${bookingId}`}
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Ver Detalles de la Reserva
          </Link>

          <Link
            href="/dashboard"
            className="block w-full text-gray-500 hover:text-gray-700 font-medium py-2 transition-colors"
          >
            Volver al Dashboard
          </Link>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>💳 Posibles causas:</strong>
            <br />
            • Fondos insuficientes
            <br />
            • Datos incorrectos de la tarjeta
            <br />• Límite de compra excedido
          </p>
        </div>
      </div>
    </div>
  );
}
