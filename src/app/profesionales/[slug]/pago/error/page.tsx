"use client";

import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { AlertTriangle, ArrowLeft, RefreshCw, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface PagoErrorProps {
  params: {
    slug: string;
  };
}

export default function PagoErrorPage({ params }: PagoErrorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paymentId = searchParams.get("payment_id");

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Profesionales", href: "/profesionales" },
          { label: params.slug, href: `/profesionales/${params.slug}` },
          { label: "Error de Pago" },
        ]}
      />

      <div className="max-w-2xl mx-auto mt-8 space-y-6">
        {/* Error Principal */}
        <Card className="border-destructive bg-red-50 dark:bg-red-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-destructive">
              <XCircle className="h-8 w-8" />
              Pago Rechazado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-destructive">
              Lo sentimos, no pudimos procesar tu pago. No se ha realizado
              ningún cargo.
            </p>
            {paymentId && (
              <p className="text-sm text-muted-foreground">
                ID de Pago: {paymentId}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Razones Comunes */}
        <Card>
          <CardHeader>
            <CardTitle>Razones Comunes de Rechazo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Fondos insuficientes:</strong> Verifica que tu tarjeta
                  o cuenta tenga saldo disponible.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Datos incorrectos:</strong> Revisa que los datos de tu
                  tarjeta sean correctos.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Límite de compra:</strong> Algunos bancos tienen
                  límites de compra online.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Seguridad bancaria:</strong> Tu banco puede haber
                  bloqueado la transacción por seguridad.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Próximos Pasos */}
        <Card>
          <CardHeader>
            <CardTitle>¿Qué puedo hacer?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <p className="text-sm">
                <strong>Verifica tus datos:</strong> Asegúrate de que la
                información de pago sea correcta.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <p className="text-sm">
                <strong>Contacta tu banco:</strong> Si el problema persiste,
                comunícate con tu entidad bancaria.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <p className="text-sm">
                <strong>Intenta otro método:</strong> Prueba con otra tarjeta o
                método de pago.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => router.push(`/profesionales/${params.slug}`)}
            className="flex-1"
            size="lg"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Intentar Nuevamente
          </Button>
          <Button
            onClick={() => router.push("/explorar")}
            variant="outline"
            size="lg"
            className="flex-1"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Buscar Otros Profesionales
          </Button>
        </div>

        {/* Soporte */}
        <Card className="bg-muted">
          <CardContent className="pt-6">
            <p className="text-sm text-center">
              ¿Necesitas ayuda? Contáctanos en{" "}
              <a
                href="mailto:soporte@tuapp.com"
                className="text-primary hover:underline"
              >
                soporte@tuapp.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
