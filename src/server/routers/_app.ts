import { router } from '../trpc';
import { mailingListRouter } from './mailingList';

export const appRouter = router({
  mailingList: mailingListRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
