import { router } from '../trpc';
import { mailingListRouter } from './mailingList';
import { webMentionsRouter } from './webMentions';

export const appRouter = router({
  mailingList: mailingListRouter,
  webMentions: webMentionsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
