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

/** Page 1 shows 11 items in a tiered layout (1 featured + 4 medium + 6 compact) */
export const HOME_PAGE_LIMIT = 11;

/** Subsequent pages show 12 items in a uniform 3-column grid (4 full rows) */
export const PAGE_LIMIT = 12;

/** Calculate total pages accounting for asymmetric page sizes */
export const getTotalFeedPages = (totalItems: number): number => {
  if (totalItems <= HOME_PAGE_LIMIT) return 1;
  return 1 + Math.ceil((totalItems - HOME_PAGE_LIMIT) / PAGE_LIMIT);
};

export const getPaginatedUnifiedFeed = (
  posts: BlogPost[],
  newsletters: Newsletter[],
  options: PaginationOptions = {}
): PaginatedResult<UnifiedFeedItem> => {
  const allItems = buildUnifiedFeed(posts, newsletters);
  return paginate(allItems, options);
};
