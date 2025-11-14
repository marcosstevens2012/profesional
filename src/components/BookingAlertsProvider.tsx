"use client";

import { useWebSocketAlerts } from "@/hooks/useWebSocketAlerts";
import { AlertCircle, VolumeX, Wifi, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

interface BookingAlertsProviderProps {
  children: React.ReactNode;
}

export function BookingAlertsProvider({
  children,
}: BookingAlertsProviderProps) {
  const { isConnected, pendingAlerts, stopAlertSound, testAlert } =
    useWebSocketAlerts();

  const [showDebug, setShowDebug] = useState(false);

  // Mostrar debug en development
  useEffect(() => {
    setShowDebug(process.env.NODE_ENV === "development");
  }, []);

  return (
    <>
      {children}

      {/* Indicador de conexión WebSocket */}
      <div className="fixed bottom-4 right-4 z-50">
        <div
          className={`
          flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium
          ${
            isConnected
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }
        `}
        >
          {isConnected ? (
            <>
              <Wifi className="w-4 h-4" />
              Conectado
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4" />
              Desconectado
            </>
          )}
        </div>
      </div>

      {/* Panel de debug (solo en desarrollo) */}
      {showDebug && (
        <div className="fixed bottom-20 right-4 bg-white border border-gray-200 rounded-lg p-4 shadow-lg max-w-sm z-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">🔧 Debug Alerts</h3>
            <button
              onClick={() => setShowDebug(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2">
            <div className="text-sm">
              <strong>Conexión:</strong> {isConnected ? "✅ OK" : "❌ NO"}
            </div>

            <div className="text-sm">
              <strong>Alertas pendientes:</strong> {pendingAlerts.length}
            </div>

            {pendingAlerts.length > 0 && (
              <div className="text-sm">
                <strong>Última alerta:</strong>
                <div className="text-xs text-gray-600 mt-1">
                  {pendingAlerts[pendingAlerts.length - 1]?.clientName} - $
                  {pendingAlerts[pendingAlerts.length - 1]?.amount}
                </div>
              </div>
            )}

            <div className="flex gap-2 mt-3">
              <button
                onClick={testAlert}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                🧪 Test Alert
              </button>

              <button
                onClick={stopAlertSound}
                className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
              >
                🔇 Stop Sound
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Controles de audio flotantes cuando hay alertas activas */}
      {pendingAlerts.length > 0 && (
        <div className="fixed top-4 right-4 bg-red-600 text-white rounded-full p-3 shadow-lg z-50 animate-pulse">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">
              {pendingAlerts.length} alerta(s)
            </span>
            <button
              onClick={stopAlertSound}
              className="bg-red-700 hover:bg-red-800 rounded-full p-1"
              title="Silenciar sonido"
            >
              <VolumeX className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// Componente para mostrar estado de alertas en la barra superior
export function AlertsStatusIndicator() {
  const { isConnected, pendingAlerts } = useWebSocketAlerts();

  return (
    <div className="flex items-center gap-2">
      {/* Indicador de conexión */}
      <div
        className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
      />

      {/* Contador de alertas */}
      {pendingAlerts.length > 0 && (
        <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {pendingAlerts.length}
        </div>
      )}
    </div>
  );
}
