import type { BlogPost, Newsletter } from '@data/content-types';

export type RelatedPostsManifest = {
  generatedAt: string;
  relatedContent: Record<string, RelatedContent[]>;
};

export type RelatedContent = {
  type: 'post' | 'newsletter';
  slug: string;
  title: string;
  excerpt: string;
  date: string | number | Date;
  tags: string[];
  sharedTagCount: number;
  coverImagePublicId: string | null;
};

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

  const currentTagsSet = new Set(currentTags.map((t) => t.toLowerCase()));

  const scoredPosts: RelatedContent[] = allPosts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => {
      const postTags = post.frontmatter.tags || [];
      const sharedTagCount = postTags.filter((tag) =>
        currentTagsSet.has(tag.toLowerCase())
      ).length;

      return {
        type: 'post' as const,
        slug: post.slug,
        title: post.frontmatter.title,
        excerpt: post.frontmatter.excerpt || '',
        date: post.frontmatter.date,
        tags: postTags,
        sharedTagCount,
        coverImagePublicId: post.frontmatter.coverImagePublicId ?? null,
      };
    })
    .filter((item) => item.sharedTagCount > 0);

  const scoredNewsletters: RelatedContent[] = allNewsletters
    .filter((newsletter) => newsletter.slug !== currentSlug)
    .map((newsletter) => {
      const newsletterTags = newsletter.frontmatter.tags || [];
      const sharedTagCount = newsletterTags.filter((tag) =>
        currentTagsSet.has(tag.toLowerCase())
      ).length;

      return {
        type: 'newsletter' as const,
        slug: newsletter.slug,
        title: newsletter.frontmatter.title,
        excerpt: newsletter.frontmatter.excerpt || '',
        date: newsletter.frontmatter.date,
        tags: newsletterTags,
        sharedTagCount,
        coverImagePublicId: newsletter.frontmatter.coverImagePublicId ?? null,
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
