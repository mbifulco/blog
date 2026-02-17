import type { BlogPost, Newsletter } from '@data/content-types';
import type { PaginatedResult, PaginationOptions } from '@utils/pagination';
import { paginate } from '@utils/pagination';

export type UnifiedFeedItem = {
  type: 'post' | 'newsletter';
  slug: string;
  title: string;
  excerpt: string;
  date: string | number | Date;
  tags: string[];
  coverImagePublicId: string | null;
};

export const buildUnifiedFeed = (
  posts: BlogPost[],
  newsletters: Newsletter[]
): UnifiedFeedItem[] => {
  const postItems: UnifiedFeedItem[] = posts.map((post) => ({
    type: 'post',
    slug: post.slug,
    title: post.frontmatter.title,
    excerpt: post.frontmatter.excerpt || '',
    date: post.frontmatter.date,
    tags: post.frontmatter.tags || [],
    coverImagePublicId: post.frontmatter.coverImagePublicId ?? null,
  }));

  const newsletterItems: UnifiedFeedItem[] = newsletters.map((nl) => ({
    type: 'newsletter',
    slug: nl.slug,
    title: nl.frontmatter.title,
    excerpt: nl.frontmatter.excerpt || '',
    date: nl.frontmatter.date,
    tags: nl.frontmatter.tags || [],
    coverImagePublicId: nl.frontmatter.coverImagePublicId ?? null,
  }));

  return [...postItems, ...newsletterItems].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

export const getItemPath = (item: UnifiedFeedItem) =>
  item.type === 'newsletter'
    ? `/newsletter/${item.slug}`
    : `/posts/${item.slug}`;

export const getImagePublicId = (item: UnifiedFeedItem) =>
  item.coverImagePublicId ||
  (item.type === 'newsletter'
    ? `newsletters/${item.slug}/cover`
    : `posts/${item.slug}/cover`);

export const getPaginatedUnifiedFeed = (
  posts: BlogPost[],
  newsletters: Newsletter[],
  options: PaginationOptions = {}
): PaginatedResult<UnifiedFeedItem> => {
  const allItems = buildUnifiedFeed(posts, newsletters);
  return paginate(allItems, options);
};
