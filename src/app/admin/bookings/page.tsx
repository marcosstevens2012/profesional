"use client";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { getAuthHeaders } from "@/lib/utils/auth-helpers";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  Filter,
  Search,
  User,
  UserCheck,
  Video,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Booking {
  id: string;
  title: string;
  description: string;
  status:
    | "PENDING_PAYMENT"
    | "PENDING"
    | "CONFIRMED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED"
    | "NO_SHOW";
  meetingStatus?:
    | "PENDING"
    | "WAITING"
    | "ACTIVE"
    | "COMPLETED"
    | "CANCELLED"
    | "EXPIRED";
  amount: number;
  createdAt: string;
  updatedAt: string;
  jitsiRoom?: string;
  meetingStartTime?: string;
  meetingEndTime?: string;
  client: {
    id: string;
    name: string;
    email: string;
  };
  professional: {
    id: string;
    name: string;
    email: string;
  };
  payment?: {
    id: string;
    status: string;
    amount: number;
    method: string;
  };
}

export default function BookingsAdmin() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/admin/bookings", {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchBookings(); // Refresh list
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  const markAsNoShow = async (bookingId: string) => {
    await updateBookingStatus(bookingId, "NO_SHOW");
  };

  const cancelBooking = async (bookingId: string) => {
    await updateBookingStatus(bookingId, "CANCELLED");
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.professional.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING_PAYMENT: {
        color: "bg-yellow-100 text-yellow-800",
        label: "Pendiente Pago",
        icon: Clock,
      },
      PENDING: {
        color: "bg-blue-100 text-blue-800",
        label: "Pendiente",
        icon: Clock,
      },
      CONFIRMED: {
        color: "bg-green-100 text-green-800",
        label: "Confirmada",
        icon: CheckCircle,
      },
      IN_PROGRESS: {
        color: "bg-purple-100 text-purple-800",
        label: "En Progreso",
        icon: Video,
      },
      COMPLETED: {
        color: "bg-green-100 text-green-800",
        label: "Completada",
        icon: CheckCircle,
      },
      CANCELLED: {
        color: "bg-red-100 text-red-800",
        label: "Cancelada",
        icon: XCircle,
      },
      NO_SHOW: {
        color: "bg-gray-100 text-gray-800",
        label: "No Show",
        icon: AlertTriangle,
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon size={12} className="mr-1" />
        {config.label}
      </span>
    );
  };

  const getMeetingStatusBadge = (status?: string) => {
    if (!status) return null;

    const statusConfig = {
      PENDING: { color: "bg-gray-100 text-gray-800", label: "Preparando" },
      WAITING: { color: "bg-yellow-100 text-yellow-800", label: "Esperando" },
      ACTIVE: { color: "bg-green-100 text-green-800", label: "Activa" },
      COMPLETED: { color: "bg-blue-100 text-blue-800", label: "Finalizada" },
      CANCELLED: { color: "bg-red-100 text-red-800", label: "Cancelada" },
      EXPIRED: { color: "bg-gray-100 text-gray-800", label: "Expirada" },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        <Video size={12} className="mr-1" />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Reservas
        </h1>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Reservas
        </h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setStatusFilter("PENDING_PAYMENT")}
            className="bg-yellow-50 border-yellow-200"
          >
            <Clock size={16} className="mr-2" />
            Pendientes (
            {bookings.filter((b) => b.status === "PENDING_PAYMENT").length})
          </Button>
          <Button
            variant="outline"
            onClick={() => setStatusFilter("IN_PROGRESS")}
            className="bg-purple-50 border-purple-200"
          >
            <Video size={16} className="mr-2" />
            En Progreso (
            {bookings.filter((b) => b.status === "IN_PROGRESS").length})
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                type="text"
                placeholder="Buscar por título, cliente o profesional..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="PENDING_PAYMENT">Pendiente Pago</option>
              <option value="PENDING">Pendiente</option>
              <option value="CONFIRMED">Confirmada</option>
              <option value="IN_PROGRESS">En Progreso</option>
              <option value="COMPLETED">Completada</option>
              <option value="CANCELLED">Cancelada</option>
              <option value="NO_SHOW">No Show</option>
            </select>

            <Button
              variant="outline"
              onClick={fetchBookings}
              className="flex items-center"
            >
              <Filter size={16} className="mr-2" />
              Actualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <Card key={booking.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Booking Info */}
                <div className="lg:col-span-2">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{booking.title}</h3>
                    <div className="flex space-x-2">
                      {getStatusBadge(booking.status)}
                      {getMeetingStatusBadge(booking.meetingStatus)}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {booking.description}
                  </p>

                  <div className="space-y-1 text-sm">
                    <div className="flex items-center text-gray-600">
                      <User size={14} className="mr-2" />
                      <span>
                        <strong>Cliente:</strong> {booking.client.name} (
                        {booking.client.email})
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <UserCheck size={14} className="mr-2" />
                      <span>
                        <strong>Profesional:</strong>{" "}
                        {booking.professional.name} (
                        {booking.professional.email})
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <DollarSign size={14} className="mr-2" />
                      <span>
                        <strong>Monto:</strong> $
                        {booking.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Meeting Info */}
                <div>
                  <h4 className="font-medium mb-2">Información de Reunión</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    {booking.jitsiRoom && (
                      <div>
                        <strong>Sala:</strong> {booking.jitsiRoom}
                      </div>
                    )}
                    {booking.meetingStartTime && (
                      <div>
                        <strong>Inicio:</strong>{" "}
                        {new Date(booking.meetingStartTime).toLocaleString()}
                      </div>
                    )}
                    {booking.meetingEndTime && (
                      <div>
                        <strong>Fin:</strong>{" "}
                        {new Date(booking.meetingEndTime).toLocaleString()}
                      </div>
                    )}
                    {!booking.jitsiRoom && (
                      <div className="text-gray-400">
                        Sin reunión programada
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedBooking(booking)}
                    className="flex items-center"
                  >
                    <Eye size={14} className="mr-1" />
                    Ver Detalle
                  </Button>

                  {booking.status === "CONFIRMED" &&
                    booking.meetingStatus !== "COMPLETED" && (
                      <Button
                        size="sm"
                        onClick={() => markAsNoShow(booking.id)}
                        className="bg-gray-600 hover:bg-gray-700 text-white"
                      >
                        <AlertTriangle size={14} className="mr-1" />
                        Marcar No Show
                      </Button>
                    )}

                  {["PENDING", "CONFIRMED", "IN_PROGRESS"].includes(
                    booking.status
                  ) && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => cancelBooking(booking.id)}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <XCircle size={14} className="mr-1" />
                      Cancelar
                    </Button>
                  )}

                  {booking.payment && booking.payment.status === "failed" && (
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => {
                        /* TODO: Retry payment reconciliation */
                      }}
                    >
                      Reintentar Pago
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>
                    Creada: {new Date(booking.createdAt).toLocaleString()}
                  </span>
                  <span>ID: {booking.id}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <Card>
          <CardContent className="text-center py-8 text-gray-500">
            No se encontraron reservas con los filtros aplicados.
          </CardContent>
        </Card>
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>Detalle de la Reserva</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedBooking(null)}
                >
                  Cerrar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">
                    Información de la Reserva
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <strong>Título:</strong> {selectedBooking.title}
                    </p>
                    <p>
                      <strong>Descripción:</strong>{" "}
                      {selectedBooking.description}
                    </p>
                    <p>
                      <strong>Monto:</strong> $
                      {selectedBooking.amount.toLocaleString()}
                    </p>
                    <p>
                      <strong>Estado:</strong>{" "}
                      {getStatusBadge(selectedBooking.status)}
                    </p>
                    {selectedBooking.meetingStatus && (
                      <p>
                        <strong>Estado Reunión:</strong>{" "}
                        {getMeetingStatusBadge(selectedBooking.meetingStatus)}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Participantes</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Cliente</h4>
                      <p>{selectedBooking.client.name}</p>
                      <p className="text-sm text-gray-600">
                        {selectedBooking.client.email}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Profesional</h4>
                      <p>{selectedBooking.professional.name}</p>
                      <p className="text-sm text-gray-600">
                        {selectedBooking.professional.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedBooking.jitsiRoom && (
                <div>
                  <h3 className="font-semibold mb-3">
                    Información de Videollamada
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <p>
                      <strong>Sala Jitsi:</strong> {selectedBooking.jitsiRoom}
                    </p>
                    {selectedBooking.meetingStartTime && (
                      <p>
                        <strong>Inicio:</strong>{" "}
                        {new Date(
                          selectedBooking.meetingStartTime
                        ).toLocaleString()}
                      </p>
                    )}
                    {selectedBooking.meetingEndTime && (
                      <p>
                        <strong>Fin:</strong>{" "}
                        {new Date(
                          selectedBooking.meetingEndTime
                        ).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {selectedBooking.payment && (
                <div>
                  <h3 className="font-semibold mb-3">Información de Pago</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <p>
                      <strong>ID:</strong> {selectedBooking.payment.id}
                    </p>
                    <p>
                      <strong>Estado:</strong> {selectedBooking.payment.status}
                    </p>
                    <p>
                      <strong>Método:</strong> {selectedBooking.payment.method}
                    </p>
                    <p>
                      <strong>Monto:</strong> $
                      {selectedBooking.payment.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500 border-t pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <p>
                    Creada:{" "}
                    {new Date(selectedBooking.createdAt).toLocaleString()}
                  </p>
                  <p>
                    Actualizada:{" "}
                    {new Date(selectedBooking.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
