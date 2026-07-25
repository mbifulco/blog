import { describe, expect, it } from 'vitest';

import {
  canonicalUrlFor,
  isMarkdownContentType,
  markdownPathFor,
  markdownUrlFor,
} from './urls';

describe('markdown export urls', () => {
  it('builds site-relative markdown paths', () => {
    expect(markdownPathFor('posts', 'all-about-ch')).toBe(
      '/posts/all-about-ch.md'
    );
    expect(markdownPathFor('newsletter', 'x')).toBe('/newsletter/x.md');
  });

  it('builds public markdown urls', () => {
    expect(markdownUrlFor('posts', 'all-about-ch')).toBe(
      'https://mikebifulco.com/posts/all-about-ch.md'
    );
    expect(markdownUrlFor('newsletter', 'you-are-not-your-user')).toBe(
      'https://mikebifulco.com/newsletter/you-are-not-your-user.md'
    );
  });

  it('builds canonical html urls', () => {
    expect(canonicalUrlFor('posts', 'all-about-ch')).toBe(
      'https://mikebifulco.com/posts/all-about-ch'
    );
  });

  it('recognizes the supported content types', () => {
    expect(isMarkdownContentType('posts')).toBe(true);
    expect(isMarkdownContentType('newsletter')).toBe(true);
    expect(isMarkdownContentType('newsletters')).toBe(false);
    expect(isMarkdownContentType('recipes')).toBe(false);
  });
});
