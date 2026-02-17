import { describe, expect, it } from 'vitest';

import type { BlogPost, Newsletter } from '@data/content-types';

import {
  buildUnifiedFeed,
  getImagePublicId,
  getItemPath,
  getTotalFeedPages,
  HOME_PAGE_LIMIT,
  PAGE_LIMIT,
} from './unified-feed';

const makePost = (overrides: Partial<BlogPost['frontmatter']> & { slug?: string } = {}) => {
  const { slug = 'test-post', ...frontmatterOverrides } = overrides;
  return {
    slug,
    source: '',
    content: '',
    frontmatter: {
      title: 'Test Post',
      date: '2025-01-15',
      slug,
      excerpt: 'A test post excerpt',
      coverImagePublicId: 'posts/test-post/cover',
      content: '',
      published: true,
      tags: ['react', 'testing'],
      ...frontmatterOverrides,
    },
  } as BlogPost;
};

const makeNewsletter = (overrides: Partial<Newsletter['frontmatter']> & { slug?: string } = {}) => {
  const { slug = 'test-newsletter', ...frontmatterOverrides } = overrides;
  return {
    slug,
    source: '',
    content: '',
    frontmatter: {
      title: 'Test Newsletter',
      date: '2025-01-10',
      slug,
      excerpt: 'A test newsletter excerpt',
      coverImagePublicId: 'newsletters/test-newsletter/cover',
      tags: ['newsletter'],
      ...frontmatterOverrides,
    },
  } as Newsletter;
};

describe('buildUnifiedFeed', () => {
  it('should return empty array when given no posts or newsletters', () => {
    const result = buildUnifiedFeed([], []);
    expect(result).toEqual([]);
  });

  it('should handle posts only', () => {
    const posts = [makePost({ slug: 'post-1', title: 'Post 1' })];
    const result = buildUnifiedFeed(posts, []);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      type: 'post',
      slug: 'post-1',
      title: 'Post 1',
    });
  });

  it('should handle newsletters only', () => {
    const newsletters = [makeNewsletter({ slug: 'nl-1', title: 'Newsletter 1' })];
    const result = buildUnifiedFeed([], newsletters);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      type: 'newsletter',
      slug: 'nl-1',
      title: 'Newsletter 1',
    });
  });

  it('should sort mixed items by date descending', () => {
    const posts = [
      makePost({ slug: 'old-post', title: 'Old Post', date: '2025-01-01' }),
      makePost({ slug: 'new-post', title: 'New Post', date: '2025-03-01' }),
    ];
    const newsletters = [
      makeNewsletter({ slug: 'mid-nl', title: 'Mid Newsletter', date: '2025-02-01' }),
    ];
    const result = buildUnifiedFeed(posts, newsletters);

    expect(result).toHaveLength(3);
    expect(result[0].slug).toBe('new-post');
    expect(result[1].slug).toBe('mid-nl');
    expect(result[2].slug).toBe('old-post');
  });

  it('should correctly map all fields for posts', () => {
    const posts = [
      makePost({
        slug: 'mapped-post',
        title: 'Mapped Post',
        excerpt: 'Post excerpt',
        date: '2025-06-15',
        tags: ['react', 'next'],
        coverImagePublicId: 'custom/image',
      }),
    ];
    const result = buildUnifiedFeed(posts, []);

    expect(result[0]).toEqual({
      type: 'post',
      slug: 'mapped-post',
      title: 'Mapped Post',
      excerpt: 'Post excerpt',
      date: '2025-06-15',
      tags: ['react', 'next'],
      coverImagePublicId: 'custom/image',
    });
  });

  it('should correctly map all fields for newsletters', () => {
    const newsletters = [
      makeNewsletter({
        slug: 'mapped-nl',
        title: 'Mapped Newsletter',
        excerpt: 'NL excerpt',
        date: '2025-06-10',
        tags: ['design'],
        coverImagePublicId: 'custom/nl-image',
      }),
    ];
    const result = buildUnifiedFeed([], newsletters);

    expect(result[0]).toEqual({
      type: 'newsletter',
      slug: 'mapped-nl',
      title: 'Mapped Newsletter',
      excerpt: 'NL excerpt',
      date: '2025-06-10',
      tags: ['design'],
      coverImagePublicId: 'custom/nl-image',
    });
  });

  it('should default missing optional fields correctly', () => {
    const posts = [
      makePost({
        slug: 'minimal-post',
        title: 'Minimal',
        excerpt: undefined as unknown as string,
        tags: undefined,
        coverImagePublicId: undefined as unknown as string,
      }),
    ];
    const result = buildUnifiedFeed(posts, []);

    expect(result[0].excerpt).toBe('');
    expect(result[0].tags).toEqual([]);
    expect(result[0].coverImagePublicId).toBeNull();
  });
});

describe('getItemPath', () => {
  it('should return /posts/{slug} for post items', () => {
    expect(
      getItemPath({ type: 'post', slug: 'my-post', title: '', excerpt: '', date: '', tags: [], coverImagePublicId: null })
    ).toBe('/posts/my-post');
  });

  it('should return /newsletter/{slug} for newsletter items', () => {
    expect(
      getItemPath({ type: 'newsletter', slug: 'my-nl', title: '', excerpt: '', date: '', tags: [], coverImagePublicId: null })
    ).toBe('/newsletter/my-nl');
  });
});

describe('getTotalFeedPages', () => {
  it('should return 1 when items fit on home page', () => {
    expect(getTotalFeedPages(0)).toBe(1);
    expect(getTotalFeedPages(5)).toBe(1);
    expect(getTotalFeedPages(HOME_PAGE_LIMIT)).toBe(1);
  });

  it('should return 2 when items spill to one extra page', () => {
    expect(getTotalFeedPages(HOME_PAGE_LIMIT + 1)).toBe(2);
    expect(getTotalFeedPages(HOME_PAGE_LIMIT + PAGE_LIMIT)).toBe(2);
  });

  it('should return 3 when items fill two extra pages', () => {
    expect(getTotalFeedPages(HOME_PAGE_LIMIT + PAGE_LIMIT + 1)).toBe(3);
  });
});

describe('getImagePublicId', () => {
  it('should return explicit coverImagePublicId when set', () => {
    expect(
      getImagePublicId({
        type: 'post',
        slug: 'test',
        title: '',
        excerpt: '',
        date: '',
        tags: [],
        coverImagePublicId: 'custom/image',
      })
    ).toBe('custom/image');
  });

  it('should return posts/{slug}/cover fallback for post items', () => {
    expect(
      getImagePublicId({
        type: 'post',
        slug: 'my-post',
        title: '',
        excerpt: '',
        date: '',
        tags: [],
        coverImagePublicId: null,
      })
    ).toBe('posts/my-post/cover');
  });

  it('should return newsletters/{slug}/cover fallback for newsletter items', () => {
    expect(
      getImagePublicId({
        type: 'newsletter',
        slug: 'my-nl',
        title: '',
        excerpt: '',
        date: '',
        tags: [],
        coverImagePublicId: null,
      })
    ).toBe('newsletters/my-nl/cover');
  });
});
