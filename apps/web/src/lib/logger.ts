import {
  captureException,
  captureMessage,
  setContext,
  setTag,
  setUser,
} from "@sentry/nextjs";

export const logger = {
  // Error logging
  error: (error: Error, context?: Record<string, any>) => {
    console.error(error);

    if (context) {
      setContext("error_context", context);
    }

    captureException(error);
  },

  // Info/Warning logging
  info: (message: string, extra?: Record<string, any>) => {
    console.info(message, extra);

    if (extra) {
      setContext("info_context", extra);
    }

    captureMessage(message, "info");
  },

  warn: (message: string, extra?: Record<string, any>) => {
    console.warn(message, extra);

    if (extra) {
      setContext("warning_context", extra);
    }

    captureMessage(message, "warning");
  },

  // User context
  setUser: (userId: string, email?: string, role?: string) => {
    setUser({
      id: userId,
      email,
      role,
    });
  },

  // Request context
  setRequestContext: (requestId: string, url: string, method: string) => {
    setTag("request_id", requestId);
    setContext("request", {
      url,
      method,
      timestamp: new Date().toISOString(),
    });
  },

  // Business context
  setBusinessContext: (
    type: "booking" | "payment" | "user" | "professional",
    id: string,
    data?: Record<string, any>
  ) => {
    setTag("business_entity", type);
    setTag("entity_id", id);

    if (data) {
      setContext(type, data);
    }
  },

  // Performance tracking
  timing: (name: string, duration: number, tags?: Record<string, string>) => {
    if (tags) {
      Object.entries(tags).forEach(([key, value]) => {
        setTag(key, value);
      });
    }

    captureMessage(`Performance: ${name} took ${duration}ms`, "info");
  },
};

// Error boundary helpers
export function logComponentError(
  error: Error,
  errorInfo: { componentStack: string }
) {
  setContext("component_error", {
    componentStack: errorInfo.componentStack,
    timestamp: new Date().toISOString(),
  });

  captureException(error);
}

// API error logging
export function logApiError(
  error: any,
  endpoint: string,
  method: string,
  statusCode?: number
) {
  setContext("api_error", {
    endpoint,
    method,
    statusCode,
    timestamp: new Date().toISOString(),
  });

  if (error instanceof Error) {
    captureException(error);
  } else {
    captureMessage(`API Error: ${endpoint} ${method} - ${error}`, "error");
  }
}

// Business logic errors
export const businessLogger = {
  paymentFailed: (paymentId: string, error: string, amount: number) => {
    logger.error(new Error(`Payment failed: ${error}`), {
      payment_id: paymentId,
      amount,
      business_flow: "payment_processing",
    });
  },

  bookingConflict: (
    professionalId: string,
    requestedTime: string,
    conflictingBookingId: string
  ) => {
    logger.warn("Booking time conflict detected", {
      professional_id: professionalId,
      requested_time: requestedTime,
      conflicting_booking_id: conflictingBookingId,
      business_flow: "booking_creation",
    });
  },

  userAuthenticationFailed: (email: string, reason: string) => {
    logger.warn("User authentication failed", {
      email,
      reason,
      business_flow: "authentication",
    });
  },

  professionalApplicationRejected: (professionalId: string, reason: string) => {
    logger.info("Professional application rejected", {
      professional_id: professionalId,
      reason,
      business_flow: "professional_approval",
    });
  },
};

// Initialize Sentry user context on auth
export function initializeUserContext(user: {
  id: string;
  email: string;
  role: string;
}) {
  logger.setUser(user.id, user.email, user.role);

  setTag("user_role", user.role);
  setContext("user_session", {
    login_time: new Date().toISOString(),
    user_id: user.id,
  });
}
