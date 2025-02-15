import type { NextRequest } from 'next/server';
import { appRouter } from '@server/routers/_app';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

export default async function handler(req: NextRequest) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    router: appRouter,
    req,
    createContext: () => ({}),
  });
}

// We're using the edge-runtime
// NOTE: if you don't want to use the edge runtime, the adapter above will need to be removed
// see https://trpc.io/docs/client/nextjs/setup#3-create-a-trpc-router for the alternate implementation
export const config = {
  runtime: 'edge',
};
