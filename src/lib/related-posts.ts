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

function scoreItems(
  items: (BlogPost | Newsletter)[],
  currentSlug: string,
  currentTagsSet: Set<string>,
  type: RelatedContent['type']
): RelatedContent[] {
  return items
    .filter((item) => item.slug !== currentSlug)
    .map((item) => {
      const tags = item.frontmatter.tags || [];
      const sharedTagCount = tags.filter((tag) =>
        currentTagsSet.has(tag.toLowerCase())
      ).length;

      return {
        type,
        slug: item.slug,
        title: item.frontmatter.title,
        excerpt: item.frontmatter.excerpt || '',
        date: item.frontmatter.date,
        tags,
        sharedTagCount,
        coverImagePublicId: item.frontmatter.coverImagePublicId ?? null,
      };
    })
    .filter((item) => item.sharedTagCount > 0);
}

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

  return [
    ...scoreItems(allPosts, currentSlug, currentTagsSet, 'post'),
    ...scoreItems(allNewsletters, currentSlug, currentTagsSet, 'newsletter'),
  ]
    .sort((a, b) => {
      if (b.sharedTagCount !== a.sharedTagCount) {
        return b.sharedTagCount - a.sharedTagCount;
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, limit);
}
