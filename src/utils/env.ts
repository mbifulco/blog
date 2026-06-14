import { createEnv } from '@t3-oss/env-nextjs';
import { vercel } from '@t3-oss/env-nextjs/presets-zod';
import { z } from 'zod';

// In Vercel production, the real Turnstile keys are REQUIRED — a missing key must
// fail the build/boot loudly rather than silently fall back to the always-pass test
// keys (which would disable bot protection entirely). Locally and in CI/preview we
// default to Cloudflare's official always-pass test keys so dev and tests work
// without secrets.
const isVercelProduction = process.env.VERCEL_ENV === 'production';
const TURNSTILE_TEST_SECRET_KEY = '1x0000000000000000000000000000000AA';
// Cloudflare's always-pass *invisible* test site key, so the dev widget is
// hidden (matching the `interaction-only` appearance used in production).
// Use '1x00000000000000000000AA' instead if you want the visible test box.
const TURNSTILE_TEST_SITE_KEY = '1x00000000000000000000BB';

export const env = createEnv({
  extends: [vercel()],
  server: {
    RESEND_API_KEY: z.string(),
    // Note: Resend renamed "audiences" to "segments" in their new API.
    // This env var works for both - use it as segment_id when calling Resend API.
    RESEND_NEWSLETTER_AUDIENCE_ID: z.string(),
    RESEND_SIGNING_SECRET: z.string(),
    // PostHog Personal API key for sourcemap uploads
    POSTHOG_PERSONAL_API_KEY: z.string().optional(),
    // Upstash Redis for rate limiting
    UPSTASH_REDIS_REST_URL: z.string(),
    UPSTASH_REDIS_REST_TOKEN: z.string(),
    // Cloudflare Turnstile bot protection secret key.
    // Required in Vercel production; defaults to the always-pass test secret elsewhere.
    TURNSTILE_SECRET_KEY: isVercelProduction
      ? z.string().min(1)
      : z.string().default(TURNSTILE_TEST_SECRET_KEY),
  },
  client: {
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1),
    NEXT_PUBLIC_FATHOM_ID: z.string().min(8),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().min(8),
    NEXT_PUBLIC_POSTHOG_HOST: z.url().optional(),
    NEXT_PUBLIC_POSTHOG_PROJECT_ID: z.string().optional(),
    // Cloudflare Turnstile bot protection site key (public).
    // Required in Vercel production; defaults to the always-pass test site key elsewhere.
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: isVercelProduction
      ? z.string().min(1)
      : z.string().default(TURNSTILE_TEST_SITE_KEY),
  },
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  // see: https://env.t3.gg/docs/nextjs#create-your-schema
  experimental__runtimeEnv: {
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_FATHOM_ID: process.env.NEXT_PUBLIC_FATHOM_ID,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_POSTHOG_PROJECT_ID: process.env.NEXT_PUBLIC_POSTHOG_PROJECT_ID,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  },
});
