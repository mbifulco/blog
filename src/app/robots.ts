import type { MetadataRoute } from 'next';

import { BASE_SITE_URL } from '@/config';

const noIndexPaths = [
  '/ingest', // posthog's reverse proxy
  '/ingest/*', // posthog's reverse proxy
];

export default function robots(): MetadataRoute.Robots {
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
