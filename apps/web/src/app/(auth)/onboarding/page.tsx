"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth/auth-hooks";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    phone: "",
    bio: "",
    specialties: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if not professional
  React.useEffect(() => {
    if (user && user.role !== "professional") {
      router.push("/");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // TODO: Implement profile completion API call
      console.log("Completing professional profile:", formData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Error al completar el perfil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    router.push("/dashboard");
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
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
                  onChange={e =>
                    setFormData(prev => ({ ...prev, phone: e.target.value }))
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
                  onChange={e =>
                    setFormData(prev => ({ ...prev, bio: e.target.value }))
                  }
                  className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Contanos sobre tu experiencia, formación y qué servicios ofrecés..."
                />
              </div>
            </div>

            <div>
              <Label htmlFor="specialties">
                Especialidades (separadas por comas)
              </Label>
              <div className="mt-1">
                <Input
                  id="specialties"
                  name="specialties"
                  type="text"
                  value={formData.specialties}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      specialties: e.target.value,
                    }))
                  }
                  placeholder="Ej: Plomería, Electricidad, Carpintería"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleSkip}
                className="flex-1"
                disabled={isLoading}
              >
                Completar más tarde
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Guardando..." : "Completar perfil"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
