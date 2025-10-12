"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth/auth-hooks";
import Link from "next/link";
import React, { useState } from "react";

export default function ForgotPasswordPage() {
  const { forgotPassword, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await forgotPassword({ email });
      setMessage(response.message);
      setIsSubmitted(true);
    } catch (err: any) {
      setMessage(err.message || "Error al enviar el email");
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Email enviado
          </h2>
        </div>

        <Alert className="border-green-200 bg-green-50">
          <Icons.mail className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {message}
          </AlertDescription>
        </Alert>

        <div className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            Revisá tu bandeja de entrada y seguí las instrucciones en el email.
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link href="/ingresar">Volver al inicio de sesión</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Recuperar contraseña
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ingresá tu email y te enviaremos instrucciones para restablecer tu
          contraseña
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {message && !isSubmitted && (
          <Alert variant="destructive">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div>
          <Label htmlFor="email">Dirección de email</Label>
          <div className="mt-1">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Dirección de email"
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
            Enviar instrucciones
          </Button>
        </div>

        <div className="text-center">
          <Link
            href="/ingresar"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            ← Volver al inicio de sesión
          </Link>
        </div>
      </form>
    </div>
  );
}
