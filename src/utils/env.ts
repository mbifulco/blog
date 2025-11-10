import { createEnv } from '@t3-oss/env-nextjs';
import { vercel } from '@t3-oss/env-nextjs/presets-zod';
import { z } from 'zod';

export const env = createEnv({
  extends: [vercel()],
  server: {
    RESEND_API_KEY: z.string(),
    // Note: Resend renamed "audiences" to "segments" in their new API.
    // This env var works for both - use it as segment_id when calling Resend API.
    RESEND_NEWSLETTER_AUDIENCE_ID: z.string(),
    RESEND_SIGNING_SECRET: z.string(),
  },
  client: {
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1),
    NEXT_PUBLIC_FATHOM_ID: z.string().min(8),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().min(8),
  },
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  // see: https://env.t3.gg/docs/nextjs#create-your-schema
  experimental__runtimeEnv: {
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_FATHOM_ID: process.env.NEXT_PUBLIC_FATHOM_ID,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  },
});
