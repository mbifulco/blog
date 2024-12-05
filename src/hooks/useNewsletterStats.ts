import { trpc } from '@utils/trpc';

const useNewsletterStats = () => {
  const subscriberCountQuery = trpc.mailingList.stats.useQuery(undefined, {
    staleTime: 30 * 1000, // 30 seconds
  });

  const { data: subscriberCount } = subscriberCountQuery;

  return {
    subscriberCount: subscriberCount?.subscribers ?? 900,
    refreshStats: () => {
      void subscriberCountQuery.refetch();
    },
  };
};

export default useNewsletterStats;
