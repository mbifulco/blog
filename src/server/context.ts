import type * as trpcNext from '@trpc/server/adapters/next';

type CreateContextOptions = {
  clientIp: string | null;
  requestOrigin: string | null;
  requestHost: string | null;
};

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export function createContextInner(opts: CreateContextOptions) {
  return {
    clientIp: opts.clientIp,
    requestOrigin: opts.requestOrigin,
    requestHost: opts.requestHost,
  };
}

export type Context = ReturnType<typeof createContextInner>;

/**
 * Extract client IP from request headers (Vercel provides x-forwarded-for)
 */
function getClientIp(
  req: trpcNext.CreateNextContextOptions['req']
): string | null {
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
 * Read a single header value, normalizing the string | string[] | undefined
 * shape that Next.js request headers can take.
 */
function firstHeaderValue(value: string | string[] | undefined): string | null {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value[0] ?? null;
  return null;
}

/**
 * Determine the request's origin. Prefer the explicit `origin` header; if it's
 * absent, derive a scheme+host origin from the `referer` header. Returns null
 * if neither is usable.
 */
function getRequestOrigin(
  req: trpcNext.CreateNextContextOptions['req']
): string | null {
  const origin = firstHeaderValue(req.headers['origin']);
  if (origin) return origin;

  const referer = firstHeaderValue(req.headers['referer']);
  if (referer) {
    try {
      return new URL(referer).origin;
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Determine the request's host. Prefer `x-forwarded-host` (set by Vercel),
 * falling back to the standard `host` header.
 */
function getRequestHost(
  req: trpcNext.CreateNextContextOptions['req']
): string | null {
  return (
    firstHeaderValue(req.headers['x-forwarded-host']) ??
    firstHeaderValue(req.headers['host'])
  );
}

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/v11/context
 */
export function createContext(
  opts: trpcNext.CreateNextContextOptions
): Context {
  const clientIp = getClientIp(opts.req);
  const requestOrigin = getRequestOrigin(opts.req);
  const requestHost = getRequestHost(opts.req);

  return createContextInner({ clientIp, requestOrigin, requestHost });
}
