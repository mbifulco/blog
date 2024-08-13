import { vercel } from '@t3-oss/env-core/presets';
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  extends: [vercel()],
  server: {
    CONVERTKIT_API_SECRET: z.string(),
    RESEND_API_KEY: z.string(),
    RESEND_NEWSLETTER_AUDIENCE_ID: z.string(),
  },
  client: {
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1),
    NEXT_PUBLIC_FATHOM_ID: z.string().min(8),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().min(8),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().url(),
  },
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  // see: https://env.t3.gg/docs/nextjs#create-your-schema
  experimental__runtimeEnv: {
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_FATHOM_ID: process.env.NEXT_PUBLIC_FATHOM_ID,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  },
});
