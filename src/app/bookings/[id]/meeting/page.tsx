"use client";

import WaitingRoom from "@/components/WaitingRoom";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MeetingPage() {
  const params = useParams();
  const bookingId = params.id as string;
  const [bookingData, setBookingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No se encontró token de autenticación");
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/bookings/${bookingId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener datos de la reserva");
        }

        const data = await response.json();
        setBookingData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBookingData();
    }
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold mb-2">Cargando...</h2>
          <p className="text-gray-600">Obteniendo información de la reunión</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => (window.location.href = "/panel")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg"
          >
            Volver al Panel
          </button>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-yellow-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Reserva no encontrada
          </h2>
          <p className="text-gray-600 mb-6">
            No se pudo encontrar la información de esta reserva.
          </p>
          <button
            onClick={() => (window.location.href = "/panel")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg"
          >
            Volver al Panel
          </button>
        </div>
      </div>
    );
  }

  return (
    <WaitingRoom
      bookingId={bookingId}
      clientName={bookingData.user?.name || "Cliente"}
      professionalName={bookingData.professional?.name || "Profesional"}
    />
  );
}
