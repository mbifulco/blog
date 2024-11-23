import type { MetadataRoute } from 'next';

import { env } from '@utils/env';
import { BASE_SITE_URL } from '@/config';

const noIndexPaths = [
  '/ingest', // posthog's reverse proxy
  '/ingest/*', // posthog's reverse proxy
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
        disallow: '/api/',
      },
      {
        userAgent: '*',
        disallow: '/_next/',
      },
      {
        userAgent: '*',
        disallow: '/public/',
      },
      ...noIndexPaths.map((path) => ({
        userAgent: '*',
        disallow: path,
      })),
    ],
    sitemap: `${BASE_SITE_URL}/sitemap.xml`,
  };
}
