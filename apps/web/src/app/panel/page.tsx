"use client";

import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@profesional/ui";
import {
  CheckCircle,
  CreditCard,
  FileText,
  MessageCircle,
  User,
  Video,
} from "lucide-react";
import { useState } from "react";

const tabs = [
  { id: "requests", label: "Mis Solicitudes", icon: FileText },
  { id: "messages", label: "Mensajes", icon: MessageCircle },
  { id: "payments", label: "Pagos", icon: CreditCard },
  { id: "profile", label: "Mi Perfil", icon: User },
];

export default function PanelPage() {
  const [activeTab, setActiveTab] = useState("requests");

  const renderTabContent = () => {
    switch (activeTab) {
      case "requests":
        return <RequestsTab />;
      case "messages":
        return <MessagesTab />;
      case "payments":
        return <PaymentsTab />;
      case "profile":
        return <ProfileTab />;
      default:
        return <RequestsTab />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />

      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Panel de Control</h1>
            <p className="text-muted-foreground">
              Gestiona tus solicitudes, mensajes y perfil
            </p>
          </div>
          <Button>Nueva Solicitud</Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">
                    Solicitudes Activas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">28</p>
                  <p className="text-sm text-muted-foreground">Completadas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <MessageCircle className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-sm text-muted-foreground">
                    Mensajes Sin Leer
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">$45,000</p>
                  <p className="text-sm text-muted-foreground">
                    Total Invertido
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b">
          <nav className="flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">{renderTabContent()}</div>
      </div>
    </div>
  );
}

// Tab Components
function RequestsTab() {
  const requests = [
    {
      id: "1",
      title: "Desarrollo de sitio web corporativo",
      professional: "Juan Pérez",
      status: "in_progress",
      date: "2025-01-15",
      amount: 25000,
    },
    {
      id: "2",
      title: "Diseño de identidad visual",
      professional: "María González",
      status: "pending",
      date: "2025-01-18",
      amount: 18000,
    },
    {
      id: "3",
      title: "Consultoría SEO",
      professional: "Carlos López",
      status: "completed",
      date: "2025-01-10",
      amount: 12000,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
            Pendiente
          </span>
        );
      case "in_progress":
        return (
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
            En Progreso
          </span>
        );
      case "completed":
        return (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
            Completado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {requests.map(request => (
        <Card key={request.id}>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{request.title}</h3>
                <p className="text-muted-foreground">
                  Profesional: {request.professional}
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <span>
                    Fecha: {new Date(request.date).toLocaleDateString()}
                  </span>
                  <span>Monto: ARS ${request.amount.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {getStatusBadge(request.status)}
                <Button variant="outline" size="sm">
                  Ver Detalles
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function MessagesTab() {
  const conversations = [
    {
      id: "1",
      professional: "Juan Pérez",
      lastMessage: "El proyecto está avanzando según lo planeado...",
      time: "10:30 AM",
      unread: 2,
    },
    {
      id: "2",
      professional: "María González",
      lastMessage: "Envié las propuestas de diseño para tu revisión",
      time: "Ayer",
      unread: 0,
    },
    {
      id: "3",
      professional: "Carlos López",
      lastMessage: "Perfecto, quedó excelente el trabajo final",
      time: "Hace 2 días",
      unread: 0,
    },
  ];

  return (
    <div className="space-y-4">
      {conversations.map(conv => (
        <Card
          key={conv.id}
          className="hover:shadow-sm transition-shadow cursor-pointer"
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {conv.professional
                      .split(" ")
                      .map(n => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium">{conv.professional}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {conv.lastMessage}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-xs text-muted-foreground">
                  {conv.time}
                </span>
                {conv.unread > 0 && (
                  <span className="bg-primary text-primary-foreground w-5 h-5 rounded-full text-xs flex items-center justify-center">
                    {conv.unread}
                  </span>
                )}
                <Button variant="ghost" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function PaymentsTab() {
  const payments = [
    {
      id: "1",
      description: "Desarrollo sitio web - Juan Pérez",
      amount: 25000,
      status: "paid",
      date: "2025-01-15",
      method: "Mercado Pago",
    },
    {
      id: "2",
      description: "Consultoría SEO - Carlos López",
      amount: 12000,
      status: "paid",
      date: "2025-01-10",
      method: "Transferencia",
    },
    {
      id: "3",
      description: "Diseño identidad - María González",
      amount: 18000,
      status: "pending",
      date: "2025-01-18",
      method: "Mercado Pago",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Balance Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">ARS $55,000</p>
            <p className="text-sm text-muted-foreground">
              Invertido en proyectos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Próximo Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">ARS $18,000</p>
            <p className="text-sm text-muted-foreground">
              Vence el 25 de Enero
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Pagos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payments.map(payment => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h4 className="font-medium">{payment.description}</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(payment.date).toLocaleDateString()} •{" "}
                    {payment.method}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    ARS ${payment.amount.toLocaleString()}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      payment.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {payment.status === "paid" ? "Pagado" : "Pendiente"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileTab() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre completo</label>
              <input
                type="text"
                defaultValue="Cliente Ejemplo"
                className="w-full p-2 border rounded-md bg-background"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                defaultValue="cliente@example.com"
                className="w-full p-2 border rounded-md bg-background"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Teléfono</label>
              <input
                type="tel"
                defaultValue="+54 9 11 1234-5678"
                className="w-full p-2 border rounded-md bg-background"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Ubicación</label>
              <input
                type="text"
                defaultValue="Capital Federal, Argentina"
                className="w-full p-2 border rounded-md bg-background"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferencias</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Categorías de Interés
              </label>
              <div className="space-y-2">
                {[
                  "Desarrollo Web",
                  "Diseño Gráfico",
                  "Marketing Digital",
                  "Consultoría",
                ].map(category => (
                  <label key={category} className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Notificaciones</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Nuevos mensajes</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Actualizaciones de proyectos</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Newsletter semanal</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline">Cancelar</Button>
        <Button>Guardar Cambios</Button>
      </div>
    </div>
  );
}
