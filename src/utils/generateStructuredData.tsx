import type {
  BlogPosting,
  CreativeWorkSeries,
  Person,
  Thing,
  VideoObject,
  WithContext,
} from 'schema-dts';

import type { BlogPost, Newsletter } from '@data/content-types';
import type { Series } from '@lib/series';
import config, { BASE_SITE_URL } from '@/config';

const AUTHOR_DATA: Person = {
  '@type': 'Person',
  name: config.author.name.replace(' @irreverentmike', ''),
  brand: [config.newsletter.title.replace('💌 ', ''), config.employer.name],
  email: config.author.email,
  gender: 'male',
  jobTitle: config.employer.role,
  url: BASE_SITE_URL,
  sameAs: [
    `https://twitter.com/${config.social.twitter}`,
    `https://github.com/${config.social.github}`,
    'https://bsky.com/profile/mikebifulco.com',
    'https://threads.net/@irreverentmike',
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

  const postStructuredData: WithContext<BlogPosting> | undefined = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.frontmatter.title,
    description: post.frontmatter.excerpt,
    datePublished: new Date(post.frontmatter.date).toISOString(),
    author: AUTHOR_DATA,
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
