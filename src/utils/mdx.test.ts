import { describe, expect, it } from 'vitest';

import { getHeadings } from './mdx';

describe('getHeadings', () => {
  it('collects headings with levels and slugs', () => {
    const headings = getHeadings('## The Big Idea\n\ntext\n\n### A detail');

    expect(headings).toEqual([
      { level: 2, text: 'The Big Idea', slug: 'the-big-idea' },
      { level: 3, text: 'A detail', slug: 'a-detail' },
    ]);
  });

  it('ignores headings inside code blocks', () => {
    const headings = getHeadings('## Real\n\n```md\n## Not real\n```');

    expect(headings.map((h) => h.text)).toEqual(['Real']);
  });

  it('ignores headings inside a SponsoredSection', () => {
    const source = [
      '## Before',
      '',
      '<SponsoredSection',
      '  sponsorName="Acme"',
      '  CTAtext="Go"',
      '  href="https://example.com"',
      '>',
      '',
      '### Buy Acme',
      '',
      'Ad copy.',
      '',
      '</SponsoredSection>',
      '',
      '## After',
    ].join('\n');

    expect(getHeadings(source).map((h) => h.text)).toEqual(['Before', 'After']);
  });
});
