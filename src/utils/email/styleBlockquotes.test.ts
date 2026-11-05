import React from 'react';
import { render } from '@react-email/render';
import { describe, expect, it } from 'vitest';

import { styleBlockquotes } from './styleBlockquotes';
import { NewsletterEmail } from './templates/NewsletterEmail';

const renderNewsletter = async (content: string) =>
  styleBlockquotes(
    await render(
      React.createElement(NewsletterEmail, {
        title: 'Title',
        excerpt: 'Excerpt',
        content,
      })
    )
  );

const firstBlockquote = (html: string) => {
  const match = html.match(/<blockquote[\s\S]*?<\/blockquote>/);
  if (!match) throw new Error('No blockquote in rendered email');
  return match[0];
};

describe('styleBlockquotes', () => {
  it('wraps a single-paragraph quote in pink quote marks with blue text', async () => {
    const quote = firstBlockquote(
      await renderNewsletter(
        'Before.\n\n> Ship it before it is ready.\n\nAfter.'
      )
    );

    expect(quote).toContain('color:#2340b0');
    expect(quote).toMatch(
      /<span style="color:#c21469">&ldquo;<\/span>Ship it before it is ready\.<span style="color:#c21469">&rdquo;<\/span><\/p>/
    );
  });

  it('drops the default gray background and left border', async () => {
    const quote = firstBlockquote(await renderNewsletter('> Quoted.'));

    expect(quote).not.toContain('#f9f9f9');
    expect(quote).not.toContain('solid #ccc');
  });

  it('opens on the first paragraph and closes on the last', async () => {
    const quote = firstBlockquote(
      await renderNewsletter('> First.\n>\n> Second.')
    );

    expect(quote.match(/&ldquo;/g)).toHaveLength(1);
    expect(quote.match(/&rdquo;/g)).toHaveLength(1);
    expect(quote.indexOf('&ldquo;')).toBeLessThan(quote.indexOf('First.'));
    expect(quote.indexOf('&rdquo;')).toBeGreaterThan(quote.indexOf('Second.'));
  });

  it('leaves paragraphs outside blockquotes alone', async () => {
    const html = await renderNewsletter('Plain paragraph.\n\n> Quoted.');
    const plain = html.match(/<p[^>]*>Plain paragraph\.<\/p>/)?.[0];

    expect(plain).toContain('color:#222');
    expect(plain).not.toContain('&ldquo;');
  });
});
