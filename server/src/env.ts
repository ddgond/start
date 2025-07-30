import dotenv from 'dotenv';
import { z } from 'zod/v4';

dotenv.config();

// dotenv validation
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']),
  DATABASE_URL: z.url(),
  ACCESS_TOKEN_SECRET: z.string().min(1),
  REFRESH_TOKEN_SECRET: z.string().min(1),
  HOST_PORT: z.string().optional(),
  OPENROUTER_API_KEY: z.string().min(1).optional(),
});
export const env = envSchema.parse(process.env);
