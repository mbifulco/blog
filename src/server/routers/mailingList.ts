import { getSubscriberCount, subscribe, subscribeSchema } from '@utils/resend';
import { procedure, router } from '../trpc';
import { TRPCError } from '@trpc/server';

export const mailingListRouter = router({
  stats: procedure.query(async () => {
    const subscriberCount = await getSubscriberCount();

    return {
      subscribers: subscriberCount,
    };
  }),
  subscribe: procedure.input(subscribeSchema).mutation(async ({ input }) => {
    const { email, firstName, lastName } = input;
    try {
      const res = await subscribe({
        email,
        firstName,
        lastName,
      });
      return res;
    } catch (e) {
      throw new TRPCError({message: 'Error subscribing', code: "BAD_REQUEST", cause: (e as Error).message || undefined});
    }
  }),
});
