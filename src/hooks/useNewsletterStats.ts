import { trpc } from '@utils/trpc';

// Shown as "1,200+" until the live count loads, so it must stay at or below
// the real subscriber count.
const SUBSCRIBER_COUNT_FLOOR = 1200;

const useNewsletterStats = () => {
  const subscriberCountQuery = trpc.mailingList.stats.useQuery(undefined, {
    staleTime: 30 * 1000, // 30 seconds
  });

  const liveCount = subscriberCountQuery.data?.subscribers;

  return {
    subscriberCount: liveCount ?? SUBSCRIBER_COUNT_FLOOR,
    isCountLoaded: liveCount !== undefined,
    refreshStats: () => {
      void subscriberCountQuery.refetch();
    },
  };
};

export default useNewsletterStats;
