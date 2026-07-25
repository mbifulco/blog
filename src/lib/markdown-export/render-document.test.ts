import type { MarkdownDocument } from '@data/content-types';
import { describe, expect, it } from 'vitest';

import { renderMarkdownDocument } from './render-document';

const doc = (overrides: Partial<MarkdownDocument['frontmatter']> = {}) =>
  ({
    slug: 'all-about-ch',
    content: 'Body text goes here.\n',
    tableOfContents: [],
    source: {} as MarkdownDocument['source'],
    frontmatter: {
      type: 'post',
      slug: 'all-about-ch',
      title: 'All about ch',
      date: 'Fri, 17 May 2019 00:00:00 GMT',
      excerpt: 'An article about CSS.',
      tags: ['design', 'css'],
      published: true,
      ...overrides,
    },
  }) as unknown as MarkdownDocument;

const options = {
  canonicalUrl: 'https://mikebifulco.com/posts/all-about-ch',
};

describe('renderMarkdownDocument', () => {
  it('opens with a yaml frontmatter block', async () => {
    const result = await renderMarkdownDocument(doc(), options);

    expect(result.startsWith('---\n')).toBe(true);
    expect(result).toContain("title: 'All about ch'");
  });

  it('normalizes the date to an ISO calendar date', async () => {
    const result = await renderMarkdownDocument(doc(), options);

    expect(result).toContain('date: 2019-05-17');
  });

  it('includes the canonical url', async () => {
    const result = await renderMarkdownDocument(doc(), options);

    expect(result).toContain(
      'canonical: https://mikebifulco.com/posts/all-about-ch'
    );
  });

  it('includes tags as a yaml flow sequence', async () => {
    const result = await renderMarkdownDocument(doc(), options);

    expect(result).toContain('tags: [design, css]');
  });

  it('omits optional fields that are absent', async () => {
    const result = await renderMarkdownDocument(
      doc({ excerpt: undefined, tags: undefined }),
      options
    );

    expect(result).not.toContain('excerpt:');
    expect(result).not.toContain('tags:');
  });

  it('includes updated when present', async () => {
    const result = await renderMarkdownDocument(
      doc({ updated: 'Mon, 01 Jul 2024 00:00:00 GMT' }),
      options
    );

    expect(result).toContain('updated: 2024-07-01');
  });

  it('omits internal frontmatter fields', async () => {
    const result = await renderMarkdownDocument(doc(), options);

    expect(result).not.toContain('published:');
    expect(result).not.toContain('type:');
    expect(result).not.toContain('slug:');
  });

  it('emits an h1 with the title before the body', async () => {
    const result = await renderMarkdownDocument(doc(), options);

    expect(result).toContain('# All about ch');
    expect(result.indexOf('# All about ch')).toBeLessThan(
      result.indexOf('Body text goes here.')
    );
  });

  it('escapes single quotes in the title', async () => {
    const result = await renderMarkdownDocument(
      doc({ title: "Mike's post" }),
      options
    );

    expect(result).toContain("title: 'Mike''s post'");
  });

  it('transforms the body through the mdx pipeline', async () => {
    const document = {
      ...doc(),
      content: '<Image publicId="a/b" alt="an image" />\n',
    } as MarkdownDocument;

    const result = await renderMarkdownDocument(document, options);

    expect(result).toContain('![an image](https://res.cloudinary.com/');
  });
});
