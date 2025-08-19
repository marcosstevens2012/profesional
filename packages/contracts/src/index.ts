// Version information
export * from "./version";

// All schemas and types
export * from "./schemas";

// Re-export commonly used schemas for convenience
export {
  // API utilities
  ApiResponseSchema,
  // Booking related
  BookingSchema,
  BookingStatusEnum,
  BookingViewSchema,
  CreateBookingSchema,
  CreatePaymentSchema,
  CreateProfessionalProfileSchema,
  CreateUserSchema,
  HealthCheckSchema,
  PaginatedResponseSchema,
  // Payment related
  PaymentSchema,
  PaymentStatusEnum,
  // Professional related
  ProfessionalProfileSchema,
  ProfessionalProfileViewSchema,
  SearchFiltersSchema,
  UpdateBookingSchema,
  UpdatePaymentSchema,
  UpdateProfessionalProfileSchema,
  UpdateUserSchema,
  // User related
  UserSchema,
  UserViewSchema,
  type ApiResponse,
  type Booking,
  type BookingStatus,
  type BookingView,
  type CreateBookingDTO,
  type CreatePaymentDTO,
  type CreateProfessionalProfileDTO,
  type CreateUserDTO,
  type HealthCheck,
  type PaginatedResponse,
  type Payment,
  type PaymentStatus,
  type ProfessionalProfile,
  type ProfessionalProfileView,
  type SearchFilters,
  type UpdateBookingDTO,
  type UpdatePaymentDTO,
  type UpdateProfessionalProfileDTO,
  type UpdateUserDTO,
  type User,
  type UserView,
} from "./schemas";
