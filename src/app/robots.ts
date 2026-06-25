import type { MetadataRoute } from 'next';

import { env } from '@utils/env';
import { BASE_SITE_URL } from '@/config';

// Infrastructure paths that aren't useful to any crawler.
const infraDisallow = ['/api/', '/_next/', '/public/', '/ingest', '/ingest/*'];

// AI search / training crawlers we explicitly welcome. The site publishes an
// llms.txt index and AT Protocol records specifically to be discovered and
// cited by generative engines, so we opt in by name rather than blocking them.
const aiCrawlers = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'anthropic-ai',
  'Claude-Web',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'CCBot',
  'Applebot-Extended',
  'cohere-ai',
];

export default function robots(): MetadataRoute.Robots {
  // if this is not a production environment, disallow all requests
  if (
    env.VERCEL_ENV !== 'production' ||
    process.env.NODE_ENV !== 'production'
  ) {
    return {
      rules: [
        {
          userAgent: '*',
          disallow: '*',
        },
      ],
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        disallow: infraDisallow,
      },
      // Welcome AI crawlers explicitly so the intent is documented and robust
      // against any future wildcard changes.
      {
        userAgent: aiCrawlers,
        allow: '/',
        disallow: infraDisallow,
      },
    ],
    sitemap: `${BASE_SITE_URL}/sitemap.xml`,
  };
}
