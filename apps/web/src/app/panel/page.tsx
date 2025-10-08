"use client";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { useAuth } from "@/lib/auth/auth-hooks";
import { Card, CardContent } from "@/components/ui";
import { Loader2 } from "lucide-react";

// Import specific panels for each role
import AdminPanel from "./components/AdminPanel";
import ClientPanel from "./components/ClientPanel";
import ProfessionalPanel from "./components/ProfessionalPanel";

export default function PanelPage() {
  const { user, isLoading, isAuthenticated } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando panel...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Acceso Requerido</h2>
            <p className="text-muted-foreground mb-4">
              Debes iniciar sesión para acceder al panel de control.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render appropriate panel based on user role
  const renderPanelByRole = () => {
    switch (user.role) {
      case "admin":
        return <AdminPanel user={user} />;
      case "professional":
        return <ProfessionalPanel user={user} />;
      case "client":
        return <ClientPanel user={user} />;
      default:
        return (
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">Rol No Reconocido</h2>
              <p className="text-muted-foreground">
                Tu rol de usuario no es válido. Contacta al administrador.
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      {renderPanelByRole()}
    </div>
  );
}
