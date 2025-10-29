"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useAnalytics,
  useBookingStats,
  useProfileStats,
  useRevenueStats,
} from "@/hooks/useProfessionalProfile";
import {
  Calendar,
  CheckCircle,
  DollarSign,
  Eye,
  Star,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";

export default function AnalyticsPage() {
  const { isLoading: analyticsLoading } = useAnalytics();
  const { data: bookingStats, isLoading: bookingLoading } = useBookingStats();
  const { data: revenueStats, isLoading: revenueLoading } = useRevenueStats();
  const { data: profileStats, isLoading: profileLoading } = useProfileStats();

  const isLoading =
    analyticsLoading || bookingLoading || revenueLoading || profileLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando analíticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analíticas y Estadísticas</h2>
        <p className="text-muted-foreground">
          Monitorea el rendimiento de tu práctica profesional
        </p>
      </div>

      {/* Booking Stats */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Estadísticas de Consultas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {bookingStats?.totalBookings ?? 0}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total Consultas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {bookingStats?.completedBookings ?? 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Completadas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {bookingStats?.pendingBookings ?? 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Pendientes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {bookingStats?.cancelledBookings ?? 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Canceladas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Revenue Stats */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Estadísticas de Ingresos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    ${(revenueStats?.totalRevenue ?? 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Ingresos Totales
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    ${(revenueStats?.revenueThisMonth ?? 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Este Mes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    ${(revenueStats?.averageSessionValue ?? 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Promedio/Sesión
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Profile Stats */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Estadísticas del Perfil</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Eye className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {profileStats?.profileViews ?? 0}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Visitas al Perfil
                  </p>
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
                    {(profileStats?.averageRating ?? 0).toFixed(1)}
                  </p>
                  <p className="text-sm text-muted-foreground">Calificación</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Users className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {profileStats?.totalReviews ?? 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Reseñas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {(profileStats?.conversionRate ?? 0).toFixed(1)}%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Tasa de Conversión
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Rendimiento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Tasa de Completitud</p>
                <p className="text-sm text-muted-foreground">
                  Porcentaje de consultas completadas
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  {(bookingStats?.completionRate ?? 0).toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Duración Promedio de Sesión</p>
                <p className="text-sm text-muted-foreground">
                  Tiempo promedio por consulta
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">
                  {bookingStats?.averageSessionDuration ?? 0} min
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Visitas Este Mes</p>
                <p className="text-sm text-muted-foreground">
                  Visitas a tu perfil este mes
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-indigo-600">
                  {profileStats?.profileViewsThisMonth ?? 0}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
