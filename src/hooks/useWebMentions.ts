import { trpc } from '@utils/trpc';

export const useWebMentions = (path: string) => {
  const webmentionsQuery = trpc.webMentions.getMentionsForPath.useQuery(
    { path },
    {
      staleTime: 1000 * 60 * 60, // 1 hour
    }
  );

  return webmentionsQuery;
};
