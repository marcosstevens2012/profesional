"use client";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { useAuthStore } from "@/lib/auth/auth-store";
import { Calendar, DollarSign, Star, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";

interface ProfessionalPanelProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

const tabs = [
  { id: "appointments", label: "Consultas", icon: Calendar },
  { id: "clients", label: "Clientes", icon: Users },
  { id: "earnings", label: "Ingresos", icon: DollarSign },
  { id: "reviews", label: "Reseñas", icon: Star },
  { id: "profile", label: "Mi Perfil", icon: Users },
];

export default function ProfessionalPanel({ user }: ProfessionalPanelProps) {
  const [activeTab, setActiveTab] = useState("appointments");
  const { tokens } = useAuthStore();
  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    monthlyEarnings: 0,
    totalClients: 0,
    averageRating: 0,
  });

  // Fetch professional data from API
  useEffect(() => {
    const fetchProfessionalData = async () => {
      if (!tokens?.accessToken) {
        console.warn("No access token available");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch professional profile
        const profileResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/profiles/me`,
          {
            headers: {
              Authorization: `Bearer ${tokens.accessToken}`,
            },
          }
        );

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setProfile(profileData);
        }

        // Fetch appointments
        const appointmentsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/bookings`,
          {
            headers: {
              Authorization: `Bearer ${tokens.accessToken}`,
            },
          }
        );

        if (appointmentsResponse.ok) {
          const appointmentsData = await appointmentsResponse.json();

          // Filter appointments for this professional user
          // Appointments are linked via professional.userId to our logged-in user.id
          const userAppointments = appointmentsData.filter(
            (apt: any) => apt.professional?.userId === user.id
          );

          setAppointments(userAppointments);

          // Calculate stats
          const totalAppointments = userAppointments.length;
          const completedAppointments = userAppointments.filter(
            (apt: any) => apt.status === "COMPLETED"
          );
          const monthlyEarnings = completedAppointments.reduce(
            (sum: number, apt: any) => sum + Number(apt.price),
            0
          );
          const uniqueClients = new Set(
            userAppointments.map((apt: any) => apt.clientId)
          ).size;

          setStats({
            totalAppointments,
            monthlyEarnings,
            totalClients: uniqueClients,
            averageRating: 4.8, // This would come from reviews API
          });
        }
      } catch (error) {
        console.error("Error fetching professional data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionalData();
  }, [user.id, tokens?.accessToken]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "appointments":
        return (
          <AppointmentsTab appointments={appointments} loading={loading} />
        );
      case "clients":
        return <ClientsTab appointments={appointments} />;
      case "earnings":
        return <EarningsTab appointments={appointments} stats={stats} />;
      case "reviews":
        return <ReviewsTab />;
      case "profile":
        return <ProfileTab user={user} profile={profile} />;
      default:
        return (
          <AppointmentsTab appointments={appointments} loading={loading} />
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Panel Profesional</h1>
          <p className="text-muted-foreground">
            Bienvenido/a {user.name}, gestiona tu práctica profesional
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalAppointments}</p>
                <p className="text-sm text-muted-foreground">
                  Consultas Totales
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  ${stats.monthlyEarnings.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Ingresos del Mes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalClients}</p>
                <p className="text-sm text-muted-foreground">Clientes Únicos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {stats.averageRating.toFixed(1)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Calificación Promedio
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
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

// Tab Components for Professional Panel
function AppointmentsTab({
  appointments,
  loading,
}: {
  appointments: any[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando consultas...</p>
        </div>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">
            No tienes consultas programadas
          </h3>
          <p className="text-gray-600 mb-4">
            Las nuevas consultas aparecerán aquí cuando los clientes las
            reserven
          </p>
        </CardContent>
      </Card>
    );
  }

  const upcomingAppointments = appointments.filter(
    (apt: any) => new Date(apt.scheduledAt) > new Date()
  );

  const recentAppointments = appointments
    .filter((apt: any) => new Date(apt.scheduledAt) <= new Date())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Upcoming Appointments */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Próximas Consultas ({upcomingAppointments.length})
        </h3>
        {upcomingAppointments.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No tienes consultas próximas programadas
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {upcomingAppointments.map((appointment: any) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                isUpcoming={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recent Appointments */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Consultas Recientes</h3>
        <div className="space-y-4">
          {recentAppointments.map((appointment: any) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              isUpcoming={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function AppointmentCard({
  appointment,
  isUpcoming,
}: {
  appointment: any;
  isUpcoming: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold">
              Consulta con {appointment.client?.name || "Cliente"}
            </h4>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>
                {new Date(appointment.scheduledAt).toLocaleDateString("es-AR")}
              </span>
              <span>
                {new Date(appointment.scheduledAt).toLocaleTimeString("es-AR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span>ARS ${Number(appointment.price).toLocaleString()}</span>
            </div>
            {appointment.notes && (
              <p className="text-sm text-muted-foreground">
                Notas: {appointment.notes}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                appointment.status === "COMPLETED"
                  ? "bg-green-100 text-green-800"
                  : appointment.status === "CONFIRMED"
                    ? "bg-blue-100 text-blue-800"
                    : appointment.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
              }`}
            >
              {appointment.status === "COMPLETED"
                ? "Completada"
                : appointment.status === "CONFIRMED"
                  ? "Confirmada"
                  : appointment.status === "PENDING"
                    ? "Pendiente"
                    : appointment.status}
            </span>
            {isUpcoming && (
              <Button variant="outline" size="sm">
                Ver Detalles
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ClientsTab({ appointments }: { appointments: any[] }) {
  const uniqueClients = appointments.reduce((acc: any[], appointment: any) => {
    if (
      appointment.client &&
      !acc.find((c) => c.id === appointment.client.id)
    ) {
      acc.push({
        ...appointment.client,
        lastAppointment: appointment.scheduledAt,
        totalAppointments: appointments.filter(
          (a) => a.client?.id === appointment.client.id
        ).length,
      });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Mis Clientes ({uniqueClients.length})
        </h3>
      </div>

      {uniqueClients.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Users size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">
              Aún no tienes clientes
            </h3>
            <p className="text-gray-600">
              Los clientes aparecerán aquí después de sus primeras consultas
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uniqueClients.map((client: any) => (
            <Card key={client.id}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <h4 className="font-semibold">{client.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {client.email}
                  </p>
                  <div className="text-sm">
                    <p>Consultas: {client.totalAppointments}</p>
                    <p>
                      Última consulta:{" "}
                      {new Date(client.lastAppointment).toLocaleDateString(
                        "es-AR"
                      )}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Ver Historial
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function EarningsTab({
  appointments,
  stats,
}: {
  appointments: any[];
  stats: any;
}) {
  const completedAppointments = appointments.filter(
    (apt) => apt.status === "COMPLETED"
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold">
              ${stats.monthlyEarnings.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Ingresos del Mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold">{completedAppointments.length}</p>
            <p className="text-sm text-muted-foreground">
              Consultas Completadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <p className="text-2xl font-bold">
              $
              {completedAppointments.length > 0
                ? Math.round(
                    stats.monthlyEarnings / completedAppointments.length
                  ).toLocaleString()
                : 0}
            </p>
            <p className="text-sm text-muted-foreground">
              Promedio por Consulta
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Ingresos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {completedAppointments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No hay ingresos registrados aún
              </p>
            ) : (
              completedAppointments.map((appointment: any) => (
                <div
                  key={appointment.id}
                  className="flex justify-between items-center p-3 border rounded"
                >
                  <div>
                    <p className="font-medium">
                      {appointment.client?.name || "Cliente"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(appointment.scheduledAt).toLocaleDateString(
                        "es-AR"
                      )}
                    </p>
                  </div>
                  <p className="font-bold text-green-600">
                    +${Number(appointment.price).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ReviewsTab() {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <Star size={48} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold mb-2">
          Sistema de reseñas próximamente
        </h3>
        <p className="text-gray-600">
          Aquí podrás ver las reseñas y calificaciones de tus clientes
        </p>
      </CardContent>
    </Card>
  );
}

function ProfileTab({ user, profile }: { user: any; profile: any }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nombre completo</label>
            <input
              type="text"
              defaultValue={user.name}
              className="w-full p-2 border rounded-md bg-background"
              readOnly
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              defaultValue={user.email}
              className="w-full p-2 border rounded-md bg-background"
              readOnly
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Especialidad</label>
            <input
              type="text"
              defaultValue={profile?.serviceCategory?.name || "No especificada"}
              className="w-full p-2 border rounded-md bg-background"
              readOnly
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Precio por consulta</label>
            <input
              type="text"
              defaultValue={`ARS $${Number(profile?.pricePerHour || 0).toLocaleString()}`}
              className="w-full p-2 border rounded-md bg-background"
              readOnly
            />
          </div>
        </CardContent>
      </Card>

      {profile?.description && (
        <Card>
          <CardHeader>
            <CardTitle>Descripción Profesional</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{profile.description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
