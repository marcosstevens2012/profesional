"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth/auth-hooks";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword, isLoading } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const token = searchParams.get("token");

  if (!token) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Token inválido
          </h2>
        </div>
        <Alert variant="destructive">
          <AlertDescription>
            El enlace de restablecimiento de contraseña es inválido o ha
            expirado.
          </AlertDescription>
        </Alert>
        <Button asChild className="w-full">
          <Link href="/recuperar-password">Soliconsultar nuevo enlace</Link>
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    try {
      await resetPassword({ token, password });
      setSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/ingresar?message=password-reset");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Error al restablecer la contraseña");
    }
  };

  if (success) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            ¡Contraseña actualizada!
          </h2>
        </div>

        <Alert className="border-green-200 bg-green-50">
          <Icons.checkCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Tu contraseña ha sido restablecida exitosamente.
          </AlertDescription>
        </Alert>

        <div className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            Serás redirigido al inicio de sesión automáticamente...
          </p>
          <Button asChild className="w-full">
            <Link href="/ingresar">Iniciar sesión ahora</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Nueva contraseña
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ingresá tu nueva contraseña
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div>
          <Label htmlFor="password">Nueva contraseña</Label>
          <div className="mt-1">
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nueva contraseña (mínimo 8 caracteres)"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
          <div className="mt-1">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Confirmar nueva contraseña"
            />
          </div>
        </div>

        <div>
          <Button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Actualizar contraseña
          </Button>
        </div>
      </form>
    </div>
  );
}
