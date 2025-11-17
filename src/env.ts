import { z } from 'zod'

export const envSchema = z.object({
  MODE: z.enum(['production', 'development', 'test']),
  VITE_PUBLIC_API_URL: z.string(),
  VITE_MANAGER_API_URL: z.string(),
  VITE_APP_MENU_URL: z.string(),
  VITE_STRIPE_PUBLIC_KEY: z.string(),
  VITE_GRACE_PERIOD_DAYS: z.string().transform((value) => {
    const num = Number(value)
    return Number.isFinite(num) ? num : 3
  }),
  VITE_ENABLE_API_DELAY: z.string().transform((value) => value === 'true'),
})

export const env = envSchema.parse(import.meta.env)
