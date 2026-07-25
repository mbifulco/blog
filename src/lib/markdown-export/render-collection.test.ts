import type { MarkdownDocument } from '@data/content-types';
import { describe, expect, it } from 'vitest';

import { renderCollectionEntry } from './render-collection';

const doc = (overrides: Partial<MarkdownDocument['frontmatter']> = {}) =>
  ({
    slug: 'all-about-ch',
    content: '## A section\n\nBody text goes here.\n',
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

describe('renderCollectionEntry', () => {
  it('introduces the document with an h3 title', async () => {
    const result = await renderCollectionEntry(doc(), options);

    expect(result.startsWith('### All about ch')).toBe(true);
  });

  it('never emits an h1 or h2, so the file keeps one heading hierarchy', async () => {
    const result = await renderCollectionEntry(doc(), options);

    expect(result).not.toMatch(/^# /m);
    expect(result).not.toMatch(/^## /m);
  });

  it('shifts body headings below the entry heading', async () => {
    const result = await renderCollectionEntry(doc(), options);

    expect(result).toContain('#### A section');
  });

  it('pushes a body that opens at h1 below the entry heading too', async () => {
    const document = {
      ...doc(),
      content: '# A top level heading\n\n## Under it\n',
    } as MarkdownDocument;

    const result = await renderCollectionEntry(document, options);

    // Several posts open at h1; those must not read as new entries.
    expect(result).toContain('#### A top level heading');
    expect(result).toContain('##### Under it');
    expect(result.match(/^### /gm)).toHaveLength(1);
  });

  it('emits metadata as a plain line rather than yaml frontmatter', async () => {
    const result = await renderCollectionEntry(doc(), options);

    // `---` fences would be indistinguishable from entry separators.
    expect(result).not.toMatch(/^---$/m);
    expect(result).toContain(
      'Source: https://mikebifulco.com/posts/all-about-ch'
    );
    expect(result).toContain('Published: 2019-05-17');
    expect(result).toContain('Tags: design, css');
  });

  it('includes the updated date when present', async () => {
    const result = await renderCollectionEntry(
      doc({ updated: 'Mon, 01 Jul 2024 00:00:00 GMT' }),
      options
    );

    expect(result).toContain('Updated: 2024-07-01');
  });

  it('includes the tldr when present', async () => {
    const result = await renderCollectionEntry(
      doc({ tldr: 'Use the ch unit.' }),
      options
    );

    expect(result).toContain('> **TL;DR:** Use the ch unit.');
  });

  it('omits related and series links, which are redundant here', async () => {
    const result = await renderCollectionEntry(doc(), options);

    expect(result).not.toContain('More from mikebifulco.com');
    expect(result).not.toContain('Written by Mike Bifulco');
  });

  it('resolves custom components like the standalone renderer', async () => {
    const document = {
      ...doc(),
      content: '<Image publicId="a/b" alt="an image" />\n',
    } as MarkdownDocument;

    const result = await renderCollectionEntry(document, options);

    expect(result).toContain('![an image](https://res.cloudinary.com/');
  });
});
