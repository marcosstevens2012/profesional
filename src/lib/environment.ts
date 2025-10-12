import { z } from "zod";

// Web app environment validation schema
export const webEnvironmentSchema = z.object({
  // Common
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // Public API Configuration
  NEXT_PUBLIC_API_URL: z.string().url({
    message: "NEXT_PUBLIC_API_URL must be a valid URL",
  }),

  NEXT_PUBLIC_APP_URL: z.string().url({
    message: "NEXT_PUBLIC_APP_URL must be a valid URL",
  }),

  // Optional observability (public)
  NEXT_PUBLIC_POSTHOG_KEY: z.string().startsWith("phc_").optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),

  // Feature flags
  NEXT_PUBLIC_ENABLE_ANALYTICS: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
  NEXT_PUBLIC_ENABLE_DEBUG: z
    .string()
    .transform((val) => val === "true")
    .default("false"),

  // Server-side only (for API routes, etc.)
  SENTRY_DSN: z.string().url().optional(),
  POSTHOG_KEY: z.string().startsWith("phc_").optional(),
});

export type WebEnvironmentVariables = z.infer<typeof webEnvironmentSchema>;

export function validateWebEnvironment(): WebEnvironmentVariables {
  try {
    const env = {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
      NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
      NEXT_PUBLIC_ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS,
      NEXT_PUBLIC_ENABLE_DEBUG: process.env.NEXT_PUBLIC_ENABLE_DEBUG,
      SENTRY_DSN: process.env.SENTRY_DSN,
      POSTHOG_KEY: process.env.POSTHOG_KEY,
    };

    const validated = webEnvironmentSchema.parse(env);

    // Additional validations
    if (validated.NODE_ENV === "production") {
      if (validated.NEXT_PUBLIC_API_URL.includes("localhost")) {
        console.warn(
          "⚠️  NEXT_PUBLIC_API_URL points to localhost in production"
        );
      }

      if (validated.NEXT_PUBLIC_APP_URL.includes("localhost")) {
        console.warn(
          "⚠️  NEXT_PUBLIC_APP_URL points to localhost in production"
        );
      }

      if (!validated.NEXT_PUBLIC_POSTHOG_KEY) {
        console.warn(
          "⚠️  NEXT_PUBLIC_POSTHOG_KEY not set - analytics disabled in production"
        );
      }

      if (!validated.NEXT_PUBLIC_SENTRY_DSN) {
        console.warn(
          "⚠️  NEXT_PUBLIC_SENTRY_DSN not set - error tracking disabled in production"
        );
      }
    }

    return validated;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(
        (err) => `${err.path.join(".")}: ${err.message}`
      );
      throw new Error(
        `Web environment validation failed:\n${errorMessages.join("\n")}`
      );
    }
    throw error;
  }
}

// Utility to get environment variables in a type-safe way
export function getWebConfig() {
  return validateWebEnvironment();
}

// For use in Next.js pages/components
export function getPublicConfig() {
  const config = getWebConfig();
  return {
    apiUrl: config.NEXT_PUBLIC_API_URL,
    appUrl: config.NEXT_PUBLIC_APP_URL,
    posthogKey: config.NEXT_PUBLIC_POSTHOG_KEY,
    sentryDsn: config.NEXT_PUBLIC_SENTRY_DSN,
    enableAnalytics: config.NEXT_PUBLIC_ENABLE_ANALYTICS,
    enableDebug: config.NEXT_PUBLIC_ENABLE_DEBUG,
    isProduction: config.NODE_ENV === "production",
    isDevelopment: config.NODE_ENV === "development",
  };
}
