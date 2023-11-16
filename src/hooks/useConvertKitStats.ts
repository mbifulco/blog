import useSWR from 'swr';

const useConvertKitStats = () => {
  // return stats from /api/newsletter/stats

  const fetcher = (url: string) => fetch(url).then((r) => r.json());

  type StatsResult = {
    subscriberCount?: number;
  } & Record<string, unknown>;

  const { data, error } = useSWR<StatsResult, unknown>(
    '/api/newsletter/stats',
    fetcher
  );
  return {
    stats: data ?? {},
    isLoading: !error && !data,
    isError: error,
  };
};

export default useConvertKitStats;
