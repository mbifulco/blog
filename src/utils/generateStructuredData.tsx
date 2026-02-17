import type {
  BlogPosting,
  CollectionPage,
  CreativeWorkSeries,
  ItemList,
  Organization,
  Person,
  Thing,
  VideoObject,
  WebSite,
  WithContext,
} from 'schema-dts';

import type { BlogPost, Newsletter } from '@data/content-types';
import type { Series } from '@lib/series';
import type { Topic } from '@lib/topics';
import type { UnifiedFeedItem } from '@lib/unified-feed';
import { getItemPath } from '@lib/unified-feed';
import config, { BASE_SITE_URL } from '@/config';

const PUBLISHER_DATA: Organization = {
  '@type': 'Organization',
  name: 'mikebifulco.com',
  url: BASE_SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${BASE_SITE_URL}/favicon-32x32.png`,
  },
};

// Helper to determine if content is a Newsletter (has specific metadata pattern)
const isNewsletter = (post: BlogPost | Newsletter): post is Newsletter => {
  // Newsletters don't have the 'content' field in frontmatter that BlogPosts have
  return !('content' in post.frontmatter && post.frontmatter.content);
};

// Helper to generate the correct URL path for content
const getContentUrl = (post: BlogPost | Newsletter): string => {
  const pathPrefix = isNewsletter(post) ? 'newsletter' : 'posts';
  return `${BASE_SITE_URL}/${pathPrefix}/${post.frontmatter.slug}`;
};

// Helper to generate Cloudinary image URL
const getImageUrl = (post: BlogPost | Newsletter): string => {
  const prefix = isNewsletter(post) ? 'newsletters' : 'posts';
  const publicId =
    post.frontmatter.coverImagePublicId || `${prefix}/${post.frontmatter.slug}/cover`;
  return `https://res.cloudinary.com/mikebifulco-com/image/upload/q_auto:eco,f_auto/${publicId}`;
};

const AUTHOR_DATA: Person = {
  '@type': 'Person',
  '@id': `${BASE_SITE_URL}/#person`,
  name: config.author.name.replace(' @irreverentmike', ''),
  brand: [config.newsletter.title.replace('💌 ', ''), config.employer.name],
  email: config.author.email,
  gender: 'male',
  jobTitle: config.employer.role,
  url: BASE_SITE_URL,
  sameAs: [
    `https://twitter.com/${config.social.twitter}`,
    `https://github.com/${config.social.github}`,
    'https://bsky.app/profile/mikebifulco.com',
    'https://threads.net/@irreverentmike',
    'https://hachyderm.io/@irreverentmike',
    'https://www.linkedin.com/in/mbifulco',
    'https://youtube.com/@mikebifulco',
  ],
};

/**
 * Generate structured data for a video embedded in a post or newsletter
 *
 * @param post - The post or newsletter to generate structured data for
 * @returns The structured data for the video
 */
export const generateVideoStructuredData = (post: BlogPost | Newsletter) => {
  if (!post.frontmatter.youTubeId) {
    return undefined;
  }

  const structuredData: WithContext<VideoObject> = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: post.frontmatter.title,
    description: post.frontmatter.excerpt,
    thumbnailUrl: `https://i.ytimg.com/vi/${post.frontmatter.youTubeId}/hqdefault.jpg`,
    uploadDate: new Date(post.frontmatter.date).toISOString(),
    contentUrl: `https://www.youtube.com/watch?v=${post.frontmatter.youTubeId}`,
    embedUrl: `https://www.youtube.com/embed/${post.frontmatter.youTubeId}`,
    author: AUTHOR_DATA,
  };

  return structuredData;
};

type GeneratePostStructuredDataProps = {
  series?: Series | null;
  post: BlogPost | Newsletter;
};

export type StructuredDataWithType = WithContext<Thing> & { '@type': string };

export const generatePostStructuredData = ({
  post,
}: GeneratePostStructuredDataProps) => {
  const structuredData: StructuredDataWithType[] = [];

  const contentUrl = getContentUrl(post);
  const imageUrl = getImageUrl(post);
  const publishDate = new Date(post.frontmatter.date).toISOString();

  const postStructuredData: WithContext<BlogPosting> | undefined = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.frontmatter.title,
    description: post.frontmatter.excerpt,
    datePublished: publishDate,
    dateModified: publishDate,
    author: AUTHOR_DATA,
    publisher: PUBLISHER_DATA,
    url: contentUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': contentUrl,
    },
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
    },
    keywords: post.frontmatter.tags?.join(', '),
    isPartOf: post.frontmatter.series
      ? {
          '@type': 'CreativeWorkSeries',
          name: post.frontmatter.series,
          url: `${BASE_SITE_URL}/series/${post.frontmatter.series}`,
        }
      : undefined,
  };
  structuredData.push(postStructuredData);

  const videoStructuredData = generateVideoStructuredData(post);
  if (videoStructuredData) {
    structuredData.push(videoStructuredData);
  }

  return structuredData;
};

export const generateSeriesStructuredData = (series: Series) => {
  const structuredData: WithContext<CreativeWorkSeries> = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWorkSeries',
    name: series.name,
    url: `${BASE_SITE_URL}/series/${series.name}`,
  };

  return structuredData;
};

/**
 * Generate Organization structured data for the site
 * Should be included on all pages for consistent branding in search results
 */
export const generateOrganizationStructuredData =
  (): WithContext<Organization> => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'mikebifulco.com',
      url: BASE_SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_SITE_URL}/icons/icon-512x512.png`,
      },
      sameAs: [
        `https://twitter.com/${config.social.twitter.replace('@', '')}`,
        `https://github.com/${config.social.github}`,
        'https://bsky.app/profile/mikebifulco.com',
        'https://threads.net/@irreverentmike',
        'https://www.linkedin.com/in/mbifulco',
        'https://youtube.com/@mikebifulco',
      ],
      founder: AUTHOR_DATA,
      description: config.description,
    };
  };

/**
 * Generate WebSite structured data with search action
 * Helps search engines understand the site structure
 */
export const generateWebSiteStructuredData = (): WithContext<WebSite> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_SITE_URL}/#website`,
    name: config.title,
    alternateName: 'mikebifulco.com',
    url: BASE_SITE_URL,
    description: config.description,
    publisher: PUBLISHER_DATA,
    author: AUTHOR_DATA,
    inLanguage: 'en-US',
  };
};

/**
 * Generate both Organization and WebSite structured data
 * Convenience function for including in layouts
 */
export const generateSiteStructuredData = (): StructuredDataWithType[] => {
  return [
    generateOrganizationStructuredData() as StructuredDataWithType,
    generateWebSiteStructuredData() as StructuredDataWithType,
  ];
};

/**
 * Generate ItemList structured data for the unified content feed
 * Helps search engines understand the list of articles on home/paginated pages
 */
export const generateFeedItemListStructuredData = (
  items: UnifiedFeedItem[],
  currentPage: number
): WithContext<ItemList> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      url: `${BASE_SITE_URL}${getItemPath(item)}`,
      name: item.title,
    })),
    ...(currentPage > 1 ? { name: `Articles - Page ${currentPage}` } : {}),
  };
};

/**
 * Generate CollectionPage structured data for topic pages
 * Helps search engines understand topic cluster pages as curated collections
 */
export const generateTopicStructuredData = (
  topic: Topic
): WithContext<CollectionPage> => {
  const topicUrl = `${BASE_SITE_URL}/topics/${topic.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: topic.name,
    description: topic.description,
    url: topicUrl,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: topic.totalCount,
      itemListElement: [
        ...topic.posts.slice(0, 10).map((post, index) => ({
          '@type': 'ListItem' as const,
          position: index + 1,
          url: `${BASE_SITE_URL}/posts/${post.frontmatter.slug}`,
          name: post.frontmatter.title,
        })),
      ],
    },
    author: AUTHOR_DATA,
    publisher: PUBLISHER_DATA,
    keywords: topic.tags.join(', '),
    inLanguage: 'en-US',
  };
};
