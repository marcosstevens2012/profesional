import { useState } from "react";

interface CreatePaymentResponse {
  paymentId: string;
  preferenceId: string;
  init_point: string;
  amount: number;
  bookingId: string;
}

interface UseCreateBookingPaymentReturn {
  createPayment: (bookingId: string) => Promise<CreatePaymentResponse>;
  isLoading: boolean;
  error: Error | null;
  paymentData: CreatePaymentResponse | null;
}

/**
 * Hook para crear un pago vinculado a una reserva
 * Redirige automáticamente al checkout de MercadoPago
 */
export function useCreateBookingPayment(): UseCreateBookingPaymentReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [paymentData, setPaymentData] = useState<CreatePaymentResponse | null>(
    null
  );

  const createPayment = async (
    bookingId: string
  ): Promise<CreatePaymentResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}/payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear el pago");
      }

      const data: CreatePaymentResponse = await response.json();
      setPaymentData(data);

      // Redirigir automáticamente al checkout de MercadoPago
      if (data.init_point) {
        window.location.href = data.init_point;
      }

      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Error desconocido");
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createPayment,
    isLoading,
    error,
    paymentData,
  };
}
