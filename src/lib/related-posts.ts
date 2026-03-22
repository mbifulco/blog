import { getAllPosts } from './blog';
import { getAllNewsletters } from './newsletters';

import { findRelatedContent, type RelatedContent } from './related-posts-core';
export type { RelatedContent };
export { findRelatedContent };

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

  return findRelatedContent(currentSlug, currentTags, posts, newsletters, limit);
}
