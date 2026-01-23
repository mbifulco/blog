import type * as trpcNext from '@trpc/server/adapters/next';

type CreateContextOptions = {
  clientIp: string | null;
};

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export function createContextInner(opts: CreateContextOptions) {
  return {
    clientIp: opts.clientIp,
  };
}

export type Context = ReturnType<typeof createContextInner>;

/**
 * Extract client IP from request headers (Vercel provides x-forwarded-for)
 */
function getClientIp(req: trpcNext.CreateNextContextOptions['req']): string | null {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    // x-forwarded-for can contain multiple IPs, the first is the client
    return forwarded.split(',')[0]?.trim() ?? null;
  }
  if (Array.isArray(forwarded)) {
    return forwarded[0]?.split(',')[0]?.trim() ?? null;
  }
  // Fallback to socket remote address
  return req.socket?.remoteAddress ?? null;
}

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/v11/context
 */
export function createContext(
  opts: trpcNext.CreateNextContextOptions
): Context {
  const clientIp = getClientIp(opts.req);

  return createContextInner({ clientIp });
}
