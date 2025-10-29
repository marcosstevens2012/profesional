"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  useCreateAvailabilitySlot,
  useDeleteAvailabilitySlot,
  useMyAvailability,
} from "@/hooks/useProfessionalProfile";
import { Calendar, Clock, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const DAYS_OF_WEEK = [
  { value: "MONDAY", label: "Lunes" },
  { value: "TUESDAY", label: "Martes" },
  { value: "WEDNESDAY", label: "Miércoles" },
  { value: "THURSDAY", label: "Jueves" },
  { value: "FRIDAY", label: "Viernes" },
  { value: "SATURDAY", label: "Sábado" },
  { value: "SUNDAY", label: "Domingo" },
];

export default function AvailabilityManagement() {
  const { data: slots, isLoading } = useMyAvailability({
    type: "RECURRING",
    isActive: true,
  });
  const createSlot = useCreateAvailabilitySlot();
  const deleteSlot = useDeleteAvailabilitySlot();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    dayOfWeek: "MONDAY",
    startTime: "09:00",
    endTime: "17:00",
  });

  const handleCreate = async () => {
    try {
      await createSlot.mutateAsync({
        type: "RECURRING",
        dayOfWeek: formData.dayOfWeek,
        startTime: formData.startTime,
        endTime: formData.endTime,
        isActive: true,
      });
      setShowForm(false);
      setFormData({
        dayOfWeek: "MONDAY",
        startTime: "09:00",
        endTime: "17:00",
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleDelete = async (slotId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este horario?")) {
      await deleteSlot.mutateAsync(slotId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando disponibilidad...</p>
        </div>
      </div>
    );
  }

  const slotsByDay = DAYS_OF_WEEK.map((day) => ({
    ...day,
    slots: slots?.filter((s) => s.dayOfWeek === day.value) || [],
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Disponibilidad</h2>
          <p className="text-muted-foreground">
            Configura tus horarios de disponibilidad para recibir consultas
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Horario
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Agregar Horario Recurrente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="dayOfWeek">Día de la semana</Label>
                <select
                  id="dayOfWeek"
                  className="w-full mt-1 p-2 border rounded-md"
                  value={formData.dayOfWeek}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dayOfWeek: e.target.value,
                    }))
                  }
                >
                  {DAYS_OF_WEEK.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="startTime">Hora de inicio</Label>
                <input
                  type="time"
                  id="startTime"
                  className="w-full mt-1 p-2 border rounded-md"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      startTime: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="endTime">Hora de fin</Label>
                <input
                  type="time"
                  id="endTime"
                  className="w-full mt-1 p-2 border rounded-md"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endTime: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreate} disabled={createSlot.isPending}>
                {createSlot.isPending ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slotsByDay.map((day) => (
          <Card key={day.value}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {day.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {day.slots.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Sin horarios configurados
                </p>
              ) : (
                <div className="space-y-2">
                  {day.slots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">
                          {slot.startTime} - {slot.endTime}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(slot.id)}
                        disabled={deleteSlot.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
