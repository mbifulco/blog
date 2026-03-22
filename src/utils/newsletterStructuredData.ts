import config, { BASE_SITE_URL } from '@/config';
import type { StructuredDataWithType } from './generateStructuredData';

export const tinyImprovementsBlogStructuredData: StructuredDataWithType = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: config.newsletter.title,
  description: config.newsletter.shortDescription,
  url: `${BASE_SITE_URL}/newsletter`,
  author: {
    '@type': 'Person',
    '@id': `${BASE_SITE_URL}/#person`,
    name: config.author.name.replace(' @irreverentmike', ''),
    url: BASE_SITE_URL,
  },
  publisher: {
    '@type': 'Person',
    '@id': `${BASE_SITE_URL}/#person`,
    name: config.author.name.replace(' @irreverentmike', ''),
    url: BASE_SITE_URL,
  },
  inLanguage: 'en-US',
  blogPost: [], // This will be populated dynamically
};

