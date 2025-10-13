"use client";

import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { AlertCircle, ArrowLeft, Clock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface PagoPendienteProps {
  params: {
    slug: string;
  };
}

export default function PagoPendientePage({ params }: PagoPendienteProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paymentId = searchParams.get("payment_id");

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Profesionales", href: "/profesionales" },
          { label: params.slug, href: `/profesionales/${params.slug}` },
          { label: "Pago Pendiente" },
        ]}
      />

      <div className="max-w-2xl mx-auto mt-8 space-y-6">
        {/* Estado Pendiente */}
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-yellow-700 dark:text-yellow-400">
              <Clock className="h-8 w-8" />
              Pago Pendiente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-yellow-700 dark:text-yellow-400">
              Tu pago está siendo procesado. Esto puede tomar algunos minutos.
            </p>
            {paymentId && (
              <p className="text-sm text-muted-foreground">
                ID de Pago: {paymentId}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Información */}
        <Card>
          <CardHeader>
            <CardTitle>¿Qué significa esto?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Pago en proceso:</strong> Tu transacción está siendo
                  verificada por el procesador de pagos.
                </p>
                <p className="text-sm">
                  Esto puede ocurrir con ciertos métodos de pago como
                  transferencias bancarias o pagos en efectivo.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Próximos Pasos */}
        <Card>
          <CardHeader>
            <CardTitle>¿Qué debo hacer?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <p className="text-sm">
                <strong>Espera la confirmación:</strong> Recibirás un correo
                cuando el pago sea aprobado.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <p className="text-sm">
                <strong>Verifica tu panel:</strong> Puedes revisar el estado de
                tu reserva en cualquier momento.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <p className="text-sm">
                <strong>Contacta soporte:</strong> Si después de 24 horas no
                recibes novedades, contáctanos.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => router.push("/panel")}
            className="flex-1"
            size="lg"
          >
            Ir a Mis Reservas
          </Button>
          <Button
            onClick={() => router.push(`/profesionales/${params.slug}`)}
            variant="outline"
            size="lg"
            className="flex-1"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Perfil
          </Button>
        </div>
      </div>
    </div>
  );
}
