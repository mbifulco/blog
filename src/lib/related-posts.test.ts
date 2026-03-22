import { describe, expect, it } from 'vitest';

import type { BlogPost, Newsletter } from '@data/content-types';

import { findRelatedContent } from './related-posts';

const makePost = (slug: string, tags: string[]): BlogPost =>
  ({
    slug,
    source: '',
    content: '',
    frontmatter: {
      title: `Post ${slug}`,
      slug,
      date: '2025-01-01',
      tags,
      excerpt: '',
      coverImagePublicId: null,
      published: true,
      content: '',
    },
  }) as unknown as BlogPost;

const makeNewsletter = (slug: string, tags: string[]): Newsletter =>
  ({
    slug,
    source: '',
    content: '',
    frontmatter: {
      title: `Newsletter ${slug}`,
      slug,
      date: '2025-01-01',
      tags,
      excerpt: '',
      coverImagePublicId: null,
      content: '',
    },
  }) as unknown as Newsletter;

describe('findRelatedContent', () => {
  it('returns empty array when currentTags is empty', () => {
    const posts = [makePost('other', ['react'])];
    const result = findRelatedContent('current', [], posts, [], 4);
    expect(result).toEqual([]);
  });

  it('excludes the current slug', () => {
    const posts = [makePost('current', ['react']), makePost('other', ['react'])];
    const result = findRelatedContent('current', ['react'], posts, [], 4);
    expect(result.every((r) => r.slug !== 'current')).toBe(true);
  });

  it('excludes items with no shared tags', () => {
    const posts = [makePost('unrelated', ['vue'])];
    const result = findRelatedContent('current', ['react'], posts, [], 4);
    expect(result).toHaveLength(0);
  });

  it('ranks by shared tag count descending', () => {
    const posts = [
      makePost('one-tag', ['react']),
      makePost('two-tags', ['react', 'typescript']),
    ];
    const result = findRelatedContent('current', ['react', 'typescript'], posts, [], 4);
    expect(result[0].slug).toBe('two-tags');
    expect(result[1].slug).toBe('one-tag');
  });

  it('includes newsletters when provided', () => {
    const posts = [makePost('post-a', ['react'])];
    const newsletters = [makeNewsletter('nl-a', ['react'])];
    const result = findRelatedContent('current', ['react'], posts, newsletters, 4);
    expect(result).toHaveLength(2);
    expect(result.some((r) => r.type === 'newsletter')).toBe(true);
  });

  it('respects the limit', () => {
    const posts = [
      makePost('a', ['react']),
      makePost('b', ['react']),
      makePost('c', ['react']),
    ];
    const result = findRelatedContent('current', ['react'], posts, [], 2);
    expect(result).toHaveLength(2);
  });
});
