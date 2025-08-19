import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@profesional/ui";
import type { User } from "@profesional/contracts";

export default function HomePage() {
  const user: User = {
    id: "1",
    email: "test@example.com",
    name: "Usuario de Ejemplo",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Monorepo Profesional
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Bienvenido a nuestro monorepo con Turborepo, Next.js y NestJS
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Frontend (Next.js)</CardTitle>
              <CardDescription>
                Aplicación web moderna con React y TypeScript
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Esta aplicación utiliza:
              </p>
              <ul className="text-sm space-y-2">
                <li>• Next.js 14 con App Router</li>
                <li>• TailwindCSS para estilos</li>
                <li>• Componentes compartidos (@profesional/ui)</li>
                <li>• Tipos compartidos (@profesional/contracts)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Backend (NestJS)</CardTitle>
              <CardDescription>
                API REST con Node.js y TypeScript
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                La API incluye:
              </p>
              <ul className="text-sm space-y-2">
                <li>• NestJS con decoradores</li>
                <li>• Validación con Zod</li>
                <li>• Tipos compartidos</li>
                <li>• Configuración unificada</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ejemplo de Usuario</CardTitle>
            <CardDescription>
              Datos usando el esquema compartido de @profesional/contracts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Nombre:</strong> {user.name}</p>
              <p><strong>Creado:</strong> {user.createdAt.toLocaleDateString()}</p>
            </div>
            <Button className="mt-4">
              Acción de Ejemplo
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
