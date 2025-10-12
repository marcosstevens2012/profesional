// Version information
export * from "./version";

// All schemas and types
export * from "./schemas";

// Re-export commonly used schemas for convenience
export {
  // API utilities
  ApiResponseSchema,
  // Auth related
  AuthResponseSchema,
  AuthTokensSchema,
  AuthUserSchema,
  // Booking related
  BookingSchema,
  BookingStatusEnum,
  BookingViewSchema,
  CreateBookingSchema,
  CreatePaymentSchema,
  CreateProfessionalProfileSchema,
  CreateUserSchema,
  ForgotPasswordRequestSchema,
  HealthCheckSchema,
  LoginRequestSchema,
  MessageResponseSchema,
  PaginatedResponseSchema,
  // Payment related
  PaymentSchema,
  PaymentStatusEnum,
  // Professional related
  ProfessionalProfileSchema,
  ProfessionalProfileViewSchema,
  RefreshTokenRequestSchema,
  RegisterRequestSchema,
  ResetPasswordRequestSchema,
  SearchFiltersSchema,
  UpdateBookingSchema,
  UpdatePaymentSchema,
  UpdateProfessionalProfileSchema,
  UpdateUserSchema,
  // User related
  UserSchema,
  UserViewSchema,
  VerifyEmailRequestSchema,
  type ApiResponse,
  type AuthResponse,
  type AuthTokens,
  type AuthUser,
  type Booking,
  type BookingStatus,
  type BookingView,
  type CreateBookingDTO,
  type CreatePaymentDTO,
  type CreateProfessionalProfileDTO,
  type CreateUserDTO,
  type ForgotPasswordRequest,
  type HealthCheck,
  type LoginRequest,
  type MessageResponse,
  type PaginatedResponse,
  type Payment,
  type PaymentStatus,
  type ProfessionalProfile,
  type ProfessionalProfileView,
  type RefreshTokenRequest,
  type RegisterRequest,
  type ResetPasswordRequest,
  type SearchFilters,
  type UpdateBookingDTO,
  type UpdatePaymentDTO,
  type UpdateProfessionalProfileDTO,
  type UpdateUserDTO,
  type User,
  type UserView,
} from "./schemas";
