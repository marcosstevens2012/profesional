"use client";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@profesional/ui";
import {
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  Filter,
  MapPin,
  Search,
  Star,
  UserCheck,
  UserX,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Professional {
  id: string;
  name: string;
  email: string;
  slug: string;
  description: string;
  location: string;
  pricePerHour: number;
  isActive: boolean;
  averageRating: number;
  totalReviews: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    name: string;
    status: string;
  };
  _count: {
    bookings: number;
    services: number;
  };
}

export default function ProfesionalesAdmin() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedProfessional, setSelectedProfessional] =
    useState<Professional | null>(null);

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/professionals", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfessionals(data.professionals || []);
      }
    } catch (error) {
      console.error("Error fetching professionals:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfessionalStatus = async (
    professionalId: string,
    newStatus: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/admin/professionals/${professionalId}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        await fetchProfessionals(); // Refresh list
      }
    } catch (error) {
      console.error("Error updating professional status:", error);
    }
  };

  const toggleProfessionalActive = async (
    professionalId: string,
    isActive: boolean
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/admin/professionals/${professionalId}/toggle-active`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isActive: !isActive }),
        }
      );

      if (response.ok) {
        await fetchProfessionals(); // Refresh list
      }
    } catch (error) {
      console.error("Error toggling professional active status:", error);
    }
  };

  const filteredProfessionals = professionals.filter(prof => {
    const matchesSearch =
      prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || prof.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: {
        color: "bg-yellow-100 text-yellow-800",
        label: "Pendiente",
        icon: Clock,
      },
      APPROVED: {
        color: "bg-green-100 text-green-800",
        label: "Aprobado",
        icon: CheckCircle,
      },
      REJECTED: {
        color: "bg-red-100 text-red-800",
        label: "Rechazado",
        icon: XCircle,
      },
      SUSPENDED: {
        color: "bg-gray-100 text-gray-800",
        label: "Suspendido",
        icon: XCircle,
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

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Profesionales
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
          Gestión de Profesionales
        </h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setStatusFilter("PENDING")}
            className="bg-yellow-50 border-yellow-200"
          >
            <Clock size={16} className="mr-2" />
            Pendientes (
            {professionals.filter(p => p.status === "PENDING").length})
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
                placeholder="Buscar por nombre, email o ubicación..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="PENDING">Pendientes</option>
              <option value="APPROVED">Aprobados</option>
              <option value="REJECTED">Rechazados</option>
              <option value="SUSPENDED">Suspendidos</option>
            </select>

            <Button
              variant="outline"
              onClick={fetchProfessionals}
              className="flex items-center"
            >
              <Filter size={16} className="mr-2" />
              Actualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Professionals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProfessionals.map(professional => (
          <Card
            key={professional.id}
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{professional.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {professional.email}
                  </p>
                </div>
                <div className="text-right">
                  {getStatusBadge(professional.status)}
                  <div className="mt-1">
                    {professional.isActive ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <UserCheck size={12} className="mr-1" />
                        Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <UserX size={12} className="mr-1" />
                        Inactivo
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-gray-700 line-clamp-2">
                {professional.description}
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <MapPin size={14} className="mr-1" />
                  {professional.location}
                </div>
                <div className="flex items-center text-gray-600">
                  <DollarSign size={14} className="mr-1" />$
                  {professional.pricePerHour.toLocaleString()}/hora
                </div>
                <div className="flex items-center text-gray-600">
                  <Star size={14} className="mr-1" />
                  {professional.averageRating.toFixed(1)} (
                  {professional.totalReviews} reseñas)
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar size={14} className="mr-1" />
                  {professional._count.bookings} reservas
                </div>
              </div>

              <div className="text-xs text-gray-500">
                Registrado:{" "}
                {new Date(professional.createdAt).toLocaleDateString()}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedProfessional(professional)}
                  className="flex items-center"
                >
                  <Eye size={14} className="mr-1" />
                  Ver Detalle
                </Button>

                {professional.status === "PENDING" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() =>
                        updateProfessionalStatus(professional.id, "APPROVED")
                      }
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle size={14} className="mr-1" />
                      Aprobar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateProfessionalStatus(professional.id, "REJECTED")
                      }
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <XCircle size={14} className="mr-1" />
                      Rechazar
                    </Button>
                  </>
                )}

                {professional.status === "APPROVED" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      toggleProfessionalActive(
                        professional.id,
                        professional.isActive
                      )
                    }
                    className={
                      professional.isActive
                        ? "border-red-200 text-red-600 hover:bg-red-50"
                        : "border-green-200 text-green-600 hover:bg-green-50"
                    }
                  >
                    {professional.isActive ? (
                      <>
                        <UserX size={14} className="mr-1" />
                        Desactivar
                      </>
                    ) : (
                      <>
                        <UserCheck size={14} className="mr-1" />
                        Activar
                      </>
                    )}
                  </Button>
                )}

                {professional.status !== "SUSPENDED" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      updateProfessionalStatus(professional.id, "SUSPENDED")
                    }
                    className="border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    Suspender
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProfessionals.length === 0 && (
        <Card>
          <CardContent className="text-center py-8 text-gray-500">
            No se encontraron profesionales con los filtros aplicados.
          </CardContent>
        </Card>
      )}

      {/* Professional Detail Modal */}
      {selectedProfessional && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>Detalle del Profesional</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedProfessional(null)}
                >
                  Cerrar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Información Básica</h3>
                  <p>
                    <strong>Nombre:</strong> {selectedProfessional.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedProfessional.email}
                  </p>
                  <p>
                    <strong>Slug:</strong> {selectedProfessional.slug}
                  </p>
                  <p>
                    <strong>Ubicación:</strong> {selectedProfessional.location}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Estadísticas</h3>
                  <p>
                    <strong>Precio/hora:</strong> $
                    {selectedProfessional.pricePerHour.toLocaleString()}
                  </p>
                  <p>
                    <strong>Rating:</strong>{" "}
                    {selectedProfessional.averageRating.toFixed(1)}/5
                  </p>
                  <p>
                    <strong>Reseñas:</strong>{" "}
                    {selectedProfessional.totalReviews}
                  </p>
                  <p>
                    <strong>Reservas:</strong>{" "}
                    {selectedProfessional._count.bookings}
                  </p>
                  <p>
                    <strong>Servicios:</strong>{" "}
                    {selectedProfessional._count.services}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold">Descripción</h3>
                <p className="text-gray-700">
                  {selectedProfessional.description}
                </p>
              </div>

              <div>
                <h3 className="font-semibold">Estado Actual</h3>
                <div className="flex space-x-2">
                  {getStatusBadge(selectedProfessional.status)}
                  {selectedProfessional.isActive ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <UserCheck size={12} className="mr-1" />
                      Activo
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      <UserX size={12} className="mr-1" />
                      Inactivo
                    </span>
                  )}
                </div>
              </div>

              <div className="text-xs text-gray-500">
                <p>
                  Creado:{" "}
                  {new Date(selectedProfessional.createdAt).toLocaleString()}
                </p>
                <p>
                  Actualizado:{" "}
                  {new Date(selectedProfessional.updatedAt).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
