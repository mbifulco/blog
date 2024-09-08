import { getSubscriberCount, subscribe, subscribeSchema } from '@/utils/resend';
import { procedure, router } from '../trpc';

export const mailingListRouter = router({
  stats: procedure.query(async () => {
    const subscriberCount = await getSubscriberCount();

    return {
      subscribers: subscriberCount,
    };
  }),
  subscribe: procedure.input(subscribeSchema).mutation(async ({ input }) => {
    const { email, firstName, lastName } = input;
    return await subscribe({
      email,
      firstName,
      lastName,
    });
  }),
});
