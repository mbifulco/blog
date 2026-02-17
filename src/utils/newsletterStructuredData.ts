import type { Newsletter } from '@data/content-types';
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

export const generateNewsletterBlogPostingStructuredData = (
  newsletter: Newsletter
): StructuredDataWithType => {
  const { frontmatter } = newsletter;
  const { title, excerpt, date, slug, tags, coverImagePublicId } = frontmatter;

  const coverImageUrl = coverImagePublicId
    ? `https://res.cloudinary.com/mikebifulco-com/image/upload/${coverImagePublicId}`
    : `https://res.cloudinary.com/mikebifulco-com/image/upload/newsletters/${slug}/cover`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: excerpt,
    url: `${BASE_SITE_URL}/newsletter/${slug}`,
    datePublished: new Date(date).toISOString(),
    dateModified: new Date(date).toISOString(),
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
    image: coverImageUrl,
    keywords: tags?.join(', '),
    isPartOf: {
      '@type': 'Blog',
      name: config.newsletter.title,
      url: `${BASE_SITE_URL}/newsletter`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_SITE_URL}/newsletter/${slug}`,
    },
  };
};
