"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateMyProfile } from "@/hooks/useProfessionalProfile";
import { authAPI } from "@/lib/auth/auth-api";
import { useAuth } from "@/lib/auth/auth-hooks";
import { AlertCircle, CheckCircle, Loader2, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const updateProfile = useUpdateMyProfile();
  const [formData, setFormData] = useState({
    phone: "",
    bio: "",
    description: "",
    website: "",
  });
  const [error, setError] = useState("");
  const [isResendingEmail, setIsResendingEmail] = useState(false);

  // Redirect if not professional
  React.useEffect(() => {
    if (user && user.role !== "professional") {
      router.push("/");
    }
  }, [user, router]);

  const handleResendVerification = async () => {
    if (!user?.email) return;

    try {
      setIsResendingEmail(true);
      await authAPI.resendVerificationEmail(user.email);
      toast.success(
        "Email de verificación enviado. Revisa tu bandeja de entrada."
      );
    } catch (err: any) {
      toast.error(err.message || "Error al enviar el email de verificación");
    } finally {
      setIsResendingEmail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await updateProfile.mutateAsync({
        phone: formData.phone || undefined,
        bio: formData.bio || undefined,
        description: formData.description || undefined,
        website: formData.website || undefined,
      });

      toast.success("Perfil actualizado correctamente");
      router.push("/panel");
    } catch (err: any) {
      setError(err.message || "Error al completar el perfil");
    }
  };

  const handleSkip = () => {
    router.push("/panel");
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Usuario no ha verificado su email
  const isEmailVerified = user.status === "ACTIVE";

  if (!isEmailVerified) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center mb-6">
            <Mail className="h-16 w-16 text-primary" />
          </div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Verificá tu email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Antes de completar tu perfil profesional
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <Card className="p-8">
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Enviamos un email de verificación a{" "}
                <strong>{user.email}</strong>. Por favor, verificá tu email
                antes de continuar.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                <p className="mb-2">
                  ¿No recibiste el email? Revisá tu carpeta de spam o hacé clic
                  en el botón de abajo para reenviar:
                </p>
              </div>

              <Button
                onClick={handleResendVerification}
                disabled={isResendingEmail}
                className="w-full"
                variant="outline"
              >
                {isResendingEmail ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Reenviar email de verificación
                  </>
                )}
              </Button>

              <div className="pt-4 border-t text-center">
                <p className="text-xs text-gray-500">
                  Una vez verificado tu email, podrás completar tu perfil
                  profesional
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-2 mb-6">
          <CheckCircle className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900">Profesional</h1>
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
          Completá tu perfil profesional
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Esta información ayudará a los clientes a encontrarte y conocer tus
          servicios
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <Label htmlFor="phone">Teléfono de contacto</Label>
              <div className="mt-1">
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="Ej: +54 11 1234-5678"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Descripción de tu experiencia</Label>
              <div className="mt-1">
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Contanos sobre tu experiencia, formación y servicios..."
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Descripción breve de tu experiencia profesional
              </p>
            </div>

            <div>
              <Label htmlFor="description">
                Descripción detallada de tus servicios{" "}
                <span className="text-red-500">*</span>
              </Label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Descripción detallada de los servicios que ofrecés, tu metodología de trabajo, especialidades, etc..."
                  required
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Esta información ayudará a los clientes a conocer en detalle tus
                servicios
              </p>
            </div>

            <div>
              <Label htmlFor="website">Sitio Web (opcional)</Label>
              <div className="mt-1">
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      website: e.target.value,
                    }))
                  }
                  placeholder="https://tusitioweb.com"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleSkip}
                className="flex-1"
                disabled={updateProfile.isPending}
              >
                Completar más tarde
              </Button>
              <Button
                type="submit"
                disabled={updateProfile.isPending}
                className="flex-1"
              >
                {updateProfile.isPending ? "Guardando..." : "Completar perfil"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
