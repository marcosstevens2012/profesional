"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { getAuthHeaders } from "@/lib/utils/auth-helpers";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  CreditCard,
  DollarSign,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

interface DashboardStats {
  totalUsers: number;
  activeProfessionals: number;
  totalBookings: number;
  pendingPayments: number;
  monthlyRevenue: number;
  pendingReviews: number;
  successfulPayments: number;
  failedPayments: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/admin/dashboard", {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={fetchDashboardStats}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          Actualizar
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Usuarios"
          value={stats?.totalUsers || 0}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Profesionales Activos"
          value={stats?.activeProfessionals || 0}
          icon={UserCheck}
          color="green"
        />
        <StatCard
          title="Reservas Totales"
          value={stats?.totalBookings || 0}
          icon={Calendar}
          color="purple"
        />
        <StatCard
          title="Ingresos del Mes"
          value={`$${(stats?.monthlyRevenue || 0).toLocaleString()}`}
          icon={DollarSign}
          color="emerald"
        />
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Pagos Exitosos"
          value={stats?.successfulPayments || 0}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Pagos Fallidos"
          value={stats?.failedPayments || 0}
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title="Pagos Pendientes"
          value={stats?.pendingPayments || 0}
          icon={CreditCard}
          color="yellow"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2" size={20} />
            Acciones Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickActionButton
              title="Revisar Profesionales Pendientes"
              description="Profesionales esperando aprobación"
              action={() =>
                (window.location.href = "/admin/profesionales?filter=pending")
              }
              color="blue"
            />
            <QuickActionButton
              title="Procesar Pagos Fallidos"
              description="Reintentar conciliación de pagos"
              action={() =>
                (window.location.href = "/admin/pagos?filter=failed")
              }
              color="red"
            />
            <QuickActionButton
              title="Ver Reportes del Mes"
              description="Análisis de ingresos y comisiones"
              action={() => (window.location.href = "/admin/reportes")}
              color="green"
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              Últimas acciones administrativas aparecerán aquí cuando se
              implemente el audit log.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
}) {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-100",
    green: "text-green-600 bg-green-100",
    purple: "text-purple-600 bg-purple-100",
    emerald: "text-emerald-600 bg-emerald-100",
    red: "text-red-600 bg-red-100",
    yellow: "text-yellow-600 bg-yellow-100",
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          <div
            className={`p-3 rounded-full ${colorClasses[color as keyof typeof colorClasses]}`}
          >
            <Icon size={24} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActionButton({
  title,
  description,
  action,
  color,
}: {
  title: string;
  description: string;
  action: () => void;
  color: string;
}) {
  const colorClasses = {
    blue: "border-blue-200 hover:border-blue-300 hover:bg-blue-50",
    red: "border-red-200 hover:border-red-300 hover:bg-red-50",
    green: "border-green-200 hover:border-green-300 hover:bg-green-50",
  };

  return (
    <button
      onClick={action}
      className={`p-4 border-2 rounded-lg text-left transition-colors ${colorClasses[color as keyof typeof colorClasses]}`}
    >
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
    </button>
  );
}
