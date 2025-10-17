"use client";

import WaitingRoom from "@/components/WaitingRoom";
import { useAuth } from "@/lib/auth/auth-hooks";
import { useParams } from "next/navigation";

export default function MeetingPage() {
  const params = useParams();
  const bookingId = params.id as string;
  const { user } = useAuth();

  // El componente WaitingRoom maneja toda la lógica de estado y conectividad
  return (
    <WaitingRoom
      bookingId={bookingId}
      clientName={user?.name}
      professionalName={user?.name}
    />
  );
}
