import { z } from 'zod';

const baseSchema = z.object({
  APP_ENV: z
    .enum(['local', 'development', 'staging', 'production'])
    .default('local'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

const parsed = baseSchema.parse({
  APP_ENV: process.env.APP_ENV ?? process.env.NEXT_PUBLIC_APP_ENV,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

// Require URL in production-like environments
if (parsed.APP_ENV === 'production' && !parsed.NEXT_PUBLIC_APP_URL) {
  throw new Error('NEXT_PUBLIC_APP_URL is required when APP_ENV=production');
}

export const env = parsed;
export type Env = z.infer<typeof baseSchema>;
