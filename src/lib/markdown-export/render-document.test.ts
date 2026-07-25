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

  it('emits the tldr as a callout directly under the title', async () => {
    const result = await renderMarkdownDocument(
      doc({ tldr: 'Use `text-wrap: pretty` to avoid orphans.' }),
      options
    );

    expect(result).toContain(
      '> **TL;DR:** Use `text-wrap: pretty` to avoid orphans.'
    );
    expect(result.indexOf('TL;DR')).toBeLessThan(
      result.indexOf('Body text goes here.')
    );
    expect(result.indexOf('# All about ch')).toBeLessThan(
      result.indexOf('TL;DR')
    );
  });

  it('omits the tldr callout when there is no tldr', async () => {
    const result = await renderMarkdownDocument(doc(), options);

    expect(result).not.toContain('TL;DR');
  });

  it('lists related reading as links', async () => {
    const result = await renderMarkdownDocument(doc(), {
      ...options,
      relatedLinks: [
        { title: 'A related post', url: 'https://mikebifulco.com/posts/a' },
        { title: 'A newsletter', url: 'https://mikebifulco.com/newsletter/b' },
      ],
    });

    expect(result).toContain('## More from mikebifulco.com');
    expect(result).toContain(
      '- [A related post](https://mikebifulco.com/posts/a)'
    );
    expect(result).toContain(
      '- [A newsletter](https://mikebifulco.com/newsletter/b)'
    );
  });

  it('omits the related section when there is nothing to link', async () => {
    const result = await renderMarkdownDocument(doc(), {
      ...options,
      relatedLinks: [],
    });

    expect(result).not.toContain('## More from mikebifulco.com');
  });

  it('lists the series entries when the document is part of a series', async () => {
    const result = await renderMarkdownDocument(doc(), {
      ...options,
      series: {
        name: 'JavaScript Tips',
        url: 'https://mikebifulco.com/series/javascript-tips',
        entries: [
          { title: 'Part one', url: 'https://mikebifulco.com/posts/one' },
        ],
      },
    });

    expect(result).toContain('## Part of the JavaScript Tips series');
    expect(result).toContain('- [Part one](https://mikebifulco.com/posts/one)');
    expect(result).toContain(
      'Full series: https://mikebifulco.com/series/javascript-tips'
    );
  });

  it('omits the series section when the document is standalone', async () => {
    const result = await renderMarkdownDocument(doc(), options);

    expect(result).not.toContain('series');
  });

  it('closes with an attribution line naming the canonical url', async () => {
    const result = await renderMarkdownDocument(doc(), options);

    expect(
      result
        .trimEnd()
        .endsWith(
          'Written by Mike Bifulco. Originally published at https://mikebifulco.com/posts/all-about-ch'
        )
    ).toBe(true);
  });

  it('orders sections body, series, related, attribution', async () => {
    const result = await renderMarkdownDocument(doc(), {
      ...options,
      relatedLinks: [{ title: 'R', url: 'https://mikebifulco.com/posts/r' }],
      series: {
        name: 'S',
        url: 'https://mikebifulco.com/series/s',
        entries: [{ title: 'E', url: 'https://mikebifulco.com/posts/e' }],
      },
    });

    expect(result.indexOf('Body text goes here.')).toBeLessThan(
      result.indexOf('## Part of the S series')
    );
    expect(result.indexOf('## Part of the S series')).toBeLessThan(
      result.indexOf('## More from mikebifulco.com')
    );
    expect(result.indexOf('## More from mikebifulco.com')).toBeLessThan(
      result.indexOf('Written by Mike Bifulco')
    );
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
