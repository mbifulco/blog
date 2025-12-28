import type { BlogPost, Newsletter, Article } from '@data/content-types';

import { getPostBySlug } from './blog';
import { getNewsletterBySlug } from './newsletters';
import { getExternalReferenceBySlug } from './external-references';
import { getContentForTag } from './tags';

export type TopicDefinition = {
  slug: string;
  name: string;
  description: string;
  tags: string[];
  icon?: string;
};

export type Topic = TopicDefinition & {
  posts: BlogPost[];
  newsletters: Newsletter[];
  articles: Article[];
  totalCount: number;
};

/**
 * Topic cluster definitions
 * Each topic aggregates content from multiple related tags
 */
export const TOPIC_DEFINITIONS: TopicDefinition[] = [
  {
    slug: 'react-development',
    name: 'React & JavaScript Development',
    description:
      'Tutorials, best practices, and insights on React, Next.js, TypeScript, and modern JavaScript development. From component patterns to performance optimization.',
    tags: ['react', 'javascript', 'nextjs', 'typescript'],
    icon: '⚛️',
  },
  {
    slug: 'startup-building',
    name: 'Startup Building & Entrepreneurship',
    description:
      'Lessons learned from founding startups, going through Y Combinator, and building products. Practical advice for founders and aspiring entrepreneurs.',
    tags: ['startup', 'founder', 'product'],
    icon: '🚀',
  },
  {
    slug: 'design-ux',
    name: 'Design & User Experience',
    description:
      'Thoughts on design systems, user experience, and creating products people love. Bridging the gap between design and development.',
    tags: ['design', 'ux'],
    icon: '🎨',
  },
  {
    slug: 'developer-productivity',
    name: 'Developer Tools & Productivity',
    description:
      'Tools, workflows, and techniques to work more effectively as a developer. From CLI tools to productivity systems.',
    tags: ['dev', 'tools', 'productivity'],
    icon: '🛠️',
  },
];

/**
 * Get all topic definitions
 */
export const getAllTopics = (): TopicDefinition[] => {
  return TOPIC_DEFINITIONS;
};

/**
 * Get a topic definition by slug
 */
export const getTopicBySlug = (slug: string): TopicDefinition | undefined => {
  return TOPIC_DEFINITIONS.find((topic) => topic.slug === slug);
};

/**
 * Get all content for a topic by aggregating content from its associated tags
 * Deduplicates content that appears in multiple tags
 */
export const getTopicContent = async (slug: string): Promise<Topic | null> => {
  const topicDef = getTopicBySlug(slug);

  if (!topicDef) {
    return null;
  }

  // Collect unique slugs for each content type across all tags
  const postSlugs = new Set<string>();
  const newsletterSlugs = new Set<string>();
  const articleSlugs = new Set<string>();

  for (const tag of topicDef.tags) {
    const content = await getContentForTag(tag);
    content.post.forEach((slug) => postSlugs.add(slug));
    content.newsletter.forEach((slug) => newsletterSlugs.add(slug));
    content.article.forEach((slug) => articleSlugs.add(slug));
  }

  // Fetch all the content
  const [posts, newsletters, articles] = await Promise.all([
    Promise.all(Array.from(postSlugs).map((slug) => getPostBySlug(slug))),
    Promise.all(
      Array.from(newsletterSlugs).map((slug) => getNewsletterBySlug(slug))
    ),
    Promise.all(
      Array.from(articleSlugs).map((slug) => getExternalReferenceBySlug(slug))
    ),
  ]);

  // Sort by date (newest first)
  const sortedPosts = posts.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );

  const sortedNewsletters = newsletters.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );

  const sortedArticles = articles.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );

  return {
    ...topicDef,
    posts: sortedPosts,
    newsletters: sortedNewsletters,
    articles: sortedArticles,
    totalCount:
      sortedPosts.length + sortedNewsletters.length + sortedArticles.length,
  };
};

/**
 * Get all topics with their content counts (for index page)
 */
export const getAllTopicsWithCounts = async (): Promise<
  (TopicDefinition & { totalCount: number })[]
> => {
  const topicsWithCounts = await Promise.all(
    TOPIC_DEFINITIONS.map(async (topicDef) => {
      const postSlugs = new Set<string>();
      const newsletterSlugs = new Set<string>();
      const articleSlugs = new Set<string>();

      for (const tag of topicDef.tags) {
        const content = await getContentForTag(tag);
        content.post.forEach((slug) => postSlugs.add(slug));
        content.newsletter.forEach((slug) => newsletterSlugs.add(slug));
        content.article.forEach((slug) => articleSlugs.add(slug));
      }

      return {
        ...topicDef,
        totalCount: postSlugs.size + newsletterSlugs.size + articleSlugs.size,
      };
    })
  );

  return topicsWithCounts;
};
