// NOTE TO FUTURE SELF: there are handy /* */ comments
// around the async / await stuff for when we need to add it back in

/* eslint-disable @typescript-eslint/no-unused-vars */
import type * as trpcNext from '@trpc/server/adapters/next';

type CreateContextOptions = {
  // session: Session | null
};

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export /* async */ function createContextInner(_opts: CreateContextOptions) {
  return {};
}

// export type Context = Awaited<ReturnType<typeof createContextInner>>;
export type Context = ReturnType<typeof createContextInner>;

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/v11/context
 */
export /* async */ function createContext(
  opts: trpcNext.CreateNextContextOptions
): /* Promise<Context> */ Context {
  // for API-response caching see https://trpc.io/docs/v11/caching

  return /* await */ createContextInner({});
}
