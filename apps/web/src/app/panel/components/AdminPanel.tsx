"use client";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@profesional/ui";
import {
  BarChart3,
  Calendar,
  DollarSign,
  Settings,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/auth/auth-store";

interface AdminPanelProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

const tabs = [
  { id: "overview", label: "Resumen", icon: BarChart3 },
  { id: "users", label: "Usuarios", icon: Users },
  { id: "professionals", label: "Profesionales", icon: UserCheck },
  { id: "bookings", label: "Citas", icon: Calendar },
  { id: "payments", label: "Pagos", icon: DollarSign },
  { id: "settings", label: "Configuración", icon: Settings },
];

export default function AdminPanel({ user }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const { tokens } = useAuthStore();
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalProfessionals: 0,
    totalClients: 0,
    totalBookings: 0,
    totalRevenue: 0,
    recentBookings: [],
    recentUsers: [],
  });
  const [loading, setLoading] = useState(true);

  // Fetch admin dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!tokens?.accessToken) {
        console.warn("No access token available");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch users data
        const usersResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/users`,
          {
            headers: {
              Authorization: `Bearer ${tokens.accessToken}`,
            },
          }
        );

        // Fetch bookings data
        const bookingsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/bookings`,
          {
            headers: {
              Authorization: `Bearer ${tokens.accessToken}`,
            },
          }
        );

        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          const professionals = usersData.filter(
            (u: any) => u.role === "PROFESSIONAL"
          );
          const clients = usersData.filter((u: any) => u.role === "CLIENT");

          setDashboardData(prev => ({
            ...prev,
            totalUsers: usersData.length,
            totalProfessionals: professionals.length,
            totalClients: clients.length,
            recentUsers: usersData.slice(0, 5),
          }));
        }

        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          const totalRevenue = bookingsData
            .filter((b: any) => b.status === "COMPLETED")
            .reduce((sum: number, b: any) => sum + Number(b.price), 0);

          setDashboardData(prev => ({
            ...prev,
            totalBookings: bookingsData.length,
            totalRevenue,
            recentBookings: bookingsData.slice(0, 5),
          }));
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [tokens?.accessToken]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab data={dashboardData} loading={loading} />;
      case "users":
        return <UsersTab users={dashboardData.recentUsers} />;
      case "professionals":
        return <ProfessionalsTab />;
      case "bookings":
        return <BookingsTab bookings={dashboardData.recentBookings} />;
      case "payments":
        return <PaymentsTab revenue={dashboardData.totalRevenue} />;
      case "settings":
        return <SettingsTab />;
      default:
        return <OverviewTab data={dashboardData} loading={loading} />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <p className="text-muted-foreground">
            Bienvenido/a {user.name}, administra la plataforma
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">Exportar Datos</Button>
          <Button>Nuevo Usuario</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{dashboardData.totalUsers}</p>
                <p className="text-sm text-muted-foreground">
                  Usuarios Totales
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {dashboardData.totalProfessionals}
                </p>
                <p className="text-sm text-muted-foreground">Profesionales</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {dashboardData.totalBookings}
                </p>
                <p className="text-sm text-muted-foreground">Citas Totales</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  ${dashboardData.totalRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Ingresos Totales
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
  );
}

// Tab Components for Admin Panel
function OverviewTab({ data, loading }: { data: any; loading: boolean }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Cargando datos del dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Estado del Sistema</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">API: Operativo</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Base de Datos: Conectada</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Pagos: Funcionando</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Nuevos Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentUsers.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No hay usuarios recientes
                </p>
              ) : (
                data.recentUsers.map((user: any) => (
                  <div
                    key={user.id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.role === "PROFESSIONAL"
                          ? "bg-blue-100 text-blue-800"
                          : user.role === "CLIENT"
                            ? "bg-green-100 text-green-800"
                            : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {user.role === "PROFESSIONAL"
                        ? "Profesional"
                        : user.role === "CLIENT"
                          ? "Cliente"
                          : "Admin"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Citas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentBookings.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No hay citas recientes
                </p>
              ) : (
                data.recentBookings.map((booking: any) => (
                  <div
                    key={booking.id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">
                        {booking.client?.name} → {booking.professional?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(booking.scheduledAt).toLocaleDateString(
                          "es-AR"
                        )}
                      </p>
                    </div>
                    <span className="font-medium">
                      ${Number(booking.price).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function UsersTab({ users }: { users: any[] }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Gestión de Usuarios</h3>
        <Button>Agregar Usuario</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-4">Usuario</th>
                  <th className="text-left p-4">Email</th>
                  <th className="text-left p-4">Rol</th>
                  <th className="text-left p-4">Fecha de Registro</th>
                  <th className="text-left p-4">Estado</th>
                  <th className="text-left p-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: any) => (
                  <tr key={user.id} className="border-b">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ID: {user.id.slice(0, 8)}...
                        </p>
                      </div>
                    </td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.role === "PROFESSIONAL"
                            ? "bg-blue-100 text-blue-800"
                            : user.role === "CLIENT"
                              ? "bg-green-100 text-green-800"
                              : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {user.role === "PROFESSIONAL"
                          ? "Profesional"
                          : user.role === "CLIENT"
                            ? "Cliente"
                            : "Admin"}
                      </span>
                    </td>
                    <td className="p-4">
                      {new Date(user.createdAt).toLocaleDateString("es-AR")}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        Activo
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                        <Button variant="outline" size="sm">
                          Ver
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProfessionalsTab() {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <UserCheck size={48} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold mb-2">
          Gestión de profesionales próximamente
        </h3>
        <p className="text-gray-600">
          Aquí podrás aprobar, rechazar y gestionar perfiles profesionales
        </p>
      </CardContent>
    </Card>
  );
}

function BookingsTab({ bookings }: { bookings: any[] }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Gestión de Citas</h3>
        <Button variant="outline">Exportar</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-4">Cliente</th>
                  <th className="text-left p-4">Profesional</th>
                  <th className="text-left p-4">Fecha</th>
                  <th className="text-left p-4">Precio</th>
                  <th className="text-left p-4">Estado</th>
                  <th className="text-left p-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking: any) => (
                  <tr key={booking.id} className="border-b">
                    <td className="p-4">{booking.client?.name || "N/A"}</td>
                    <td className="p-4">
                      {booking.professional?.name || "N/A"}
                    </td>
                    <td className="p-4">
                      {new Date(booking.scheduledAt).toLocaleDateString(
                        "es-AR"
                      )}
                    </td>
                    <td className="p-4">
                      ${Number(booking.price).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          booking.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "CONFIRMED"
                              ? "bg-blue-100 text-blue-800"
                              : booking.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {booking.status === "COMPLETED"
                          ? "Completada"
                          : booking.status === "CONFIRMED"
                            ? "Confirmada"
                            : booking.status === "PENDING"
                              ? "Pendiente"
                              : booking.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <Button variant="outline" size="sm">
                        Ver Detalles
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PaymentsTab({ revenue }: { revenue: number }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Pagos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold">${revenue.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Ingresos Totales</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">8.5%</p>
              <p className="text-sm text-muted-foreground">
                Comisión Plataforma
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                ${Math.round(revenue * 0.085).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Ingresos de la Plataforma
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-8 text-center">
          <DollarSign size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">
            Detalles de pagos próximamente
          </h3>
          <p className="text-gray-600">
            Aquí podrás ver transacciones detalladas y gestionar reembolsos
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuración de la Plataforma</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Registro de nuevos usuarios</h4>
              <p className="text-sm text-muted-foreground">
                Permitir que nuevos usuarios se registren en la plataforma
              </p>
            </div>
            <div className="w-11 h-6 bg-primary rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">
                Aprobación manual de profesionales
              </h4>
              <p className="text-sm text-muted-foreground">
                Requiere aprobación manual para nuevos perfiles profesionales
              </p>
            </div>
            <div className="w-11 h-6 bg-primary rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Notificaciones por email</h4>
              <p className="text-sm text-muted-foreground">
                Enviar notificaciones automáticas a usuarios
              </p>
            </div>
            <div className="w-11 h-6 bg-gray-200 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-8 text-center">
          <Settings size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">
            Más configuraciones próximamente
          </h3>
          <p className="text-gray-600">
            Configuraciones avanzadas de la plataforma estarán disponibles
            próximamente
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
