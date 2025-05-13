import type { NextApiRequest, NextApiResponse } from 'next';
import { searchContent } from '@lib/embeddings';
import type { ContentTypes } from '@data/content-types';
import { rateLimit } from '@lib/rate-limit';

type SearchResponse = {
  results: Array<{
    title: string;
    slug: string;
    type: typeof ContentTypes[keyof typeof ContentTypes];
    score: number;
    excerpt: string;
  }>;
  error?: string;
  remaining?: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResponse>
) {
  console.log('Search API called with query:', req.query);

  // Only allow GET requests
  if (req.method !== 'GET') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ results: [], error: 'Method not allowed' });
  }

  // Get IP address from request
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  if (!ip || typeof ip !== 'string') {
    console.log('Could not determine client IP');
    return res.status(400).json({
      results: [],
      error: 'Could not determine client IP'
    });
  }

  // Apply rate limiting
  const { success, remaining } = rateLimit(ip);
  if (!success) {
    console.log('Rate limit exceeded for IP:', ip);
    return res.status(429).json({
      results: [],
      error: 'Too many requests',
      remaining: 0
    });
  }

  const { q: query, type, limit, minScore } = req.query;

  if (!query || typeof query !== 'string') {
    console.log('Missing or invalid query parameter');
    return res.status(400).json({
      results: [],
      error: 'Query parameter "q" is required'
    });
  }

  try {
    console.log('Calling searchContent with:', { query, type, limit, minScore });
    const results = await searchContent(query, {
      type: type as typeof ContentTypes[keyof typeof ContentTypes],
      limit: limit ? parseInt(limit as string, 10) : undefined,
      minScore: minScore ? parseFloat(minScore as string) : undefined,
    });
    console.log('Search returned results:', results.length);

    return res.status(200).json({ results, remaining });
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({
      results: [],
      error: 'An error occurred while searching'
    });
  }
}
