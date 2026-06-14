import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import {
  getSubscriberCount,
  isFormSubmittedTooFast,
  isHoneypotFilled,
  isSpamFirstName,
  subscribe,
  subscribeSchema,
} from '@utils/resend';
import { verifyTurnstileToken } from '@utils/turnstile';
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

      // Record a spam rejection: a dev-only console log plus a server-side
      // PostHog event. The server event matters because attacks that POST
      // directly to this API bypass the frontend, so the client-side
      // `newsletter/spam_detected` events never fire for them.
      const recordSpam = async (
        reason: string,
        extra?: Record<string, unknown>
      ) => {
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
          properties: { reason, source: 'newsletter-api', ...extra },
        });
      };

      // 1. Rate limiting check (must have IP)
      if (ctx.clientIp) {
        const rateLimitResult = await checkSubscribeRateLimit(ctx.clientIp);
        if (!rateLimitResult.success) {
          await recordSpam('rate_limited');
          throw new TRPCError({
            message: 'Too many subscription attempts. Please try again later.',
            code: 'TOO_MANY_REQUESTS',
          });
        }
      }

      // 1a. Origin allowlist check (cheap bonus — Turnstile is the real gate).
      // A same-origin browser fetch sends an Origin equal to our own host.
      if (!isRequestOriginAllowed(ctx.requestOrigin, ctx.requestHost)) {
        await recordSpam('bad_origin', {
          requestOrigin: ctx.requestOrigin,
          requestHost: ctx.requestHost,
        });
        return fakeSuccess;
      }

      // 1b. Turnstile verification (mandatory server-side bot gate).
      // Our frontend gates submission on having a token, so any request without
      // one did not come from us — treat as a bot and stay silent.
      if (!turnstileToken) {
        await recordSpam('turnstile_missing');
        return fakeSuccess;
      }

      const human = await verifyTurnstileToken(
        turnstileToken,
        ctx.clientIp ?? undefined
      );
      if (!human) {
        // Real users whose token expired or was reused (tokens are single-use,
        // ~300s) land here. Surface an error so they can retry.
        await recordSpam('turnstile_failed');
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: "Couldn't verify that you're human. Please try again.",
        });
      }

      // 2. Honeypot check - if filled, it's a bot
      if (isHoneypotFilled(honeypot)) {
        await recordSpam('honeypot');
        return fakeSuccess;
      }

      // 3. Form timing check - if submitted too fast, it's a bot
      if (isFormSubmittedTooFast(formLoadedAt)) {
        await recordSpam('form_too_fast', { formLoadedAt });
        return fakeSuccess;
      }

      // 4. Spam first name check
      if (isSpamFirstName(firstName)) {
        await recordSpam('suspicious_first_name');
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
});
