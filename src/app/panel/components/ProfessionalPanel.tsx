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
  useProfessionalAllBookings,
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
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useMyProfile();
  const { data: activeStatusData } = useActiveStatus();
  const toggleActive = useToggleActiveStatus();
  const { data: bookingStats } = useBookingStats();
  const { data: revenueStats } = useRevenueStats();
  const { data: profileStatsData } = useProfileStats();

  // Debug logging
  console.log("🔍 ProfessionalPanel Debug:");
  console.log("User:", user);
  console.log("Auth User:", authUser);
  console.log("Profile:", profile);
  console.log("Profile Loading:", profileLoading);
  console.log("Profile Error:", profileError);
  console.log("Booking Stats:", bookingStats);
  console.log("Revenue Stats:", revenueStats);
  console.log("Profile Stats:", profileStatsData);

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
  // Solo verificar bio ya que description está en ProfessionalProfile
  const isProfileIncomplete =
    profile && (!profile.bio || profile.bio.trim() === "");

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
                    <li>Biografía breve de tu perfil profesional</li>
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
        return <AppointmentsTab />;
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
        return <AppointmentsTab />;
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
function AppointmentsTab() {
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Usar el nuevo hook para obtener todas las bookings
  const { data: allBookingsData, isLoading: allLoading } =
    useProfessionalAllBookings();

  console.log("📋 AppointmentsTab Debug:");
  console.log("All Bookings Data:", allBookingsData);
  console.log("All Loading:", allLoading);
  console.log("Bookings:", allBookingsData?.bookings);
  console.log("Count:", allBookingsData?.count);
  console.log("Grouped:", allBookingsData?.grouped);

  if (allLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando consultas...</p>
        </div>
      </div>
    );
  }

  const grouped = allBookingsData?.grouped || {};

  // Filtrar solo las que tienen pago (excluir pending_payment)
  const paidBookingsCount =
    (grouped.waiting_acceptance?.length || 0) +
    (grouped.confirmed?.length || 0) +
    (grouped.in_progress?.length || 0) +
    (grouped.completed?.length || 0);

  if (paidBookingsCount === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">
            No tienes consultas pagadas aún
          </h3>
          <p className="text-gray-600 mb-4">
            Las consultas pagadas aparecerán aquí cuando los clientes completen
            el pago
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleBookingClick = (booking: any) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  return (
    <>
      <div className="space-y-6">
        {/* NO mostrar Pending Payment - solo las que fueron pagadas */}

        {/* Waiting for Professional */}
        {grouped.waiting_acceptance &&
          grouped.waiting_acceptance.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-orange-600">
                Esperando tu Aceptación ({grouped.waiting_acceptance.length})
              </h3>
              <div className="space-y-4">
                {grouped.waiting_acceptance.map((booking: any) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    type="waiting"
                    onCardClick={() => handleBookingClick(booking)}
                  />
                ))}
              </div>
            </div>
          )}

        {/* Confirmed */}
        {grouped.confirmed && grouped.confirmed.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-600">
              Confirmadas ({grouped.confirmed.length})
            </h3>
            <div className="space-y-4">
              {grouped.confirmed.map((booking: any) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  type="ready"
                  onCardClick={() => handleBookingClick(booking)}
                />
              ))}
            </div>
          </div>
        )}

        {/* In Progress */}
        {grouped.in_progress && grouped.in_progress.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-600">
              En Progreso ({grouped.in_progress.length})
            </h3>
            <div className="space-y-4">
              {grouped.in_progress.map((booking: any) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  type="in_progress"
                  onCardClick={() => handleBookingClick(booking)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Completed */}
        {grouped.completed && grouped.completed.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-600">
              Completadas ({grouped.completed.length})
            </h3>
            <div className="space-y-4">
              {grouped.completed.map((booking: any) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  type="completed"
                  onCardClick={() => handleBookingClick(booking)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Cancelled */}
        {grouped.cancelled && grouped.cancelled.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-600">
              Canceladas ({grouped.cancelled.length})
            </h3>
            <div className="space-y-4">
              {grouped.cancelled.map((booking: any) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  type="cancelled"
                  onCardClick={() => handleBookingClick(booking)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal de detalles */}
      {showDetailModal && selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedBooking(null);
          }}
        />
      )}
    </>
  );
}

function BookingCard({
  booking,
  type,
  onCardClick,
}: {
  booking: any;
  type: "waiting" | "ready" | "in_progress" | "completed" | "cancelled";
  onCardClick?: () => void;
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

  const handleJoinMeeting = async () => {
    // Redirigir a la página de la reunión donde se creará/accederá a la sala Jitsi
    router.push(`/bookings/${booking.id}/meeting`);
  };

  const getStatusBadge = () => {
    switch (type) {
      case "waiting":
        return (
          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
            Esperando Aceptación
          </span>
        );
      case "ready":
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
            Confirmada
          </span>
        );
      case "in_progress":
        return (
          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
            En Progreso
          </span>
        );
      case "completed":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
            Completada
          </span>
        );
      case "cancelled":
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
            Cancelada
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={(e) => {
        // Solo hacer click si no se clickeó en un botón
        if (!(e.target as HTMLElement).closest("button") && onCardClick) {
          onCardClick();
        }
      }}
    >
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold">
                Consulta con{" "}
                {booking.client?.profile?.firstName &&
                booking.client?.profile?.lastName
                  ? `${booking.client.profile.firstName} ${booking.client.profile.lastName}`
                  : booking.client?.email || "Cliente"}
              </h4>
              {getStatusBadge()}
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>
                📅 {new Date(booking.scheduledFor).toLocaleDateString("es-AR")}
              </span>
              <span>
                🕐{" "}
                {new Date(booking.scheduledFor).toLocaleTimeString("es-AR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              {booking.duration && <span>⏱️ {booking.duration} min</span>}
            </div>
            <div className="flex items-center space-x-4 text-sm">
              {booking.payment?.amount && (
                <span className="font-medium text-green-600">
                  💰 ARS ${Number(booking.payment.amount).toLocaleString()}
                </span>
              )}
              {booking.payment?.status === "APPROVED" && (
                <span className="text-green-600 font-medium">✓ Pagado</span>
              )}
            </div>
            {booking.notes && (
              <p className="text-sm text-muted-foreground italic">
                📝 {booking.notes}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {type === "waiting" && (
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAccept();
                }}
                disabled={acceptMeeting.isPending}
              >
                {acceptMeeting.isPending ? "Aceptando..." : "Aceptar Consulta"}
              </Button>
            )}
            {(type === "ready" || type === "in_progress") && (
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={(e) => {
                  e.stopPropagation();
                  handleJoinMeeting();
                }}
              >
                🎥 Unirse a la Reunión
              </Button>
            )}
            {type === "completed" && (
              <span className="text-sm text-muted-foreground">
                Consulta finalizada
              </span>
            )}
            {type === "cancelled" && (
              <span className="text-sm text-muted-foreground">Cancelada</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Modal de detalles de la consulta
function BookingDetailModal({
  booking,
  onClose,
}: {
  booking: any;
  onClose: () => void;
}) {
  const router = useRouter();
  const acceptMeeting = useAcceptMeeting();

  const handleAccept = async () => {
    try {
      await acceptMeeting.mutateAsync(booking.id);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error accepting meeting:", error);
    }
  };

  const handleJoinMeeting = () => {
    router.push(`/bookings/${booking.id}/meeting`);
  };

  const getStatusText = () => {
    switch (booking.status) {
      case "PENDING_PAYMENT":
        return { text: "Pendiente de Pago", color: "text-yellow-600" };
      case "WAITING_FOR_PROFESSIONAL":
        return { text: "Esperando tu Aceptación", color: "text-orange-600" };
      case "CONFIRMED":
        return { text: "Confirmada", color: "text-blue-600" };
      case "IN_PROGRESS":
        return { text: "En Progreso", color: "text-purple-600" };
      case "COMPLETED":
        return { text: "Completada", color: "text-green-600" };
      case "CANCELLED":
        return { text: "Cancelada", color: "text-gray-600" };
      default:
        return { text: booking.status, color: "text-gray-600" };
    }
  };

  const status = getStatusText();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Detalles de la Consulta
              </h2>
              <span className={`text-sm font-medium ${status.color}`}>
                {status.text}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Cliente */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Cliente</h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="font-medium">
                  {booking.client?.profile?.firstName &&
                  booking.client?.profile?.lastName
                    ? `${booking.client.profile.firstName} ${booking.client.profile.lastName}`
                    : "Sin nombre"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {booking.client?.email}
                </p>
              </div>
            </div>

            {/* Fecha y Hora */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Fecha y Hora</h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">
                    {new Date(booking.scheduledFor).toLocaleDateString(
                      "es-AR",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Hora:{" "}
                  {new Date(booking.scheduledFor).toLocaleTimeString("es-AR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {booking.duration &&
                    ` - Duración: ${booking.duration} minutos`}
                </p>
              </div>
            </div>

            {/* Pago */}
            {booking.payment && (
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Información de Pago
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">
                      Monto:
                    </span>
                    <span className="font-semibold text-lg text-green-600">
                      ARS ${Number(booking.payment.amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">
                      Estado del pago:
                    </span>
                    <span
                      className={`font-medium ${
                        booking.payment.status === "APPROVED"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {booking.payment.status === "APPROVED"
                        ? "✓ Aprobado"
                        : "Pendiente"}
                    </span>
                  </div>
                  {booking.payment.paidAt && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Fecha de pago:
                      </span>
                      <span className="text-sm">
                        {new Date(booking.payment.paidAt).toLocaleDateString(
                          "es-AR"
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notas */}
            {booking.notes && (
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Notas del Cliente
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm">{booking.notes}</p>
                </div>
              </div>
            )}

            {/* ID de Reserva */}
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Información Adicional
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  ID de Reserva: {booking.id}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Creada:{" "}
                  {new Date(booking.createdAt).toLocaleDateString("es-AR")}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
            {booking.status === "WAITING_FOR_PROFESSIONAL" && (
              <Button onClick={handleAccept} disabled={acceptMeeting.isPending}>
                {acceptMeeting.isPending ? "Aceptando..." : "Aceptar Consulta"}
              </Button>
            )}
            {(booking.status === "CONFIRMED" ||
              booking.status === "IN_PROGRESS") && (
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={handleJoinMeeting}
              >
                🎥 Unirse a la Reunión
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
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
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form data when profile loads
  useState(() => {
    if (profile) {
      setFormData({
        // User Profile fields
        firstName: profile.user?.profile?.firstName || "",
        lastName: profile.user?.profile?.lastName || "",
        phone: profile.user?.profile?.phone || "",
        bio: profile.user?.profile?.bio || "",
        dateOfBirth: profile.user?.profile?.dateOfBirth || "",
        gender: profile.user?.profile?.gender || "",
        address: profile.user?.profile?.address || "",
        city: profile.user?.profile?.city || "",
        province: profile.user?.profile?.province || "",
        postalCode: profile.user?.profile?.postalCode || "",
        country: profile.user?.profile?.country || "Argentina",

        // Professional Profile fields
        name: profile.name || "",
        email: profile.email || user.email,
        description: profile.description || "",
        pricePerSession: profile.pricePerSession || "",
        standardDuration: profile.standardDuration || 60,
        tags: profile.tags?.join(", ") || "",

        // Social media
        website: profile.website || "",
        linkedIn: profile.linkedIn || "",
        instagram: profile.instagram || "",
        facebook: profile.facebook || "",
        twitter: profile.twitter || "",

        // Education & Experience
        education: profile.education || "",
        experience: profile.experience || "",
        specialties: profile.specialties?.join(", ") || "",
        languages: profile.languages?.join(", ") || "",
        yearsOfExperience: profile.yearsOfExperience || "",

        // Legal documents
        dni: profile.dni || "",
        cuitCuil: profile.cuitCuil || "",
        matricula: profile.matricula || "",
      });
    }
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Prepare data for API
      const updateData: any = {
        // User Profile fields
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        bio: formData.bio,
        dateOfBirth: formData.dateOfBirth || undefined,
        gender: formData.gender,
        address: formData.address,
        city: formData.city,
        province: formData.province,
        postalCode: formData.postalCode,
        country: formData.country,

        // Professional Profile fields
        name: formData.name,
        email: formData.email,
        description: formData.description,
        pricePerSession: formData.pricePerSession
          ? parseFloat(formData.pricePerSession)
          : undefined,
        standardDuration: formData.standardDuration
          ? parseInt(formData.standardDuration)
          : undefined,
        tags: formData.tags
          ? formData.tags
              .split(",")
              .map((t: string) => t.trim())
              .filter(Boolean)
          : [],

        // Social media
        website: formData.website || undefined,
        linkedIn: formData.linkedIn || undefined,
        instagram: formData.instagram || undefined,
        facebook: formData.facebook || undefined,
        twitter: formData.twitter || undefined,

        // Education & Experience
        education: formData.education || undefined,
        experience: formData.experience || undefined,
        specialties: formData.specialties
          ? formData.specialties
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean)
          : [],
        languages: formData.languages
          ? formData.languages
              .split(",")
              .map((l: string) => l.trim())
              .filter(Boolean)
          : [],
        yearsOfExperience: formData.yearsOfExperience
          ? parseInt(formData.yearsOfExperience)
          : undefined,

        // Legal documents
        dni: formData.dni || undefined,
        cuitCuil: formData.cuitCuil || undefined,
        matricula: formData.matricula || undefined,
      };

      // Call API to update profile
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/profiles/me`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar el perfil");
      }

      alert("Perfil actualizado correctamente");
      setIsEditing(false);
      window.location.reload(); // Reload to fetch updated data
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error al guardar el perfil. Por favor, intenta nuevamente.");
    } finally {
      setIsSaving(false);
    }
  };

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
      {/* Header with Edit Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mi Perfil Profesional</h2>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Editar Perfil</Button>
          )}
        </div>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <input
                type="text"
                value={formData.firstName || ""}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="w-full p-2 border rounded-md bg-background"
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Apellido</Label>
              <input
                type="text"
                value={formData.lastName || ""}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="w-full p-2 border rounded-md bg-background"
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email de Usuario</Label>
              <input
                type="email"
                value={user.email}
                className="w-full p-2 border rounded-md bg-gray-100"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label>Teléfono Personal</Label>
              <input
                type="tel"
                value={formData.phone || ""}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full p-2 border rounded-md bg-background"
                disabled={!isEditing}
                placeholder="+54 9 11 1234-5678"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha de Nacimiento</Label>
              <input
                type="date"
                value={
                  formData.dateOfBirth
                    ? new Date(formData.dateOfBirth).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  handleInputChange("dateOfBirth", e.target.value)
                }
                className="w-full p-2 border rounded-md bg-background"
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Género</Label>
              <select
                value={formData.gender || ""}
                onChange={(e) => handleInputChange("gender", e.target.value)}
                className="w-full p-2 border rounded-md bg-background"
                disabled={!isEditing}
              >
                <option value="">Seleccionar</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="No binario">No binario</option>
                <option value="Prefiero no decir">Prefiero no decir</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Biografía Personal</Label>
            <textarea
              value={formData.bio || ""}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              className="w-full p-2 border rounded-md bg-background min-h-[80px]"
              disabled={!isEditing}
              placeholder="Escribe una breve biografía personal..."
              maxLength={1000}
            />
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información Profesional</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nombre Profesional</Label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full p-2 border rounded-md bg-background"
                disabled={!isEditing}
                placeholder="Ej: Dr. Juan Pérez"
              />
            </div>
            <div className="space-y-2">
              <Label>Email Profesional</Label>
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full p-2 border rounded-md bg-background"
                disabled={!isEditing}
                placeholder="email@profesional.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Descripción Profesional</Label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full p-2 border rounded-md bg-background min-h-[120px]"
              disabled={!isEditing}
              placeholder="Describe tu experiencia, especialidades y enfoque profesional..."
              maxLength={2000}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Precio por Sesión (ARS)</Label>
              <input
                type="number"
                value={formData.pricePerSession || ""}
                onChange={(e) =>
                  handleInputChange("pricePerSession", e.target.value)
                }
                className="w-full p-2 border rounded-md bg-background"
                disabled={!isEditing}
                placeholder="25000"
                min="0"
                step="100"
              />
            </div>
            <div className="space-y-2">
              <Label>Duración Estándar (minutos)</Label>
              <input
                type="number"
                value={formData.standardDuration || ""}
                onChange={(e) =>
                  handleInputChange("standardDuration", e.target.value)
                }
                className="w-full p-2 border rounded-md bg-background"
                disabled={!isEditing}
                placeholder="60"
                min="15"
                step="15"
              />
            </div>
          </div>

          {profile?.serviceCategory?.name && (
            <div className="space-y-2">
              <Label>Especialidad</Label>
              <input
                type="text"
                value={profile.serviceCategory.name}
                className="w-full p-2 border rounded-md bg-gray-100"
                disabled
              />
              <p className="text-xs text-muted-foreground">
                Contacta al administrador para cambiar tu especialidad
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label>Tags / Palabras Clave</Label>
            <input
              type="text"
              value={formData.tags || ""}
              onChange={(e) => handleInputChange("tags", e.target.value)}
              className="w-full p-2 border rounded-md bg-background"
              disabled={!isEditing}
              placeholder="ansiedad, depresión, terapia cognitiva (separados por comas)"
            />
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle>Dirección</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Dirección Completa</Label>
            <input
              type="text"
              value={formData.address || ""}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className="w-full p-2 border rounded-md bg-background"
              disabled={!isEditing}
              placeholder="Calle y número"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Ciudad</Label>
              <input
                type="text"
                value={formData.city || ""}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="w-full p-2 border rounded-md bg-background"
                disabled={!isEditing}
                placeholder="Buenos Aires"
              />
            </div>
            <div className="space-y-2">
              <Label>Provincia</Label>
              <input
                type="text"
                value={formData.province || ""}
                onChange={(e) => handleInputChange("province", e.target.value)}
                className="w-full p-2 border rounded-md bg-background"
                disabled={!isEditing}
                placeholder="Capital Federal"
              />
            </div>
            <div className="space-y-2">
              <Label>Código Postal</Label>
              <input
                type="text"
                value={formData.postalCode || ""}
                onChange={(e) =>
                  handleInputChange("postalCode", e.target.value)
                }
                className="w-full p-2 border rounded-md bg-background"
                disabled={!isEditing}
                placeholder="1425"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>País</Label>
            <input
              type="text"
              value={formData.country || ""}
              onChange={(e) => handleInputChange("country", e.target.value)}
              className="w-full p-2 border rounded-md bg-background"
              disabled={!isEditing}
              placeholder="Argentina"
            />
          </div>
        </CardContent>
      </Card>

      {/* Education & Experience */}
      <Card>
        <CardHeader>
          <CardTitle>Educación y Experiencia</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Educación / Formación</Label>
            <textarea
              value={formData.education || ""}
              onChange={(e) => handleInputChange("education", e.target.value)}
              className="w-full p-2 border rounded-md bg-background min-h-[80px]"
              disabled={!isEditing}
              placeholder="Títulos, certificaciones, cursos relevantes..."
              maxLength={1000}
            />
          </div>

          <div className="space-y-2">
            <Label>Experiencia Profesional</Label>
            <textarea
              value={formData.experience || ""}
              onChange={(e) => handleInputChange("experience", e.target.value)}
              className="w-full p-2 border rounded-md bg-background min-h-[100px]"
              disabled={!isEditing}
              placeholder="Describe tu experiencia profesional..."
              maxLength={2000}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Especialidades</Label>
              <input
                type="text"
                value={formData.specialties || ""}
                onChange={(e) =>
                  handleInputChange("specialties", e.target.value)
                }
                className="w-full p-2 border rounded-md bg-background"
                disabled={!isEditing}
                placeholder="Terapia cognitiva, EMDR, etc. (separadas por comas)"
              />
            </div>
            <div className="space-y-2">
              <Label>Idiomas</Label>
              <input
                type="text"
                value={formData.languages || ""}
                onChange={(e) => handleInputChange("languages", e.target.value)}
                className="w-full p-2 border rounded-md bg-background"
                disabled={!isEditing}
                placeholder="Español, Inglés, etc. (separados por comas)"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Años de Experiencia</Label>
            <input
              type="number"
              value={formData.yearsOfExperience || ""}
              onChange={(e) =>
                handleInputChange("yearsOfExperience", e.target.value)
              }
              className="w-full p-2 border rounded-md bg-background"
              disabled={!isEditing}
              placeholder="5"
              min="0"
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle>Redes Sociales y Sitio Web</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Sitio Web</Label>
            <input
              type="url"
              value={formData.website || ""}
              onChange={(e) => handleInputChange("website", e.target.value)}
              className="w-full p-2 border rounded-md bg-background"
              disabled={!isEditing}
              placeholder="https://www.tupagina.com"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>LinkedIn</Label>
              <input
                type="url"
                value={formData.linkedIn || ""}
                onChange={(e) => handleInputChange("linkedIn", e.target.value)}
                className="w-full p-2 border rounded-md bg-background"
                disabled={!isEditing}
                placeholder="https://linkedin.com/in/tuperfil"
              />
            </div>
            <div className="space-y-2">
              <Label>Instagram</Label>
              <input
                type="url"
                value={formData.instagram || ""}
                onChange={(e) => handleInputChange("instagram", e.target.value)}
                className="w-full p-2 border rounded-md bg-background"
                disabled={!isEditing}
                placeholder="https://instagram.com/tuperfil"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Facebook</Label>
              <input
                type="url"
                value={formData.facebook || ""}
                onChange={(e) => handleInputChange("facebook", e.target.value)}
                className="w-full p-2 border rounded-md bg-background"
                disabled={!isEditing}
                placeholder="https://facebook.com/tupagina"
              />
            </div>
            <div className="space-y-2">
              <Label>Twitter</Label>
              <input
                type="url"
                value={formData.twitter || ""}
                onChange={(e) => handleInputChange("twitter", e.target.value)}
                className="w-full p-2 border rounded-md bg-background"
                disabled={!isEditing}
                placeholder="https://twitter.com/tuperfil"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legal Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Documentación Legal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Estos datos son requeridos para validar tu identidad y cumplir con
              regulaciones legales.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>DNI</Label>
              <input
                type="text"
                value={formData.dni || ""}
                onChange={(e) => handleInputChange("dni", e.target.value)}
                className="w-full p-2 border rounded-md bg-background"
                disabled={!isEditing}
                placeholder="12345678"
                maxLength={20}
              />
            </div>
            <div className="space-y-2">
              <Label>CUIT / CUIL</Label>
              <input
                type="text"
                value={formData.cuitCuil || ""}
                onChange={(e) => handleInputChange("cuitCuil", e.target.value)}
                className="w-full p-2 border rounded-md bg-background"
                disabled={!isEditing}
                placeholder="20-12345678-9"
                maxLength={20}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Matrícula Profesional (Opcional)</Label>
            <input
              type="text"
              value={formData.matricula || ""}
              onChange={(e) => handleInputChange("matricula", e.target.value)}
              className="w-full p-2 border rounded-md bg-background"
              disabled={!isEditing}
              placeholder="MP 12345"
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground">
              Si aplica a tu profesión (ej: médicos, psicólogos, abogados)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
