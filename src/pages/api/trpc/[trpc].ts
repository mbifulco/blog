import type { NextApiRequest, NextApiResponse } from 'next';
import { createContext } from '@server/context';
import { flushLogs } from '@server/logging/otel-logs';
import { appRouter } from '@server/routers/_app';
import { createNextApiHandler } from '@trpc/server/adapters/next';

const trpcHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await createNextApiHandler({
      router: appRouter,
      createContext,
    })(req, res);
  } finally {
    await flushLogs();
  }
};

// Type the handler properly for Next.js API routes
const typedHandler = trpcHandler as (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void>;

export default typedHandler;
