import { getSubscriberCount } from '@utils/resend';
import { procedure, router } from '../trpc';

export const mailingListRouter = router({
  stats: procedure.query(async () => {
    const subscriberCount = await getSubscriberCount();

    return {
      subscribers: subscriberCount,
    };
  }),
});
