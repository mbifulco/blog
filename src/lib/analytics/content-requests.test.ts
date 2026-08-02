import { describe, expect, it } from 'vitest';

import {
  classifyContentRequest,
  TRACKED_CONTENT_MATCHERS,
} from './content-requests';

describe('classifyContentRequest', () => {
  it('identifies a post markdown twin', () => {
    expect(classifyContentRequest('/posts/all-about-ch.md')).toEqual({
      format: 'markdown',
      contentType: 'posts',
      slug: 'all-about-ch',
      path: '/posts/all-about-ch.md',
    });
  });

  it('identifies a newsletter markdown twin', () => {
    expect(
      classifyContentRequest('/newsletter/you-are-not-your-user.md')
    ).toEqual({
      format: 'markdown',
      contentType: 'newsletter',
      slug: 'you-are-not-your-user',
      path: '/newsletter/you-are-not-your-user.md',
    });
  });

  it('identifies the llms.txt files', () => {
    expect(classifyContentRequest('/llms.txt')?.format).toBe('llms-index');
    expect(classifyContentRequest('/llms-full.txt')?.format).toBe('llms-full');
  });

  it('ignores the html pages the twins mirror', () => {
    expect(classifyContentRequest('/posts/all-about-ch')).toBeNull();
    expect(classifyContentRequest('/newsletter')).toBeNull();
    expect(classifyContentRequest('/')).toBeNull();
  });

  it('ignores .md paths under section names that have no twins', () => {
    expect(classifyContentRequest('/about/something.md')).toBeNull();
    expect(classifyContentRequest('/podcast/episode.md')).toBeNull();
  });

  it('ignores nested and malformed markdown paths', () => {
    expect(classifyContentRequest('/posts/nested/slug.md')).toBeNull();
    expect(classifyContentRequest('/posts/.md')).toBeNull();
    expect(classifyContentRequest('/posts/slug.mdx')).toBeNull();
  });

  it('lists a matcher for every path it recognises', () => {
    // The proxy only sees paths its matcher admits, so the two lists drifting
    // apart means silently uncounted requests.
    expect([...TRACKED_CONTENT_MATCHERS]).toEqual([
      '/posts/:slug.md',
      '/newsletter/:slug.md',
      '/llms.txt',
      '/llms-full.txt',
    ]);
  });
});
