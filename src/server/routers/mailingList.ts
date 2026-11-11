import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import {
  emailIsBad,
  getSubscriberCount,
  isFormSubmittedTooFast,
  isHoneypotFilled,
  isSpamFirstName,
  subscribe,
  subscribeSchema,
} from '@utils/resend';
import { verifyTurnstileToken } from '@utils/turnstile';
import { recordBlockedSignup } from '../blockedSignups';
import { isRequestOriginAllowed } from '../origin';
import { captureServerEvent } from '../posthog';
import { checkSubscribeRateLimit } from '../rateLimit';
import { procedure, router } from '../trpc';

// Define the return type for the subscribe mutation
const subscribeResponseSchema = z.union([
  z.object({
    data: z.object({
      id: z.string(),
    }),
    error: z.null(),
  }),
  z.object({
    data: z.null(),
    error: z.object({
      name: z.literal('already_subscribed'),
      message: z.string(),
    }),
  }),
]);

export type SubscribeMutationResponse = z.infer<typeof subscribeResponseSchema>;

export const reportBlockedSignupSchema = z.object({
  email: z.string().email().max(254),
  firstName: z.string().max(100).optional(),
  source: z.string().max(64).optional(),
  path: z
    .string()
    .max(300)
    .regex(/^\/[^\s]*$/),
  reason: z.string().regex(/^[\w-]{1,64}$/),
  honeypot: z.string().max(200).optional(),
  formLoadedAt: z.number().optional(),
});

const MAX_FORM_CLOCK_SKEW_MS = 60 * 1000;
const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1000;

// Record a spam rejection: a dev-only console log plus a server-side
// PostHog event. The server event matters because attacks that POST
// directly to this API bypass the frontend, so the client-side
// `newsletter/spam_detected` events never fire for them.
const recordSpam = async ({
  email,
  firstName,
  source,
  reason,
  extra,
}: {
  email: string;
  firstName?: string;
  source: string;
  reason: string;
  extra?: Record<string, unknown>;
}) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Spam Detection] ${reason}:`, {
      email,
      firstName,
      ...extra,
    });
  }
  await captureServerEvent({
    distinctId: email,
    event: 'newsletter/spam_detected',
    properties: { reason, source, ...extra },
  });
};

export const mailingListRouter = router({
  stats: procedure.query(async () => {
    const subscriberCount = await getSubscriberCount();

    return {
      subscribers: subscriberCount,
    };
  }),
  subscribe: procedure
    .input(subscribeSchema)
    .output(subscribeResponseSchema)
    .mutation(async ({ input, ctx }): Promise<SubscribeMutationResponse> => {
      const {
        email,
        firstName,
        lastName,
        honeypot,
        formLoadedAt,
        turnstileToken,
      } = input;

      // Fake success response for spam - makes spammers think they succeeded
      const fakeSuccess: SubscribeMutationResponse = {
        data: { id: 'fake-success' },
        error: null,
      };

      const recordSubscribeSpam = (
        reason: string,
        extra?: Record<string, unknown>
      ) =>
        recordSpam({
          email,
          firstName,
          source: 'newsletter-api',
          reason,
          extra,
        });

      // 1. Rate limiting check (must have IP)
      if (ctx.clientIp) {
        const rateLimitResult = await checkSubscribeRateLimit(ctx.clientIp);
        if (!rateLimitResult.success) {
          await recordSubscribeSpam('rate_limited');
          throw new TRPCError({
            message: 'Too many subscription attempts. Please try again later.',
            code: 'TOO_MANY_REQUESTS',
          });
        }
      }

      // 1a. Origin allowlist check (cheap bonus — Turnstile is the real gate).
      // A same-origin browser fetch sends an Origin equal to our own host.
      if (!isRequestOriginAllowed(ctx.requestOrigin, ctx.requestHost)) {
        await recordSubscribeSpam('bad_origin', {
          requestOrigin: ctx.requestOrigin,
          requestHost: ctx.requestHost,
        });
        return fakeSuccess;
      }

      // 1b. Turnstile verification (mandatory server-side bot gate).
      // Our frontend gates submission on having a token, so any request without
      // one did not come from us — treat as a bot and stay silent.
      if (!turnstileToken) {
        await recordSubscribeSpam('turnstile_missing');
        return fakeSuccess;
      }

      const human = await verifyTurnstileToken(
        turnstileToken,
        ctx.clientIp ?? undefined
      );
      if (!human) {
        // Real users whose token expired or was reused (tokens are single-use,
        // ~300s) land here. Surface an error so they can retry.
        await recordSubscribeSpam('turnstile_failed');
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: "Couldn't verify that you're human. Please try again.",
        });
      }

      // 2. Honeypot check - if filled, it's a bot
      if (isHoneypotFilled(honeypot)) {
        await recordSubscribeSpam('honeypot');
        return fakeSuccess;
      }

      // 3. Form timing check - if submitted too fast, it's a bot
      if (isFormSubmittedTooFast(formLoadedAt)) {
        await recordSubscribeSpam('form_too_fast', { formLoadedAt });
        return fakeSuccess;
      }

      // 4. Spam first name check
      if (isSpamFirstName(firstName)) {
        await recordSubscribeSpam('suspicious_first_name');
        return fakeSuccess;
      }

      try {
        const res = await subscribe({
          email,
          firstName,
          lastName,
        });

        // Validate the response matches our expected schema
        return subscribeResponseSchema.parse(res);
      } catch (e) {
        // If it's a Zod validation error, provide better error details
        if (e instanceof z.ZodError) {
          throw new TRPCError({
            message: 'Validation failed',
            code: 'BAD_REQUEST',
            cause: e,
          });
        }

        // If it's already a TRPC error, re-throw it
        if (e instanceof TRPCError) {
          throw e;
        }

        // For other errors, provide a generic message
        throw new TRPCError({
          message: 'Error subscribing to newsletter',
          code: 'INTERNAL_SERVER_ERROR',
          cause: (e as Error).message || undefined,
        });
      }
    }),
  reportBlockedSignup: procedure
    .input(reportBlockedSignupSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, firstName, source, path, reason, honeypot, formLoadedAt } =
        input;

      const drop = async (
        spamReason: string,
        extra?: Record<string, unknown>
      ) => {
        await recordSpam({
          email,
          firstName,
          source: 'newsletter-blocked-report',
          reason: spamReason,
          extra,
        });
        return { ok: true };
      };

      // Without an IP there is nothing to rate limit on, and every stored
      // report becomes an email to the owner.
      if (!ctx.clientIp) return drop('missing_ip');

      const rateLimitResult = await checkSubscribeRateLimit(ctx.clientIp);
      if (!rateLimitResult.success) {
        await drop('rate_limited');
        throw new TRPCError({
          message: 'Too many subscription attempts. Please try again later.',
          code: 'TOO_MANY_REQUESTS',
        });
      }

      if (!isRequestOriginAllowed(ctx.requestOrigin, ctx.requestHost)) {
        return drop('bad_origin', {
          requestOrigin: ctx.requestOrigin,
          requestHost: ctx.requestHost,
        });
      }

      if (isHoneypotFilled(honeypot)) return drop('honeypot');

      // The real form always sends formLoadedAt; bots POSTing straight to the
      // API do not.
      if (!formLoadedAt) return drop('missing_form_timing');

      const now = Date.now();
      if (
        formLoadedAt > now + MAX_FORM_CLOCK_SKEW_MS ||
        formLoadedAt < now - MAX_FORM_AGE_MS
      ) {
        return drop('implausible_form_timing', { formLoadedAt });
      }

      if (isFormSubmittedTooFast(formLoadedAt)) {
        return drop('form_too_fast', { formLoadedAt });
      }

      if (isSpamFirstName(firstName)) return drop('suspicious_first_name');

      if (emailIsBad(email)) return drop('bad_email');

      try {
        const outcome = await recordBlockedSignup({
          email,
          firstName,
          source,
          path,
          reason,
          at: new Date().toISOString(),
        });
        if (outcome === 'full') return drop('daily_cap');
        if (outcome === 'stored') {
          await captureServerEvent({
            distinctId: email,
            event: 'newsletter/blocked_signup_reported',
            properties: { reason, source, path },
          });
        }
      } catch (e) {
        console.error('Error storing blocked signup:', e);
      }

      return { ok: true };
    }),
});
