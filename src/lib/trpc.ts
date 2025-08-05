import { httpBatchStreamLink, loggerLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import { createTRPCReact } from '@trpc/react-query';
import superjson from 'superjson';

import type { AppRouter } from '../server/routers/_app';

function getBaseUrl() {
  if (typeof window !== 'undefined')
    // browser should use relative path
    return '';

  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;

  if (process.env.RENDER_INTERNAL_HOSTNAME)
    // reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

// Shared links configuration
const createLinks = () => [
  loggerLink({
    enabled: (opts) =>
      process.env.NODE_ENV === 'development' ||
      (opts.direction === 'down' && opts.result instanceof Error),
  }),
  httpBatchStreamLink({
    url: `${getBaseUrl()}/api/trpc`,
    transformer: superjson,
  }),
];

// For Pages Router (legacy)
export const trpcNext = createTRPCNext<AppRouter>({
  config() {
    return {
      links: createLinks(),
    };
  },
  ssr: false,
  transformer: superjson,
});

// For App Router
export const trpcReact = createTRPCReact<AppRouter>();

// Create client for App Router
export function createTRPCClient() {
  return trpcReact.createClient({
    links: createLinks(),
  });
}
