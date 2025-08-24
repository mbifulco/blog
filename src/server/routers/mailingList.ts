import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { getSubscriberCount, subscribe, subscribeSchema } from '@utils/resend';
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
    .mutation(async ({ input }: { input: z.infer<typeof subscribeSchema> }): Promise<SubscribeMutationResponse> => {
      const { email, firstName, lastName } = input;
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
