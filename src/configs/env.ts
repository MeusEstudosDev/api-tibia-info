import { Logger } from "@nestjs/common";
import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "testing", "homologation", "production"]),
  PORT: z.coerce.number(),
  DATABASE_URL: z.string().url(),
  URL_FRONT: z.string(),
  URL_BACK: z.string(),

  SECURITY_ALGORITHM: z.string(),
  SECURITY_SECRET: z.string(),
  SECURITY_SALT: z.coerce.number(),

  JWT_SECRET: z.string(),
  JWT_EXPIRES: z.string(),

  SALT_OR_ROUNDS: z.coerce.number(),

  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number(),
  SMTP_USER: z.string(),
  SMTP_PASSWORD: z.string(),

  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number(),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  Logger.error("❌ " + _env.error, "EnvSchema");
  Logger.error("❌ Invalid environment variables.", "EnvSchema");
  throw new Error("Invalid environment variables.");
}

const env = _env.data;

export { env };
