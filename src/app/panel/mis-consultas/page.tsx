"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useClientBookingsGrouped,
  useClientBookingStats,
  useCreateBookingPayment,
  useUpcomingMeetings,
} from "@/hooks/useClientBookings";
import type { BookingView } from "@/lib/contracts/schemas";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Play,
  RefreshCw,
  Users,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type TabType =
  | "all"
  | "pending_payment"
  | "waiting_acceptance"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const { grouped, allBookings, totalCount, isLoading, error, refetch } =
    useClientBookingsGrouped();
  const { stats } = useClientBookingStats();
  const { hasUpcoming, nextMeeting } = useUpcomingMeetings();
  const createPayment = useCreateBookingPayment();

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (date: string | Date) => {
    return new Date(date).toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING_PAYMENT":
        return <Badge variant="destructive">Pago Pendiente</Badge>;
      case "WAITING_FOR_PROFESSIONAL":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700">
            Esperando Aceptación
          </Badge>
        );
      case "CONFIRMED":
        return <Badge className="bg-green-50 text-green-700">Confirmada</Badge>;
      case "IN_PROGRESS":
        return <Badge className="bg-blue-50 text-blue-700">En Progreso</Badge>;
      case "COMPLETED":
        return <Badge variant="secondary">Completada</Badge>;
      case "CANCELLED":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700">
            Cancelada
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getBookingsToShow = (): BookingView[] => {
    switch (activeTab) {
      case "all":
        return allBookings;
      case "pending_payment":
        return grouped.pending_payment;
      case "waiting_acceptance":
        return grouped.waiting_acceptance;
      case "confirmed":
        return grouped.confirmed;
      case "in_progress":
        return grouped.in_progress;
      case "completed":
        return grouped.completed;
      case "cancelled":
        return grouped.cancelled;
      default:
        return allBookings;
    }
  };

  const tabs = [
    { key: "all" as TabType, label: "Todas", count: totalCount },
    {
      key: "pending_payment" as TabType,
      label: "Pago Pendiente",
      count: stats.pendingPayment,
    },
    {
      key: "waiting_acceptance" as TabType,
      label: "Esperando",
      count: stats.waitingAcceptance,
    },
    {
      key: "confirmed" as TabType,
      label: "Confirmadas",
      count: stats.confirmed,
    },
    {
      key: "in_progress" as TabType,
      label: "En Progreso",
      count: stats.inProgress,
    },
    {
      key: "completed" as TabType,
      label: "Completadas",
      count: stats.completed,
    },
    {
      key: "cancelled" as TabType,
      label: "Canceladas",
      count: stats.cancelled,
    },
  ];

  const handlePayBooking = (bookingId: string) => {
    createPayment.mutate(bookingId);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error al cargar tus consultas
          </h2>
          <p className="text-gray-600 mb-4">
            No se pudieron cargar tus consultas
          </p>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Consultas</h1>
          <p className="text-gray-600 mt-2">
            Gestiona todas tus consultas y reuniones
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Consultas
              </p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.pending}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Video className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Activas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completadas</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.completed}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Próxima Reunión */}
      {hasUpcoming && nextMeeting && (
        <Card className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Próxima Reunión
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center text-gray-700">
                  <Users className="w-4 h-4 mr-2" />
                  {nextMeeting.professional?.user?.name || "Profesional"}
                </div>
                <div className="flex items-center text-gray-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(nextMeeting.scheduledAt)}
                </div>
                <div className="flex items-center text-gray-700">
                  <Clock className="w-4 h-4 mr-2" />
                  {formatTime(nextMeeting.scheduledAt)}
                </div>
                <div className="flex items-center text-gray-700">
                  <Video className="w-4 h-4 mr-2" />
                  {nextMeeting.status}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {nextMeeting.status === "CONFIRMED" && (
                <Button asChild>
                  <Link href={`/bookings/${nextMeeting.id}/meeting`}>
                    <Play className="w-4 h-4 mr-2" />
                    Unirse
                  </Link>
                </Button>
              )}
              <Button variant="outline" asChild>
                <Link href={`/bookings/${nextMeeting.id}`}>Ver Detalle</Link>
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    activeTab === tab.key
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {getBookingsToShow().length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay consultas
            </h3>
            <p className="text-gray-600">
              {activeTab === "all"
                ? "Aún no has agendado ninguna consulta"
                : `No hay consultas en estado ${tabs.find((t) => t.key === activeTab)?.label.toLowerCase()}`}
            </p>
          </div>
        ) : (
          getBookingsToShow().map((booking) => (
            <Card
              key={booking.id}
              className="p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Consulta con{" "}
                    {booking.professional?.user?.name || "Profesional"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {booking.professional?.title || "Especialidad"}
                  </p>
                </div>
                {getStatusBadge(booking.status)}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(booking.scheduledAt)}
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  {formatTime(booking.scheduledAt)}
                </div>
                <div className="flex items-center text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2" />$
                  {(booking.price || 0).toLocaleString()}
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  {booking.duration || 60} min
                </div>
              </div>

              {booking.notes && (
                <p className="text-sm text-gray-600 mb-4 italic">
                  &ldquo;{booking.notes}&rdquo;
                </p>
              )}

              <div className="flex gap-2">
                {booking.status === "PENDING_PAYMENT" && (
                  <Button
                    onClick={() => handlePayBooking(booking.id)}
                    disabled={createPayment.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {createPayment.isPending ? "Procesando..." : "Pagar Ahora"}
                  </Button>
                )}

                {booking.status === "CONFIRMED" && (
                  <Button asChild>
                    <Link href={`/bookings/${booking.id}/meeting`}>
                      <Video className="w-4 h-4 mr-2" />
                      Unirse a Reunión
                    </Link>
                  </Button>
                )}

                {booking.status === "IN_PROGRESS" && (
                  <Button asChild>
                    <Link href={`/bookings/${booking.id}/meeting`}>
                      <Video className="w-4 h-4 mr-2" />
                      Continuar Reunión
                    </Link>
                  </Button>
                )}

                <Button variant="outline" asChild>
                  <Link href={`/bookings/${booking.id}`}>Ver Detalle</Link>
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
