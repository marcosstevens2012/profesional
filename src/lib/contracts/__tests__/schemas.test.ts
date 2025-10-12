import { describe, expect, it } from "vitest";
import {
  BookingSchema,
  CONTRACTS_VERSION,
  CreateBookingSchema,
  CreateProfessionalProfileSchema,
  CreateUserSchema,
  isCompatible,
  PaymentSchema,
  ProfessionalProfileSchema,
  SearchFiltersSchema,
  UserSchema,
} from "../index";

describe("User Schemas", () => {
  describe("UserSchema", () => {
    it("should validate a valid user", () => {
      const validUser = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        email: "test@example.com",
        name: "John Doe",
        avatar: "https://example.com/avatar.jpg",
        isActive: true,
        role: "client" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = UserSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const invalidUser = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        email: "invalid-email",
        name: "John Doe",
        isActive: true,
        role: "client" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = UserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    it("should reject empty name", () => {
      const invalidUser = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        email: "test@example.com",
        name: "",
        isActive: true,
        role: "client" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = UserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });
  });

  describe("CreateUserSchema", () => {
    it("should validate valid user creation data", () => {
      const validData = {
        email: "test@example.com",
        name: "John Doe",
        role: "professional" as const,
      };

      const result = CreateUserSchema.safeParse(validData);
      expect(result.success).toBe(true);
      expect(result.data?.role).toBe("professional");
    });

    it("should use default role if not provided", () => {
      const validData = {
        email: "test@example.com",
        name: "John Doe",
      };

      const result = CreateUserSchema.safeParse(validData);
      expect(result.success).toBe(true);
      expect(result.data?.role).toBe("client");
    });
  });
});

describe("ProfessionalProfile Schemas", () => {
  describe("ProfessionalProfileSchema", () => {
    it("should validate a valid professional profile", () => {
      const validProfile = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        userId: "123e4567-e89b-12d3-a456-426614174001",
        title: "Senior Software Developer",
        description: "Experienced developer specializing in React and Node.js",
        hourlyRate: 5000,
        currency: "ARS" as const,
        experience: 5,
        isVerified: false,
        isAvailable: true,
        rating: 4.5,
        reviewCount: 10,
        completedBookings: 15,
        profileImage: "https://example.com/profile.jpg",
        portfolio: ["https://example.com/project1.jpg"],
        certifications: ["AWS Certified"],
        languages: ["es", "en"] as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = ProfessionalProfileSchema.safeParse(validProfile);
      expect(result.success).toBe(true);
    });

    it("should reject negative hourly rate", () => {
      const invalidProfile = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        userId: "123e4567-e89b-12d3-a456-426614174001",
        title: "Developer",
        description: "Description",
        hourlyRate: -100,
        experience: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = ProfessionalProfileSchema.safeParse(invalidProfile);
      expect(result.success).toBe(false);
    });
  });

  describe("CreateProfessionalProfileSchema", () => {
    it("should validate valid creation data with defaults", () => {
      const validData = {
        title: "Developer",
        description: "Experienced developer",
        hourlyRate: 3000,
        experience: 3,
      };

      const result = CreateProfessionalProfileSchema.safeParse(validData);
      expect(result.success).toBe(true);
      expect(result.data?.currency).toBe("ARS");
      expect(result.data?.languages).toEqual(["es"]);
    });
  });
});

describe("Booking Schemas", () => {
  describe("BookingSchema", () => {
    it("should validate a valid booking", () => {
      const validBooking = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        clientId: "123e4567-e89b-12d3-a456-426614174001",
        professionalId: "123e4567-e89b-12d3-a456-426614174002",
        serviceDescription: "React development consultation",
        scheduledAt: new Date(),
        duration: 60,
        hourlyRate: 5000,
        totalAmount: 5000,
        currency: "ARS" as const,
        status: "confirmed" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = BookingSchema.safeParse(validBooking);
      expect(result.success).toBe(true);
    });

    it("should reject invalid duration", () => {
      const invalidBooking = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        clientId: "123e4567-e89b-12d3-a456-426614174001",
        professionalId: "123e4567-e89b-12d3-a456-426614174002",
        serviceDescription: "Consultation",
        scheduledAt: new Date(),
        duration: 15, // Less than minimum 30 minutes
        hourlyRate: 5000,
        totalAmount: 5000,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = BookingSchema.safeParse(invalidBooking);
      expect(result.success).toBe(false);
    });
  });

  describe("CreateBookingSchema", () => {
    it("should validate valid booking creation data", () => {
      const validData = {
        professionalId: "123e4567-e89b-12d3-a456-426614174000",
        serviceDescription: "React development help",
        scheduledAt: new Date(),
        duration: 120,
      };

      const result = CreateBookingSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });
});

describe("Payment Schemas", () => {
  describe("PaymentSchema", () => {
    it("should validate a valid payment", () => {
      const validPayment = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        bookingId: "123e4567-e89b-12d3-a456-426614174001",
        mercadoPagoId: "mp123456",
        preferenceId: "pref123456",
        amount: 5000,
        currency: "ARS" as const,
        status: "approved" as const,
        externalReference: "ref123456",
        description: "Payment for consultation",
        payerEmail: "client@example.com",
        installments: 1,
        fee: 250,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = PaymentSchema.safeParse(validPayment);
      expect(result.success).toBe(true);
    });

    it("should use default values correctly", () => {
      const minimalPayment = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        bookingId: "123e4567-e89b-12d3-a456-426614174001",
        amount: 5000,
        externalReference: "ref123456",
        description: "Payment description",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = PaymentSchema.safeParse(minimalPayment);
      expect(result.success).toBe(true);
      expect(result.data?.currency).toBe("ARS");
      expect(result.data?.status).toBe("pending");
      expect(result.data?.installments).toBe(1);
      expect(result.data?.fee).toBe(0);
    });
  });
});

describe("Search Schemas", () => {
  describe("SearchFiltersSchema", () => {
    it("should validate valid search filters", () => {
      const validFilters = {
        query: "React developer",
        minRate: 1000,
        maxRate: 10000,
        rating: 4,
        isVerified: true,
        languages: ["es", "en"] as const,
        sortBy: "rating" as const,
        page: 2,
        limit: 50,
      };

      const result = SearchFiltersSchema.safeParse(validFilters);
      expect(result.success).toBe(true);
    });

    it("should use default values", () => {
      const emptyFilters = {};

      const result = SearchFiltersSchema.safeParse(emptyFilters);
      expect(result.success).toBe(true);
      expect(result.data?.sortBy).toBe("relevance");
      expect(result.data?.page).toBe(1);
      expect(result.data?.limit).toBe(20);
    });

    it("should reject invalid limit", () => {
      const invalidFilters = {
        limit: 150, // Exceeds maximum of 100
      };

      const result = SearchFiltersSchema.safeParse(invalidFilters);
      expect(result.success).toBe(false);
    });
  });
});

describe("Version Management", () => {
  it("should have a valid version format", () => {
    expect(CONTRACTS_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("should check compatibility correctly", () => {
    expect(isCompatible("1.0.0")).toBe(true);
    expect(isCompatible("1.5.0")).toBe(true);
    expect(isCompatible("2.0.0")).toBe(false);
  });
});
