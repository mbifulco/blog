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
      const { email, firstName, lastName, honeypot, formLoadedAt } = input;

      // Fake success response for spam - makes spammers think they succeeded
      const fakeSuccess: SubscribeMutationResponse = {
        data: { id: 'fake-success' },
        error: null,
      };

      // 1. Rate limiting check (must have IP)
      if (ctx.clientIp) {
        const rateLimitResult = await checkSubscribeRateLimit(ctx.clientIp);
        if (!rateLimitResult.success) {
          throw new TRPCError({
            message: 'Too many subscription attempts. Please try again later.',
            code: 'TOO_MANY_REQUESTS',
          });
        }
      }

      // 2. Honeypot check - if filled, it's a bot
      if (isHoneypotFilled(honeypot)) {
        console.log('[Spam Detection] Honeypot triggered:', { email, firstName });
        return fakeSuccess;
      }

      // 3. Form timing check - if submitted too fast, it's a bot
      if (isFormSubmittedTooFast(formLoadedAt)) {
        console.log('[Spam Detection] Form submitted too fast:', {
          email,
          firstName,
          formLoadedAt,
          now: Date.now(),
        });
        return fakeSuccess;
      }

      // 4. Spam first name check
      if (isSpamFirstName(firstName)) {
        console.log('[Spam Detection] Spam first name detected:', {
          email,
          firstName,
        });
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
