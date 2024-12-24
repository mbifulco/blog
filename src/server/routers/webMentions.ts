import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { getSubscriberCount, subscribe, subscribeSchema } from '@utils/resend';
import getMentions from '@utils/webmentions';
import { procedure, router } from '../trpc';

export const webMentionsRouter = router({
  getMentionsForPath: procedure
    .input(
      z.object({
        path: z.string(),
      })
    )
    .query(async ({ input }) => {
      if (!input.path) {
        throw new TRPCError({
          message: 'Path is required',
          code: 'BAD_REQUEST',
        });
      }

      try {
        return getMentions(input.path);
      } catch (e) {
        throw new TRPCError({
          message: 'Error getting mentions',
          code: 'INTERNAL_SERVER_ERROR',
          cause: (e as Error).message || undefined,
        });
      }
    }),
});
