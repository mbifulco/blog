import useSWR from 'swr';

const useConvertKitStats = () => {
  // return stats from /api/newsletter/stats

  const fetcher = (url) => fetch(url).then((r) => r.json());

  const { data, error } = useSWR('/api/newsletter/stats', fetcher);
  return {
    stats: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useConvertKitStats;
