import type {
  AcceptMeetingResponse,
  BookingView,
  ClientBookingsResponse,
  JoinMeetingResponse,
  MeetingStatusResponse,
  ProfessionalMeetingsResponse,
  StartMeetingResponse,
  WaitingBookingsResponse,
} from "../contracts/schemas";
import { apiClient } from "./client";

/**
 * API client para gestión de bookings
 * Implementa todos los endpoints del sistema según el resumen técnico
 */
export const bookingsAPI = {
  // ===== PROFESIONAL - GESTIÓN DE BOOKINGS =====

  /**
   * Obtener bookings esperando aceptación del profesional
   * GET /api/bookings/professional/waiting-bookings
   */
  async getWaitingBookings(): Promise<WaitingBookingsResponse> {
    try {
      const response = await apiClient.get<WaitingBookingsResponse>(
        "/bookings/professional/waiting-bookings"
      );
      return response.data;
    } catch (error) {
      console.error("❌ Error en getWaitingBookings:", error);
      throw error;
    }
  },

  /**
   * Obtener reuniones pendientes del profesional
   * GET /api/bookings/professional/meetings
   */
  async getProfessionalMeetings(): Promise<ProfessionalMeetingsResponse> {
    try {
      const response = await apiClient.get<ProfessionalMeetingsResponse>(
        "/bookings/professional/meetings"
      );
      return response.data;
    } catch (error) {
      console.error("❌ Error en getProfessionalMeetings:", error);
      throw error;
    }
  },

  /**
   * Aceptar un booking (profesional)
   * PATCH /api/bookings/:id/accept-meeting
   */
  async acceptMeeting(bookingId: string): Promise<AcceptMeetingResponse> {
    try {
      const response = await apiClient.patch<AcceptMeetingResponse>(
        `/bookings/${bookingId}/accept-meeting`
      );
      return response.data;
    } catch (error) {
      console.error("❌ Error en acceptMeeting:", error);
      throw error;
    }
  },

  // ===== CLIENTE - GESTIÓN DE BOOKINGS =====

  /**
   * Obtener todos los bookings del cliente
   * GET /api/bookings/client/my-bookings
   */
  async getClientBookings(): Promise<ClientBookingsResponse> {
    try {
      const response = await apiClient.get<ClientBookingsResponse>(
        "/bookings/client/my-bookings"
      );
      return response.data;
    } catch (error) {
      console.error("❌ Error en getClientBookings:", error);
      throw error;
    }
  },

  /**
   * Crear pago para booking (cliente)
   * POST /api/bookings/:id/payment
   */
  async createBookingPayment(bookingId: string): Promise<any> {
    try {
      const response = await apiClient.post<any>(
        `/bookings/${bookingId}/payment`
      );
      return response.data;
    } catch (error) {
      console.error("❌ Error en createBookingPayment:", error);
      throw error;
    }
  },

  // ===== AMBOS - REUNIONES =====

  /**
   * Obtener detalles de un booking
   * GET /api/bookings/:id
   */
  async getBookingDetails(bookingId: string): Promise<BookingView> {
    try {
      const response = await apiClient.get<BookingView>(
        `/bookings/${bookingId}`
      );
      return response.data;
    } catch (error) {
      console.error("❌ Error en getBookingDetails:", error);
      throw error;
    }
  },

  /**
   * Verificar si el usuario puede unirse a la reunión
   * GET /api/bookings/:id/join-meeting
   */
  async canJoinMeeting(bookingId: string): Promise<JoinMeetingResponse> {
    try {
      const response = await apiClient.get<JoinMeetingResponse>(
        `/bookings/${bookingId}/join-meeting`
      );
      return response.data;
    } catch (error) {
      console.error("❌ Error en canJoinMeeting:", error);
      throw error;
    }
  },

  /**
   * Iniciar reunión (al unirse)
   * POST /api/bookings/:id/start-meeting
   */
  async startMeeting(bookingId: string): Promise<StartMeetingResponse> {
    try {
      const response = await apiClient.post<StartMeetingResponse>(
        `/bookings/${bookingId}/start-meeting`
      );
      return response.data;
    } catch (error) {
      console.error("❌ Error en startMeeting:", error);
      throw error;
    }
  },

  /**
   * Obtener estado actual de la reunión
   * GET /api/bookings/:id/meeting-status
   */
  async getMeetingStatus(bookingId: string): Promise<MeetingStatusResponse> {
    try {
      const response = await apiClient.get<MeetingStatusResponse>(
        `/bookings/${bookingId}/meeting-status`
      );
      return response.data;
    } catch (error) {
      console.error("❌ Error en getMeetingStatus:", error);
      throw error;
    }
  },
};

/**
 * Tipos de respuesta para conveniencia
 */
export type {
  AcceptMeetingResponse,
  BookingView,
  ClientBookingsResponse,
  JoinMeetingResponse,
  MeetingStatusResponse,
  StartMeetingResponse,
  WaitingBookingsResponse,
};
