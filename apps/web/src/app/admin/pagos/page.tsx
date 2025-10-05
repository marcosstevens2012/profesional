"use client";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@profesional/ui";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Eye,
  Filter,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Payment {
  id: string;
  amount: number;
  status:
    | "pending"
    | "approved"
    | "authorized"
    | "in_process"
    | "in_mediation"
    | "rejected"
    | "cancelled"
    | "refunded"
    | "charged_back";
  method: string;
  gatewayPaymentId: string;
  createdAt: string;
  updatedAt: string;
  booking?: {
    id: string;
    title: string;
    client: {
      name: string;
      email: string;
    };
    professional: {
      name: string;
      email: string;
    };
  };
  events: PaymentEvent[];
}

interface PaymentEvent {
  id: string;
  type: string;
  data: any;
  createdAt: string;
}

export default function PagosAdmin() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [retryingPayment, setRetryingPayment] = useState<string | null>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/payments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPayments(data.payments || []);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const retryPaymentReconciliation = async (paymentId: string) => {
    setRetryingPayment(paymentId);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/admin/payments/${paymentId}/retry-reconciliation`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        await fetchPayments(); // Refresh list
      }
    } catch (error) {
      console.error("Error retrying payment reconciliation:", error);
    } finally {
      setRetryingPayment(null);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.gatewayPaymentId
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      payment.booking?.client.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      payment.booking?.professional.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        label: "Pendiente",
        icon: Clock,
      },
      approved: {
        color: "bg-green-100 text-green-800",
        label: "Aprobado",
        icon: CheckCircle,
      },
      authorized: {
        color: "bg-blue-100 text-blue-800",
        label: "Autorizado",
        icon: CheckCircle,
      },
      in_process: {
        color: "bg-blue-100 text-blue-800",
        label: "Procesando",
        icon: RefreshCw,
      },
      in_mediation: {
        color: "bg-orange-100 text-orange-800",
        label: "En Mediación",
        icon: AlertTriangle,
      },
      rejected: {
        color: "bg-red-100 text-red-800",
        label: "Rechazado",
        icon: XCircle,
      },
      cancelled: {
        color: "bg-gray-100 text-gray-800",
        label: "Cancelado",
        icon: XCircle,
      },
      refunded: {
        color: "bg-purple-100 text-purple-800",
        label: "Reembolsado",
        icon: RefreshCw,
      },
      charged_back: {
        color: "bg-red-100 text-red-800",
        label: "Contracargo",
        icon: AlertTriangle,
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
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

  const getMethodBadge = (method: string) => {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <CreditCard size={12} className="mr-1" />
        {method}
      </span>
    );
  };

  const failedPayments = payments.filter(p =>
    ["rejected", "cancelled", "charged_back"].includes(p.status)
  );
  const pendingPayments = payments.filter(p =>
    ["pending", "in_process", "in_mediation"].includes(p.status)
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Pagos</h1>
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
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Pagos</h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setStatusFilter("rejected")}
            className="bg-red-50 border-red-200"
          >
            <XCircle size={16} className="mr-2" />
            Fallidos ({failedPayments.length})
          </Button>
          <Button
            variant="outline"
            onClick={() => setStatusFilter("pending")}
            className="bg-yellow-50 border-yellow-200"
          >
            <Clock size={16} className="mr-2" />
            Pendientes ({pendingPayments.length})
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
                placeholder="Buscar por ID, cliente o profesional..."
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
              <option value="pending">Pendientes</option>
              <option value="approved">Aprobados</option>
              <option value="authorized">Autorizados</option>
              <option value="in_process">Procesando</option>
              <option value="in_mediation">En Mediación</option>
              <option value="rejected">Rechazados</option>
              <option value="cancelled">Cancelados</option>
              <option value="refunded">Reembolsados</option>
              <option value="charged_back">Contracargos</option>
            </select>

            <Button
              variant="outline"
              onClick={fetchPayments}
              className="flex items-center"
            >
              <Filter size={16} className="mr-2" />
              Actualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payments List */}
      <div className="space-y-4">
        {filteredPayments.map(payment => (
          <Card key={payment.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Payment Info */}
                <div className="lg:col-span-2">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">
                        ${payment.amount.toLocaleString()}
                      </h3>
                      <p className="text-sm text-gray-600">ID: {payment.id}</p>
                      <p className="text-xs text-gray-500">
                        Gateway: {payment.gatewayPaymentId}
                      </p>
                    </div>
                    <div className="flex flex-col space-y-1">
                      {getStatusBadge(payment.status)}
                      {getMethodBadge(payment.method)}
                    </div>
                  </div>

                  {payment.booking && (
                    <div className="space-y-1 text-sm">
                      <div>
                        <strong>Reserva:</strong> {payment.booking.title}
                      </div>
                      <div>
                        <strong>Cliente:</strong> {payment.booking.client.name}
                      </div>
                      <div>
                        <strong>Profesional:</strong>{" "}
                        {payment.booking.professional.name}
                      </div>
                    </div>
                  )}
                </div>

                {/* Timing Info */}
                <div>
                  <h4 className="font-medium mb-2">Fechas</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      <span>
                        Creado:{" "}
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      <span>
                        Actualizado:{" "}
                        {new Date(payment.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    {payment.events.length > 0 && (
                      <div>
                        <span className="text-xs">
                          Eventos: {payment.events.length}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedPayment(payment)}
                    className="flex items-center"
                  >
                    <Eye size={14} className="mr-1" />
                    Ver Detalle
                  </Button>

                  {["rejected", "cancelled", "charged_back"].includes(
                    payment.status
                  ) && (
                    <Button
                      size="sm"
                      onClick={() => retryPaymentReconciliation(payment.id)}
                      disabled={retryingPayment === payment.id}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {retryingPayment === payment.id ? (
                        <RefreshCw size={14} className="mr-1 animate-spin" />
                      ) : (
                        <RefreshCw size={14} className="mr-1" />
                      )}
                      Reintentar
                    </Button>
                  )}

                  {payment.status === "approved" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-green-200 text-green-600"
                      disabled
                    >
                      <CheckCircle size={14} className="mr-1" />
                      Exitoso
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPayments.length === 0 && (
        <Card>
          <CardContent className="text-center py-8 text-gray-500">
            No se encontraron pagos con los filtros aplicados.
          </CardContent>
        </Card>
      )}

      {/* Payment Detail Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>Detalle del Pago</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedPayment(null)}
                >
                  Cerrar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Información del Pago</h3>
                  <div className="space-y-2">
                    <p>
                      <strong>ID:</strong> {selectedPayment.id}
                    </p>
                    <p>
                      <strong>Gateway ID:</strong>{" "}
                      {selectedPayment.gatewayPaymentId}
                    </p>
                    <p>
                      <strong>Monto:</strong> $
                      {selectedPayment.amount.toLocaleString()}
                    </p>
                    <p>
                      <strong>Estado:</strong>{" "}
                      {getStatusBadge(selectedPayment.status)}
                    </p>
                    <p>
                      <strong>Método:</strong>{" "}
                      {getMethodBadge(selectedPayment.method)}
                    </p>
                  </div>
                </div>

                {selectedPayment.booking && (
                  <div>
                    <h3 className="font-semibold mb-3">
                      Información de la Reserva
                    </h3>
                    <div className="space-y-2">
                      <p>
                        <strong>Título:</strong> {selectedPayment.booking.title}
                      </p>
                      <p>
                        <strong>Cliente:</strong>{" "}
                        {selectedPayment.booking.client.name}
                      </p>
                      <p>
                        <strong>Email Cliente:</strong>{" "}
                        {selectedPayment.booking.client.email}
                      </p>
                      <p>
                        <strong>Profesional:</strong>{" "}
                        {selectedPayment.booking.professional.name}
                      </p>
                      <p>
                        <strong>Email Profesional:</strong>{" "}
                        {selectedPayment.booking.professional.email}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {selectedPayment.events.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Historial de Eventos</h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {selectedPayment.events.map(event => (
                      <div
                        key={event.id}
                        className="border rounded p-3 bg-gray-50"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium">{event.type}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(event.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <pre className="text-xs bg-white p-2 rounded overflow-x-auto">
                          {JSON.stringify(event.data, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500 border-t pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <p>
                    Creado:{" "}
                    {new Date(selectedPayment.createdAt).toLocaleString()}
                  </p>
                  <p>
                    Actualizado:{" "}
                    {new Date(selectedPayment.updatedAt).toLocaleString()}
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
