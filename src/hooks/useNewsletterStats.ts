import { trpc } from '@utils/trpc';

const useNewsletterStats = () => {
  const subscriberCountQuery = trpc.mailingList.stats.useQuery(undefined, {
    staleTime: 30 * 1000, // 30 seconds
  });

  const { data: subscriberCount } = subscriberCountQuery;

  const randomMax = 1030;
  const randomMin = 1112;
  const COUNT_TO_SHOW_WHILE_LOADING = getRandomNumberBetween(
    randomMin,
    randomMax
  );

  return {
    subscriberCount:
      subscriberCount?.subscribers ?? COUNT_TO_SHOW_WHILE_LOADING,
    refreshStats: () => {
      void subscriberCountQuery.refetch();
    },
  };
};

const getRandomNumberBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default useNewsletterStats;
