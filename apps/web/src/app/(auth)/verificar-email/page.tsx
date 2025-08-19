"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { useAuth } from "@/lib/auth/auth-hooks";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const { verifyEmail } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Token de verificación no encontrado");
      return;
    }

    const verify = async () => {
      try {
        await verifyEmail({ token });
        setStatus("success");
        setMessage("¡Email verificado exitosamente!");
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message || "Error al verificar el email");
      }
    };

    verify();
  }, [searchParams, verifyEmail]);

  return (
    <div className="space-y-6 text-center">
      <div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Verificación de email
        </h2>
      </div>

      {status === "loading" && (
        <div className="flex flex-col items-center space-y-4">
          <Icons.spinner className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-600">Verificando tu email...</p>
        </div>
      )}

      {status === "success" && (
        <div className="space-y-4">
          <Alert className="border-green-200 bg-green-50">
            <Icons.checkCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {message}
            </AlertDescription>
          </Alert>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Tu cuenta ha sido activada. Ya podés iniciar sesión.
            </p>
            <Button asChild className="w-full">
              <Link href="/ingresar">Iniciar sesión</Link>
            </Button>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-4">
          <Alert variant="destructive">
            <Icons.alertCircle className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Podés intentar crear una cuenta nuevamente o contactar soporte.
            </p>
            <div className="flex space-x-4">
              <Button asChild variant="outline" className="flex-1">
                <Link href="/registro">Crear cuenta</Link>
              </Button>
              <Button asChild className="flex-1">
                <Link href="/contacto">Contactar soporte</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
