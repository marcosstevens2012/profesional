"use client";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  Switch,
} from "@/components/ui";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  useAcceptMeeting,
  useProfessionalDashboard,
} from "@/hooks/useProfessionalBookings";
import {
  useActiveStatus,
  useBookingStats,
  useMyProfile,
  useMyReviews,
  useMyReviewStats,
  useProfileStats,
  useRevenueStats,
  useToggleActiveStatus,
} from "@/hooks/useProfessionalProfile";
import { useAuth } from "@/lib/auth/auth-hooks";
import {
  AlertCircle,
  Calendar,
  DollarSign,
  Mail,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  const { user: authUser } = useAuth();

  // Use new hooks
  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const { data: activeStatusData } = useActiveStatus();
  const toggleActive = useToggleActiveStatus();
  const { data: bookingStats } = useBookingStats();
  const { data: revenueStats } = useRevenueStats();
  const { data: profileStatsData } = useProfileStats();
  const dashboardData = useProfessionalDashboard();

  const isActive = activeStatusData?.isActive ?? false;
  const isEmailVerified = authUser?.status === "ACTIVE";

  const handleToggleActive = () => {
    toggleActive.mutate();
  };

  // Mostrar alerta si el email no está verificado
  if (!isEmailVerified) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Mail className="h-8 w-8 text-amber-600" />
              <CardTitle className="text-amber-900">
                Verificación de Email Pendiente
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Alert className="border-amber-300 bg-white">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <p className="mb-4">
                  Necesitás verificar tu email <strong>{user.email}</strong>{" "}
                  para acceder a tu panel profesional.
                </p>
                <p className="text-sm text-gray-600">
                  Revisá tu bandeja de entrada o spam. Si no recibiste el email,
                  podés solicitar uno nuevo desde la página de onboarding.
                </p>
              </AlertDescription>
            </Alert>
            <div className="mt-6">
              <Link href="/onboarding">
                <Button className="w-full sm:w-auto">
                  <Mail className="mr-2 h-4 w-4" />
                  Ir a Verificación
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Verificar si el perfil profesional está completo
  const isProfileIncomplete =
    profile &&
    (!profile.bio ||
      !profile.description ||
      profile.bio.trim() === "" ||
      profile.description.trim() === "");

  // Mostrar alerta si el perfil está incompleto
  if (isEmailVerified && isProfileIncomplete && !profileLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <CardTitle className="text-blue-900">
                Completá tu Perfil Profesional
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Alert className="border-blue-300 bg-white">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <p className="mb-4">
                  Tu email está verificado, pero necesitás completar tu perfil
                  profesional para comenzar a recibir consultas.
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Por favor, completá la siguiente información:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {(!profile?.bio || profile.bio.trim() === "") && (
                    <li>Biografía breve</li>
                  )}
                  {(!profile?.description ||
                    profile.description.trim() === "") && (
                    <li>Descripción detallada de tus servicios</li>
                  )}
                </ul>
              </AlertDescription>
            </Alert>
            <div className="mt-6">
              <Link href="/onboarding">
                <Button className="w-full sm:w-auto">
                  <Users className="mr-2 h-4 w-4" />
                  Completar Perfil
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = {
    totalAppointments: bookingStats?.totalBookings ?? 0,
    monthlyEarnings: revenueStats?.revenueThisMonth ?? 0,
    totalClients: 0, // This would come from a separate endpoint
    averageRating: profileStatsData?.averageRating ?? 0,
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "appointments":
        return (
          <AppointmentsTab
            waitingBookings={dashboardData.waitingBookings}
            readyMeetings={dashboardData.meetings}
            loading={dashboardData.isLoading}
          />
        );
      case "clients":
        return <ClientsTab />;
      case "earnings":
        return <EarningsTab stats={stats} />;
      case "reviews":
        return <ReviewsTab />;
      case "profile":
        return (
          <ProfileTab user={user} profile={profile} loading={profileLoading} />
        );
      default:
        return (
          <AppointmentsTab
            waitingBookings={dashboardData.waitingBookings}
            readyMeetings={dashboardData.meetings}
            loading={dashboardData.isLoading}
          />
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
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Label
              htmlFor="active-toggle"
              className="text-sm font-medium cursor-pointer"
            >
              {isActive ? (
                <span className="text-green-600">🟢 Perfil Activo</span>
              ) : (
                <span className="text-gray-500">⚫ Perfil Inactivo</span>
              )}
            </Label>
            <Switch
              id="active-toggle"
              checked={isActive}
              onCheckedChange={handleToggleActive}
              disabled={toggleActive.isPending}
            />
          </div>
        </div>
      </div>

      {/* Status Info Alert */}
      {!isActive && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="text-amber-600 dark:text-amber-400 text-xl">⚠️</div>
            <div>
              <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                Tu perfil está inactivo
              </h3>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                No aparecerás en las búsquedas y no recibirás nuevas reservas.
                Activa tu perfil cuando estés listo para recibir clientes.
              </p>
            </div>
          </div>
        </div>
      )}

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
  waitingBookings,
  readyMeetings,
  loading,
}: {
  waitingBookings: any[];
  readyMeetings: any[];
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

  const hasContent = waitingBookings.length > 0 || readyMeetings.length > 0;

  if (!hasContent) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">
            No tienes consultas pendientes
          </h3>
          <p className="text-gray-600 mb-4">
            Las nuevas consultas aparecerán aquí cuando los clientes las
            reserven
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Waiting Bookings */}
      {waitingBookings.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Esperando Aceptación ({waitingBookings.length})
          </h3>
          <div className="space-y-4">
            {waitingBookings.map((booking: any) => (
              <BookingCard key={booking.id} booking={booking} type="waiting" />
            ))}
          </div>
        </div>
      )}

      {/* Ready Meetings */}
      {readyMeetings.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Listo para Unirse ({readyMeetings.length})
          </h3>
          <div className="space-y-4">
            {readyMeetings.map((booking: any) => (
              <BookingCard key={booking.id} booking={booking} type="ready" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BookingCard({
  booking,
  type,
}: {
  booking: any;
  type: "waiting" | "ready";
}) {
  const acceptMeeting = useAcceptMeeting();
  const router = useRouter();

  const handleAccept = async () => {
    try {
      await acceptMeeting.mutateAsync(booking.id);
    } catch (error) {
      console.error("Error accepting meeting:", error);
    }
  };

  const handleJoinMeeting = () => {
    router.push(`/bookings/${booking.id}`);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold">
              Consulta con{" "}
              {booking.client?.profile?.firstName ||
                booking.client?.email ||
                "Cliente"}
            </h4>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>
                {new Date(booking.scheduledFor).toLocaleDateString("es-AR")}
              </span>
              <span>
                {new Date(booking.scheduledFor).toLocaleTimeString("es-AR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              {booking.payment?.amount && (
                <span>
                  ARS ${Number(booking.payment.amount).toLocaleString()}
                </span>
              )}
              {booking.payment?.status === "APPROVED" && (
                <span className="text-green-600 font-medium">✓ Pagado</span>
              )}
            </div>
            {booking.notes && (
              <p className="text-sm text-muted-foreground">
                Notas: {booking.notes}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {type === "waiting" ? (
              <Button
                size="sm"
                onClick={handleAccept}
                disabled={acceptMeeting.isPending}
              >
                {acceptMeeting.isPending ? "Aceptando..." : "Aceptar"}
              </Button>
            ) : (
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={handleJoinMeeting}
              >
                Unirse a la Reunión
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ClientsTab() {
  // This would use a dedicated hook to fetch client data
  // For now, show placeholder
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <Users size={48} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold mb-2">Sección de Clientes</h3>
        <p className="text-gray-600">
          Aquí podrás ver el historial de tus clientes y sus consultas
        </p>
      </CardContent>
    </Card>
  );
}

function EarningsTab({
  stats,
}: {
  stats: {
    totalAppointments: number;
    monthlyEarnings: number;
    totalClients: number;
    averageRating: number;
  };
}) {
  const { data: revenueStats, isLoading } = useRevenueStats();
  const { data: bookingStats } = useBookingStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  const completedBookings = bookingStats?.completedBookings ?? 0;
  const totalRevenue = revenueStats?.totalRevenue ?? 0;
  const averageValue = revenueStats?.averageSessionValue ?? 0;

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
            <p className="text-2xl font-bold">{completedBookings}</p>
            <p className="text-sm text-muted-foreground">
              Consultas Completadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <p className="text-2xl font-bold">
              ${averageValue.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              Promedio por Consulta
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumen de Ingresos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 border rounded">
              <div>
                <p className="font-medium">Ingresos Totales</p>
                <p className="text-sm text-muted-foreground">
                  Acumulado histórico
                </p>
              </div>
              <p className="font-bold text-green-600">
                ${totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="flex justify-between items-center p-3 border rounded">
              <div>
                <p className="font-medium">Ingresos Este Mes</p>
                <p className="text-sm text-muted-foreground">Mes actual</p>
              </div>
              <p className="font-bold text-green-600">
                ${(revenueStats?.revenueThisMonth ?? 0).toLocaleString()}
              </p>
            </div>
            <div className="flex justify-between items-center p-3 border rounded">
              <div>
                <p className="font-medium">Mes Anterior</p>
                <p className="text-sm text-muted-foreground">
                  Para comparación
                </p>
              </div>
              <p className="font-bold text-gray-600">
                ${(revenueStats?.revenueLastMonth ?? 0).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ReviewsTab() {
  const { data: reviewStats, isLoading } = useMyReviewStats();
  const { data: reviewsData } = useMyReviews({ limit: 10 });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando reseñas...</p>
        </div>
      </div>
    );
  }

  const hasReviews = (reviewsData?.data.length ?? 0) > 0;

  if (!hasReviews) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Star size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">Aún no tienes reseñas</h3>
          <p className="text-gray-600">
            Las reseñas de tus clientes aparecerán aquí
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Star className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
            <p className="text-2xl font-bold">
              {reviewStats?.averageRating.toFixed(1) ?? "0.0"}
            </p>
            <p className="text-sm text-muted-foreground">
              Calificación Promedio
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold">
              {reviewStats?.totalReviews ?? 0}
            </p>
            <p className="text-sm text-muted-foreground">Total de Reseñas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold">
              {reviewStats?.ratingDistribution[5] ?? 0}
            </p>
            <p className="text-sm text-muted-foreground">
              Reseñas de 5 Estrellas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Reseñas Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reviewsData?.data.map((review: any) => (
              <div
                key={review.id}
                className="border-b last:border-0 pb-4 last:pb-0"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium">{review.clientName}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString("es-AR")}
                  </p>
                </div>
                {review.comment && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {review.comment}
                  </p>
                )}
                {review.response && (
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded mt-2">
                    <p className="text-sm font-medium mb-1">Tu respuesta:</p>
                    <p className="text-sm text-muted-foreground">
                      {review.response}
                    </p>
                  </div>
                )}
                {!review.hasResponse && (
                  <Button variant="outline" size="sm" className="mt-2">
                    Responder
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileTab({
  user,
  profile,
  loading,
}: {
  user: any;
  profile: any;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando perfil...</p>
        </div>
      </div>
    );
  }

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
          {profile?.serviceCategory?.name && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Especialidad</label>
              <input
                type="text"
                defaultValue={profile.serviceCategory.name}
                className="w-full p-2 border rounded-md bg-background"
                readOnly
              />
            </div>
          )}
          {profile?.standardDuration && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Duración estándar</label>
              <input
                type="text"
                defaultValue={`${profile.standardDuration} minutos`}
                className="w-full p-2 border rounded-md bg-background"
                readOnly
              />
            </div>
          )}
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

      {profile?.bio && (
        <Card>
          <CardHeader>
            <CardTitle>Biografía</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{profile.bio}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
