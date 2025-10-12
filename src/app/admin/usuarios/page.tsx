"use client";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import {
  Calendar,
  Edit,
  Filter,
  Mail,
  Plus,
  Search,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";
import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: "client" | "professional" | "admin";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    bookings?: number;
    professionalProfile?: number;
  };
}

export default function UsuariosAdmin() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchUsers(); // Refresh list
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVE: { color: "bg-green-100 text-green-800", label: "Activo" },
      INACTIVE: { color: "bg-gray-100 text-gray-800", label: "Inactivo" },
      SUSPENDED: { color: "bg-red-100 text-red-800", label: "Suspendido" },
      PENDING_VERIFICATION: {
        color: "bg-yellow-100 text-yellow-800",
        label: "Pendiente",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.INACTIVE;
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      client: { color: "bg-blue-100 text-blue-800", label: "Cliente" },
      professional: {
        color: "bg-purple-100 text-purple-800",
        label: "Profesional",
      },
      admin: { color: "bg-indigo-100 text-indigo-800", label: "Admin" },
    };

    const config =
      roleConfig[role as keyof typeof roleConfig] || roleConfig.client;
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Usuarios
        </h1>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Usuarios
        </h1>
        <Button className="flex items-center">
          <Plus size={16} className="mr-2" />
          Crear Usuario
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los roles</option>
              <option value="client">Clientes</option>
              <option value="professional">Profesionales</option>
              <option value="admin">Administradores</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="ACTIVE">Activos</option>
              <option value="INACTIVE">Inactivos</option>
              <option value="SUSPENDED">Suspendidos</option>
              <option value="PENDING_VERIFICATION">Pendientes</option>
            </select>

            <Button
              variant="outline"
              onClick={fetchUsers}
              className="flex items-center"
            >
              <Filter size={16} className="mr-2" />
              Actualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Usuarios ({filteredUsers.length} de {users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Usuario</th>
                  <th className="text-left py-3 px-4 font-medium">Rol</th>
                  <th className="text-left py-3 px-4 font-medium">Estado</th>
                  <th className="text-left py-3 px-4 font-medium">Registro</th>
                  <th className="text-left py-3 px-4 font-medium">Actividad</th>
                  <th className="text-left py-3 px-4 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{getRoleBadge(user.role)}</td>
                    <td className="py-3 px-4">{getStatusBadge(user.status)}</td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-600">
                        {user._count?.bookings && (
                          <div>{user._count.bookings} reservas</div>
                        )}
                        {user.role === "professional" &&
                          user._count?.professionalProfile && (
                            <div>Perfil profesional</div>
                          )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            /* TODO: Edit user */
                          }}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() => {
                            /* TODO: Send email */
                          }}
                          className="p-1 text-green-600 hover:text-green-800"
                          title="Enviar email"
                        >
                          <Mail size={16} />
                        </button>

                        {user.status === "ACTIVE" ? (
                          <button
                            onClick={() =>
                              updateUserStatus(user.id, "SUSPENDED")
                            }
                            className="p-1 text-red-600 hover:text-red-800"
                            title="Suspender"
                          >
                            <UserX size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() => updateUserStatus(user.id, "ACTIVE")}
                            className="p-1 text-green-600 hover:text-green-800"
                            title="Activar"
                          >
                            <UserCheck size={16} />
                          </button>
                        )}

                        <button
                          onClick={() => {
                            /* TODO: Delete user with confirmation */
                          }}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No se encontraron usuarios con los filtros aplicados.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
