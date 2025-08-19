import { z } from "zod";

// Schema para variables de entorno del cliente (NEXT_PUBLIC_*)
const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY: z.string().min(1),
  NEXT_PUBLIC_JITSI_DOMAIN: z.string().min(1).default("meet.jit.si"),
});

// Schema para variables de entorno del servidor
const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(3000),
});

// Validación en build time
const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY:
    process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY,
  NEXT_PUBLIC_JITSI_DOMAIN: process.env.NEXT_PUBLIC_JITSI_DOMAIN,
});

const serverEnv = serverEnvSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
});

export { clientEnv, serverEnv };

// Tipos inferidos
export type ClientEnv = z.infer<typeof clientEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;
