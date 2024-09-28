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

// Use the edgeruntime
export const config = {
  runtime: 'edge',
};
