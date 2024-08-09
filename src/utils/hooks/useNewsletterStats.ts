import { trpc } from '@utils/trpc';

const useNewsletterStats = () => {
  const subscriberCountQuery = trpc.mailingList.stats.useQuery(undefined, {
    staleTime: Infinity, // just get it once
  });

  const { data: subscriberCount } = subscriberCountQuery;

  return {
    subscriberCount: subscriberCount?.subscribers,
  };
};

export default useNewsletterStats;
