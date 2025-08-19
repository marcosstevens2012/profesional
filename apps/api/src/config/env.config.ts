import { z } from "zod";

export const EnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(3001),

  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("7d"),

  // CORS
  CORS_ORIGINS: z.string().transform(str => str.split(",")),

  // Rate Limiting
  RATE_LIMIT_TTL: z.coerce.number().default(60),
  RATE_LIMIT_MAX: z.coerce.number().default(100),

  // Swagger
  ENABLE_SWAGGER: z.coerce.boolean().default(false),

  // Sentry
  SENTRY_DSN: z.string().optional(),

  // Request ID
  REQUEST_ID_HEADER: z.string().default("x-request-id"),
});

export type Env = z.infer<typeof EnvSchema>;

export const validateEnv = (config: Record<string, unknown>): Env => {
  const result = EnvSchema.safeParse(config);

  if (!result.success) {
    throw new Error(
      `Invalid environment configuration: ${result.error.message}`
    );
  }

  return result.data;
};
