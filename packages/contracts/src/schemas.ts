import { z } from "zod";

// ===== COMMON SCHEMAS =====

export const IdSchema = z.string().uuid();
export const TimestampsSchema = z.object({
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

// ===== USER SCHEMAS =====

export const UserSchema = z
  .object({
    id: IdSchema,
    email: z.string().email(),
    name: z.string().min(1).max(100),
    avatar: z.string().url().optional(),
    isActive: z.boolean().default(true),
    role: z.enum(["client", "professional", "admin"]).default("client"),
  })
  .merge(TimestampsSchema);

export const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  avatar: z.string().url().optional(),
  role: z.enum(["client", "professional"]).default("client"),
});

export const UpdateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).max(100).optional(),
  avatar: z.string().url().optional(),
  isActive: z.boolean().optional(),
});

export const UserViewSchema = UserSchema.omit({
  updatedAt: true,
}).extend({
  profile: z.any().optional(),
});

// ===== PROFILE SCHEMAS =====

export const ProfileSchema = z
  .object({
    id: IdSchema,
    userId: IdSchema,
    phone: z
      .string()
      .regex(/^\+?[1-9]\d{1,14}$/)
      .optional(),
    bio: z.string().max(500).optional(),
    locationId: IdSchema.optional(),
  })
  .merge(TimestampsSchema);

export const CreateProfileSchema = z.object({
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/)
    .optional(),
  bio: z.string().max(500).optional(),
  locationId: IdSchema.optional(),
});

export const UpdateProfileSchema = CreateProfileSchema.partial();

// ===== PROFESSIONAL PROFILE SCHEMAS =====

export const ProfessionalProfileSchema = z
  .object({
    id: IdSchema,
    userId: IdSchema,
    title: z.string().min(1).max(200),
    description: z.string().max(2000),
    hourlyRate: z.number().min(0),
    currency: z.enum(["ARS", "USD"]).default("ARS"),
    experience: z.number().min(0).max(50),
    isVerified: z.boolean().default(false),
    isAvailable: z.boolean().default(true),
    rating: z.number().min(0).max(5).default(0),
    reviewCount: z.number().min(0).default(0),
    completedBookings: z.number().min(0).default(0),
    profileImage: z.string().url().optional(),
    portfolio: z.array(z.string().url()).default([]),
    certifications: z.array(z.string()).default([]),
    languages: z.array(z.enum(["es", "en", "pt"])).default(["es"]),
  })
  .merge(TimestampsSchema);

export const CreateProfessionalProfileSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000),
  hourlyRate: z.number().min(0),
  currency: z.enum(["ARS", "USD"]).default("ARS"),
  experience: z.number().min(0).max(50),
  profileImage: z.string().url().optional(),
  portfolio: z.array(z.string().url()).default([]),
  certifications: z.array(z.string()).default([]),
  languages: z.array(z.enum(["es", "en", "pt"])).default(["es"]),
});

export const UpdateProfessionalProfileSchema =
  CreateProfessionalProfileSchema.partial();

export const ProfessionalProfileViewSchema = ProfessionalProfileSchema.extend({
  user: UserViewSchema,
  serviceCategories: z.array(z.any()).optional(),
  location: z.any().optional(),
});

// ===== SERVICE CATEGORY SCHEMAS =====

export const ServiceCategorySchema = z
  .object({
    id: IdSchema,
    name: z.string().min(1).max(100),
    slug: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    icon: z.string().optional(),
    isActive: z.boolean().default(true),
    parentId: IdSchema.optional(),
  })
  .merge(TimestampsSchema);

export const CreateServiceCategorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  icon: z.string().optional(),
  parentId: IdSchema.optional(),
});

export const UpdateServiceCategorySchema =
  CreateServiceCategorySchema.partial();

// ===== SERVICE TAG SCHEMAS =====

export const ServiceTagSchema = z
  .object({
    id: IdSchema,
    name: z.string().min(1).max(50),
    slug: z.string().min(1).max(50),
    color: z
      .string()
      .regex(/^#[0-9A-F]{6}$/i)
      .default("#6366F1"),
    isActive: z.boolean().default(true),
  })
  .merge(TimestampsSchema);

export const CreateServiceTagSchema = z.object({
  name: z.string().min(1).max(50),
  slug: z.string().min(1).max(50),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i)
    .default("#6366F1"),
});

export const UpdateServiceTagSchema = CreateServiceTagSchema.partial();

// ===== LOCATION SCHEMAS =====

export const LocationSchema = z
  .object({
    id: IdSchema,
    country: z.string().default("Argentina"),
    province: z.string().min(1).max(100),
    city: z.string().min(1).max(100),
    zipCode: z.string().max(10).optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
  })
  .merge(TimestampsSchema);

export const CreateLocationSchema = z.object({
  country: z.string().default("Argentina"),
  province: z.string().min(1).max(100),
  city: z.string().min(1).max(100),
  zipCode: z.string().max(10).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export const UpdateLocationSchema = CreateLocationSchema.partial();

// ===== AVAILABILITY SLOT SCHEMAS =====

export const AvailabilitySlotSchema = z
  .object({
    id: IdSchema,
    professionalId: IdSchema,
    dayOfWeek: z.number().min(0).max(6), // 0 = Sunday
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/), // HH:MM format
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    isActive: z.boolean().default(true),
  })
  .merge(TimestampsSchema);

export const CreateAvailabilitySlotSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
});

export const UpdateAvailabilitySlotSchema =
  CreateAvailabilitySlotSchema.partial();

// ===== BOOKING SCHEMAS =====

export const BookingStatusEnum = z.enum([
  "draft",
  "pending_payment",
  "paid",
  "confirmed",
  "in_progress",
  "completed",
  "canceled",
  "no_show",
]);

export const BookingSchema = z
  .object({
    id: IdSchema,
    clientId: IdSchema,
    professionalId: IdSchema,
    serviceDescription: z.string().max(1000),
    scheduledAt: z.coerce.date(),
    duration: z.number().min(30).max(480), // minutes: 30min - 8h
    hourlyRate: z.number().min(0),
    totalAmount: z.number().min(0),
    currency: z.enum(["ARS", "USD"]).default("ARS"),
    status: BookingStatusEnum.default("draft"),
    notes: z.string().max(2000).optional(),
    cancelReason: z.string().max(500).optional(),
    canceledAt: z.coerce.date().optional(),
    canceledBy: IdSchema.optional(),
  })
  .merge(TimestampsSchema);

export const CreateBookingSchema = z.object({
  professionalId: IdSchema,
  serviceDescription: z.string().max(1000),
  scheduledAt: z.coerce.date(),
  duration: z.number().min(30).max(480),
  notes: z.string().max(2000).optional(),
});

export const UpdateBookingSchema = z.object({
  scheduledAt: z.coerce.date().optional(),
  duration: z.number().min(30).max(480).optional(),
  serviceDescription: z.string().max(1000).optional(),
  status: BookingStatusEnum.optional(),
  notes: z.string().max(2000).optional(),
  cancelReason: z.string().max(500).optional(),
});

export const BookingViewSchema = BookingSchema.extend({
  client: UserViewSchema,
  professional: ProfessionalProfileViewSchema,
  payment: z.any().optional(),
});

// ===== PAYMENT SCHEMAS =====

export const PaymentStatusEnum = z.enum([
  "pending",
  "approved",
  "rejected",
  "cancelled",
  "refunded",
  "partially_refunded",
]);

export const PaymentSchema = z
  .object({
    id: IdSchema,
    bookingId: IdSchema,
    mercadoPagoId: z.string().optional(),
    preferenceId: z.string().optional(),
    amount: z.number().min(0),
    currency: z.enum(["ARS", "USD"]).default("ARS"),
    status: PaymentStatusEnum.default("pending"),
    externalReference: z.string(),
    description: z.string().max(500),
    payerEmail: z.string().email().optional(),
    paymentMethodId: z.string().optional(),
    installments: z.number().min(1).default(1),
    transactionAmount: z.number().min(0).optional(),
    netReceivedAmount: z.number().min(0).optional(),
    totalPaidAmount: z.number().min(0).optional(),
    fee: z.number().min(0).default(0),
    paidAt: z.coerce.date().optional(),
  })
  .merge(TimestampsSchema);

export const CreatePaymentSchema = z.object({
  bookingId: IdSchema,
  amount: z.number().min(0),
  currency: z.enum(["ARS", "USD"]).default("ARS"),
  externalReference: z.string(),
  description: z.string().max(500),
  payerEmail: z.string().email().optional(),
});

export const UpdatePaymentSchema = z.object({
  mercadoPagoId: z.string().optional(),
  preferenceId: z.string().optional(),
  status: PaymentStatusEnum.optional(),
  paymentMethodId: z.string().optional(),
  installments: z.number().min(1).optional(),
  transactionAmount: z.number().min(0).optional(),
  netReceivedAmount: z.number().min(0).optional(),
  totalPaidAmount: z.number().min(0).optional(),
  fee: z.number().min(0).optional(),
  paidAt: z.coerce.date().optional(),
});

// ===== PAYMENT EVENT SCHEMAS =====

export const PaymentEventSchema = z
  .object({
    id: IdSchema,
    paymentId: IdSchema,
    eventType: z.string(), // payment.created, payment.updated, etc.
    action: z.string().optional(),
    apiVersion: z.string().optional(),
    dataId: z.string().optional(),
    dateCreated: z.coerce.date(),
    rawData: z.record(z.any()), // Store raw MP webhook data
    processed: z.boolean().default(false),
    processedAt: z.coerce.date().optional(),
    error: z.string().optional(),
  })
  .merge(TimestampsSchema);

export const CreatePaymentEventSchema = z.object({
  paymentId: IdSchema.optional(),
  eventType: z.string(),
  action: z.string().optional(),
  apiVersion: z.string().optional(),
  dataId: z.string().optional(),
  dateCreated: z.coerce.date(),
  rawData: z.record(z.any()),
});

// ===== CONVERSATION SCHEMAS =====

export const ConversationSchema = z
  .object({
    id: IdSchema,
    bookingId: IdSchema,
    clientId: IdSchema,
    professionalId: IdSchema,
    isActive: z.boolean().default(true),
    lastMessageAt: z.coerce.date().optional(),
  })
  .merge(TimestampsSchema);

export const CreateConversationSchema = z.object({
  bookingId: IdSchema,
  clientId: IdSchema,
  professionalId: IdSchema,
});

// ===== MESSAGE SCHEMAS =====

export const MessageTypeEnum = z.enum(["text", "image", "file", "system"]);

export const MessageSchema = z
  .object({
    id: IdSchema,
    conversationId: IdSchema,
    senderId: IdSchema,
    content: z.string().max(4000),
    type: MessageTypeEnum.default("text"),
    fileUrl: z.string().url().optional(),
    fileName: z.string().optional(),
    fileSize: z.number().optional(),
    isRead: z.boolean().default(false),
    readAt: z.coerce.date().optional(),
  })
  .merge(TimestampsSchema);

export const CreateMessageSchema = z.object({
  conversationId: IdSchema,
  content: z.string().max(4000),
  type: MessageTypeEnum.default("text"),
  fileUrl: z.string().url().optional(),
  fileName: z.string().optional(),
  fileSize: z.number().optional(),
});

export const MessageViewSchema = MessageSchema.extend({
  sender: UserViewSchema,
});

// ===== REVIEW SCHEMAS =====

export const ReviewSchema = z
  .object({
    id: IdSchema,
    bookingId: IdSchema,
    clientId: IdSchema,
    professionalId: IdSchema,
    rating: z.number().min(1).max(5),
    comment: z.string().max(1000).optional(),
    isPublic: z.boolean().default(true),
    response: z.string().max(500).optional(), // Professional response
    respondedAt: z.coerce.date().optional(),
  })
  .merge(TimestampsSchema);

export const CreateReviewSchema = z.object({
  bookingId: IdSchema,
  professionalId: IdSchema,
  rating: z.number().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export const UpdateReviewSchema = z.object({
  comment: z.string().max(1000).optional(),
  isPublic: z.boolean().optional(),
});

export const CreateReviewResponseSchema = z.object({
  response: z.string().max(500),
});

export const ReviewViewSchema = ReviewSchema.extend({
  client: UserViewSchema,
  booking: z.object({
    serviceDescription: z.string(),
    scheduledAt: z.coerce.date(),
  }),
});

// ===== NOTIFICATION SCHEMAS =====

export const NotificationTypeEnum = z.enum([
  "booking_created",
  "booking_confirmed",
  "booking_cancelled",
  "booking_reminder",
  "payment_received",
  "payment_failed",
  "new_message",
  "review_received",
  "profile_updated",
  "system",
]);

export const NotificationSchema = z
  .object({
    id: IdSchema,
    userId: IdSchema,
    type: NotificationTypeEnum,
    title: z.string().max(200),
    message: z.string().max(1000),
    data: z.record(z.any()).optional(), // Additional context data
    isRead: z.boolean().default(false),
    readAt: z.coerce.date().optional(),
    actionUrl: z.string().url().optional(),
  })
  .merge(TimestampsSchema);

export const CreateNotificationSchema = z.object({
  userId: IdSchema,
  type: NotificationTypeEnum,
  title: z.string().max(200),
  message: z.string().max(1000),
  data: z.record(z.any()).optional(),
  actionUrl: z.string().url().optional(),
});

export const UpdateNotificationSchema = z.object({
  isRead: z.boolean(),
  readAt: z.coerce.date().optional(),
});

// ===== COMMISSION RULE SCHEMAS =====

export const CommissionTypeEnum = z.enum(["percentage", "fixed"]);

export const CommissionRuleSchema = z
  .object({
    id: IdSchema,
    name: z.string().max(100),
    type: CommissionTypeEnum,
    value: z.number().min(0), // Percentage (0-100) or fixed amount
    minAmount: z.number().min(0).optional(),
    maxAmount: z.number().min(0).optional(),
    isActive: z.boolean().default(true),
    validFrom: z.coerce.date().optional(),
    validUntil: z.coerce.date().optional(),
  })
  .merge(TimestampsSchema);

export const CreateCommissionRuleSchema = z.object({
  name: z.string().max(100),
  type: CommissionTypeEnum,
  value: z.number().min(0),
  minAmount: z.number().min(0).optional(),
  maxAmount: z.number().min(0).optional(),
  validFrom: z.coerce.date().optional(),
  validUntil: z.coerce.date().optional(),
});

export const UpdateCommissionRuleSchema = CreateCommissionRuleSchema.partial();

// ===== API RESPONSE SCHEMAS =====

export const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.unknown().optional(),
  errors: z.array(z.string()).optional(),
});

export const PaginatedResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(z.unknown()),
  pagination: z.object({
    page: z.number().min(1),
    limit: z.number().min(1).max(100),
    total: z.number().min(0),
    totalPages: z.number().min(0),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  }),
  message: z.string().optional(),
});

// ===== SEARCH & FILTER SCHEMAS =====

export const SearchFiltersSchema = z.object({
  query: z.string().optional(),
  categoryId: IdSchema.optional(),
  locationId: IdSchema.optional(),
  minRate: z.number().min(0).optional(),
  maxRate: z.number().min(0).optional(),
  rating: z.number().min(0).max(5).optional(),
  isVerified: z.boolean().optional(),
  languages: z.array(z.enum(["es", "en", "pt"])).optional(),
  sortBy: z
    .enum(["relevance", "rating", "price_low", "price_high", "newest"])
    .default("relevance"),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

// ===== HEALTH CHECK SCHEMAS =====

export const HealthCheckSchema = z.object({
  status: z.literal("ok"),
  timestamp: z.string(),
  uptime: z.number(),
  version: z.string().optional(),
});

// ===== TYPE EXPORTS =====

export type User = z.infer<typeof UserSchema>;
export type CreateUserDTO = z.infer<typeof CreateUserSchema>;
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;
export type UserView = z.infer<typeof UserViewSchema>;

export type Profile = z.infer<typeof ProfileSchema>;
export type CreateProfileDTO = z.infer<typeof CreateProfileSchema>;
export type UpdateProfileDTO = z.infer<typeof UpdateProfileSchema>;

export type ProfessionalProfile = z.infer<typeof ProfessionalProfileSchema>;
export type CreateProfessionalProfileDTO = z.infer<
  typeof CreateProfessionalProfileSchema
>;
export type UpdateProfessionalProfileDTO = z.infer<
  typeof UpdateProfessionalProfileSchema
>;
export type ProfessionalProfileView = z.infer<
  typeof ProfessionalProfileViewSchema
>;

export type ServiceCategory = z.infer<typeof ServiceCategorySchema>;
export type CreateServiceCategoryDTO = z.infer<
  typeof CreateServiceCategorySchema
>;
export type UpdateServiceCategoryDTO = z.infer<
  typeof UpdateServiceCategorySchema
>;

export type ServiceTag = z.infer<typeof ServiceTagSchema>;
export type CreateServiceTagDTO = z.infer<typeof CreateServiceTagSchema>;
export type UpdateServiceTagDTO = z.infer<typeof UpdateServiceTagSchema>;

export type Location = z.infer<typeof LocationSchema>;
export type CreateLocationDTO = z.infer<typeof CreateLocationSchema>;
export type UpdateLocationDTO = z.infer<typeof UpdateLocationSchema>;

export type AvailabilitySlot = z.infer<typeof AvailabilitySlotSchema>;
export type CreateAvailabilitySlotDTO = z.infer<
  typeof CreateAvailabilitySlotSchema
>;
export type UpdateAvailabilitySlotDTO = z.infer<
  typeof UpdateAvailabilitySlotSchema
>;

export type Booking = z.infer<typeof BookingSchema>;
export type CreateBookingDTO = z.infer<typeof CreateBookingSchema>;
export type UpdateBookingDTO = z.infer<typeof UpdateBookingSchema>;
export type BookingView = z.infer<typeof BookingViewSchema>;
export type BookingStatus = z.infer<typeof BookingStatusEnum>;

export type Payment = z.infer<typeof PaymentSchema>;
export type CreatePaymentDTO = z.infer<typeof CreatePaymentSchema>;
export type UpdatePaymentDTO = z.infer<typeof UpdatePaymentSchema>;
export type PaymentStatus = z.infer<typeof PaymentStatusEnum>;

export type PaymentEvent = z.infer<typeof PaymentEventSchema>;
export type CreatePaymentEventDTO = z.infer<typeof CreatePaymentEventSchema>;

export type Conversation = z.infer<typeof ConversationSchema>;
export type CreateConversationDTO = z.infer<typeof CreateConversationSchema>;

export type Message = z.infer<typeof MessageSchema>;
export type CreateMessageDTO = z.infer<typeof CreateMessageSchema>;
export type MessageView = z.infer<typeof MessageViewSchema>;
export type MessageType = z.infer<typeof MessageTypeEnum>;

export type Review = z.infer<typeof ReviewSchema>;
export type CreateReviewDTO = z.infer<typeof CreateReviewSchema>;
export type UpdateReviewDTO = z.infer<typeof UpdateReviewSchema>;
export type CreateReviewResponseDTO = z.infer<
  typeof CreateReviewResponseSchema
>;
export type ReviewView = z.infer<typeof ReviewViewSchema>;

export type Notification = z.infer<typeof NotificationSchema>;
export type CreateNotificationDTO = z.infer<typeof CreateNotificationSchema>;
export type UpdateNotificationDTO = z.infer<typeof UpdateNotificationSchema>;
export type NotificationType = z.infer<typeof NotificationTypeEnum>;

export type CommissionRule = z.infer<typeof CommissionRuleSchema>;
export type CreateCommissionRuleDTO = z.infer<
  typeof CreateCommissionRuleSchema
>;
export type UpdateCommissionRuleDTO = z.infer<
  typeof UpdateCommissionRuleSchema
>;
export type CommissionType = z.infer<typeof CommissionTypeEnum>;

export type ApiResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
};

export type PaginatedResponse<T = unknown> = {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  message?: string;
};

export type SearchFilters = z.infer<typeof SearchFiltersSchema>;
export type HealthCheck = z.infer<typeof HealthCheckSchema>;
