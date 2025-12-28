import type { BlogPost, Newsletter } from '@data/content-types';

import { getAllPosts } from './blog';
import { getAllNewsletters } from './newsletters';

export type RelatedContent = {
  type: 'post' | 'newsletter';
  slug: string;
  title: string;
  excerpt: string;
  date: string | number | Date;
  tags: string[];
  sharedTagCount: number;
};

type GetRelatedContentOptions = {
  currentSlug: string;
  currentTags: string[];
  limit?: number;
  includeNewsletters?: boolean;
};

/**
 * Find related content based on shared tags
 * Returns posts/newsletters ranked by number of shared tags
 */
export async function getRelatedContent({
  currentSlug,
  currentTags,
  limit = 4,
  includeNewsletters = true,
}: GetRelatedContentOptions): Promise<RelatedContent[]> {
  if (!currentTags || currentTags.length === 0) {
    return [];
  }

  const posts = await getAllPosts();
  const newsletters = includeNewsletters ? await getAllNewsletters() : [];

  const currentTagsLower = currentTags.map((t) => t.toLowerCase());

  // Score and filter posts
  const scoredPosts: RelatedContent[] = posts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => {
      const postTags = post.frontmatter.tags || [];
      const postTagsLower = postTags.map((t) => t.toLowerCase());
      const sharedTagCount = currentTagsLower.filter((tag) =>
        postTagsLower.includes(tag)
      ).length;

      return {
        type: 'post' as const,
        slug: post.slug,
        title: post.frontmatter.title,
        excerpt: post.frontmatter.excerpt || '',
        date: post.frontmatter.date,
        tags: postTags,
        sharedTagCount,
      };
    })
    .filter((item) => item.sharedTagCount > 0);

  // Score and filter newsletters
  const scoredNewsletters: RelatedContent[] = newsletters
    .filter((newsletter) => newsletter.slug !== currentSlug)
    .map((newsletter) => {
      const newsletterTags = newsletter.frontmatter.tags || [];
      const newsletterTagsLower = newsletterTags.map((t) => t.toLowerCase());
      const sharedTagCount = currentTagsLower.filter((tag) =>
        newsletterTagsLower.includes(tag)
      ).length;

      return {
        type: 'newsletter' as const,
        slug: newsletter.slug,
        title: newsletter.frontmatter.title,
        excerpt: newsletter.frontmatter.excerpt || '',
        date: newsletter.frontmatter.date,
        tags: newsletterTags,
        sharedTagCount,
      };
    })
    .filter((item) => item.sharedTagCount > 0);

  // Combine, sort by shared tag count (then by date), and limit
  const allRelated = [...scoredPosts, ...scoredNewsletters]
    .sort((a, b) => {
      // First sort by shared tag count (descending)
      if (b.sharedTagCount !== a.sharedTagCount) {
        return b.sharedTagCount - a.sharedTagCount;
      }
      // Then by date (most recent first)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, limit);

  return allRelated;
}

/**
 * Synchronous version for use with pre-fetched content
 * Useful when you already have all posts/newsletters loaded
 */
export function findRelatedContent(
  currentSlug: string,
  currentTags: string[],
  allPosts: BlogPost[],
  allNewsletters: Newsletter[] = [],
  limit = 4
): RelatedContent[] {
  if (!currentTags || currentTags.length === 0) {
    return [];
  }

  const currentTagsLower = currentTags.map((t) => t.toLowerCase());

  const scoredPosts: RelatedContent[] = allPosts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => {
      const postTags = post.frontmatter.tags || [];
      const postTagsLower = postTags.map((t) => t.toLowerCase());
      const sharedTagCount = currentTagsLower.filter((tag) =>
        postTagsLower.includes(tag)
      ).length;

      return {
        type: 'post' as const,
        slug: post.slug,
        title: post.frontmatter.title,
        excerpt: post.frontmatter.excerpt || '',
        date: post.frontmatter.date,
        tags: postTags,
        sharedTagCount,
      };
    })
    .filter((item) => item.sharedTagCount > 0);

  const scoredNewsletters: RelatedContent[] = allNewsletters
    .filter((newsletter) => newsletter.slug !== currentSlug)
    .map((newsletter) => {
      const newsletterTags = newsletter.frontmatter.tags || [];
      const newsletterTagsLower = newsletterTags.map((t) => t.toLowerCase());
      const sharedTagCount = currentTagsLower.filter((tag) =>
        newsletterTagsLower.includes(tag)
      ).length;

      return {
        type: 'newsletter' as const,
        slug: newsletter.slug,
        title: newsletter.frontmatter.title,
        excerpt: newsletter.frontmatter.excerpt || '',
        date: newsletter.frontmatter.date,
        tags: newsletterTags,
        sharedTagCount,
      };
    })
    .filter((item) => item.sharedTagCount > 0);

  return [...scoredPosts, ...scoredNewsletters]
    .sort((a, b) => {
      if (b.sharedTagCount !== a.sharedTagCount) {
        return b.sharedTagCount - a.sharedTagCount;
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, limit);
}
