import type { NextApiRequest, NextApiResponse } from 'next';
import { appRouter } from '@server/routers/_app';
import { createNextApiHandler } from '@trpc/server/adapters/next';

const trpcHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  return createNextApiHandler({
    router: appRouter,
    createContext: () => ({}),
  })(req, res);
};

// Type the handler properly for Next.js API routes
const typedHandler = trpcHandler as (
  req: NextApiRequest,
  res: NextApiResponse,
) => Promise<void>;

export default typedHandler;
