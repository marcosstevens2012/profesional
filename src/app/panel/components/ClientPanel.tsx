"use client";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { useAuthStore } from "@/lib/auth/auth-store";
import { Calendar, CreditCard, FileText, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ClientPanelProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

const tabs = [
  { id: "bookings", label: "Historial de Consultas", icon: Calendar },
  { id: "payments", label: "Pagos", icon: CreditCard },
  { id: "profile", label: "Mi Perfil", icon: User },
];

export default function ClientPanel({ user }: ClientPanelProps) {
  const [activeTab, setActiveTab] = useState("bookings");
  const { tokens } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      console.log("🔍 Fetching bookings...");
      console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
      console.log("Has token:", !!tokens?.accessToken);

      if (!tokens?.accessToken) {
        console.warn("❌ No access token available");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const url = `${process.env.NEXT_PUBLIC_API_URL}/bookings/client/my-bookings`;
        console.log("📡 Fetching from:", url);

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        });

        console.log("📥 Response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("✅ Data received:", data);
          console.log("📊 Bookings count:", data.count);
          console.log("📋 Bookings array length:", data.bookings?.length);
          // The API returns { bookings, count, grouped }
          setBookings(data.bookings || []);
        } else {
          const errorText = await response.text();
          console.error(
            "❌ Failed to fetch bookings:",
            response.status,
            errorText
          );
        }
      } catch (error) {
        console.error("❌ Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [tokens?.accessToken]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "bookings":
        return <BookingsTab bookings={bookings} loading={loading} />;
      case "payments":
        return <PaymentsTab />;
      case "profile":
        return <ProfileTab user={user} />;
      default:
        return <BookingsTab bookings={bookings} loading={loading} />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mi Panel</h1>
          <p className="text-muted-foreground">
            Bienvenido/a {user.name}, gestiona tus consultas y consultas
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
                <p className="text-2xl font-bold">{bookings.length}</p>
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
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {bookings.filter((b: any) => b.status === "COMPLETED").length}
                </p>
                <p className="text-sm text-muted-foreground">Completadas</p>
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
                <p className="text-2xl font-bold">
                  $
                  {bookings
                    .filter((b: any) => b.status === "COMPLETED")
                    .reduce((sum: number, b: any) => sum + Number(b.price), 0)
                    .toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Gastado</p>
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

// Tab Components for Client Panel
function BookingsTab({
  bookings,
  loading,
}: {
  bookings: any[];
  loading: boolean;
}) {
  const router = useRouter();

  const handleJoinMeeting = (bookingId: string) => {
    router.push(`/bookings/${bookingId}/meeting`);
  };

  const handleViewDetails = (bookingId: string) => {
    // TODO: Implementar modal de detalles o navegación
    console.log("Ver detalles de booking:", bookingId);
  };

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

  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">
            No tienes consultas aún
          </h3>
          <p className="text-gray-600 mb-4">
            Explora profesionales y agenda tu primera consulta
          </p>
          <Button>Buscar Profesionales</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {bookings.map((booking: any) => (
        <Card key={booking.id}>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">
                  Consulta con {booking.professional?.user?.profile?.firstName}{" "}
                  {booking.professional?.user?.profile?.lastName ||
                    "Profesional"}
                </h3>
                <p className="text-muted-foreground">
                  {booking.professional?.serviceCategory?.name || "Consulta"}
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <span>
                    Fecha:{" "}
                    {new Date(booking.scheduledAt).toLocaleDateString("es-AR")}
                  </span>
                  <span>
                    Hora:{" "}
                    {new Date(booking.scheduledAt).toLocaleTimeString("es-AR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span>
                    Precio: ${Number(booking.price).toLocaleString("es-AR")}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    booking.status === "COMPLETED"
                      ? "bg-green-100 text-green-800"
                      : booking.status === "CONFIRMED"
                        ? "bg-blue-100 text-blue-800"
                        : booking.status === "PENDING_PAYMENT"
                          ? "bg-yellow-100 text-yellow-800"
                          : booking.status === "WAITING_FOR_PROFESSIONAL"
                            ? "bg-orange-100 text-orange-800"
                            : booking.status === "IN_PROGRESS"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {booking.status === "COMPLETED"
                    ? "Completada"
                    : booking.status === "CONFIRMED"
                      ? "Confirmada"
                      : booking.status === "PENDING_PAYMENT"
                        ? "Pendiente de Pago"
                        : booking.status === "WAITING_FOR_PROFESSIONAL"
                          ? "Esperando Aceptación"
                          : booking.status === "IN_PROGRESS"
                            ? "En Progreso"
                            : booking.status === "CANCELLED"
                              ? "Cancelada"
                              : booking.status}
                </span>

                {/* Botón para unirse a la reunión si está confirmada o en progreso */}
                {(booking.status === "CONFIRMED" ||
                  booking.status === "IN_PROGRESS") && (
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleJoinMeeting(booking.id)}
                  >
                    🎥 Unirse a la Reunión
                  </Button>
                )}

                {/* Botón de ver detalles para otros estados */}
                {booking.status !== "CONFIRMED" &&
                  booking.status !== "IN_PROGRESS" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(booking.id)}
                    >
                      Ver Detalles
                    </Button>
                  )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function PaymentsTab() {
  // This will be connected to real payment data later
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <CreditCard size={48} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold mb-2">
          Historial de pagos próximamente
        </h3>
        <p className="text-gray-600">
          Aquí podrás ver todos tus pagos y facturas
        </p>
      </CardContent>
    </Card>
  );
}

function ProfileTab({ user }: { user: any }) {
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
            <label className="text-sm font-medium">Rol</label>
            <input
              type="text"
              defaultValue="Cliente"
              className="w-full p-2 border rounded-md bg-background"
              readOnly
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
