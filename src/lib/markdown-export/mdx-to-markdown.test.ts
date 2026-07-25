import { describe, expect, it } from 'vitest';

import { mdxToMarkdown } from './mdx-to-markdown';

describe('mdxToMarkdown', () => {
  it('passes plain markdown through', async () => {
    const result = await mdxToMarkdown('## Hello\n\nSome *words* here.\n');

    expect(result).toContain('## Hello');
    expect(result).toContain('Some *words* here.');
  });

  it('converts an Image element to a markdown image with caption', async () => {
    const result = await mdxToMarkdown(
      [
        '<Image',
        '  publicId="posts/all-about-ch/wikipedia-4k"',
        '  alt="A screenshot"',
        '  caption="A fullscreen desktop view."',
        '/>',
      ].join('\n')
    );

    expect(result).toContain('![A screenshot](https://res.cloudinary.com/');
    expect(result).toContain('*A fullscreen desktop view.*');
    expect(result).not.toContain('<Image');
  });

  it('converts an Aside to a blockquote', async () => {
    const result = await mdxToMarkdown('<Aside>Watch out for this.</Aside>');

    expect(result).toContain('> Watch out for this.');
    expect(result).not.toContain('<Aside');
  });

  it('converts FAQ and FAQItem into headings', async () => {
    const result = await mdxToMarkdown(
      [
        '<FAQ>',
        '  <FAQItem question="What is a ch?">',
        '    The width of a character.',
        '  </FAQItem>',
        '</FAQ>',
      ].join('\n')
    );

    expect(result).toContain('## FAQ');
    expect(result).toContain('### What is a ch?');
    expect(result).toContain('The width of a character.');
  });

  it('drops SponsoredSection and everything inside it', async () => {
    const result = await mdxToMarkdown(
      [
        'Before the sponsor.',
        '',
        '<SponsoredSection',
        '  sponsorName="Tripo AI"',
        '  href="https://www.tripo3d.ai/"',
        '  CTAtext="Start Creating"',
        '>',
        '  Secret sponsor copy.',
        '</SponsoredSection>',
        '',
        'After the sponsor.',
      ].join('\n')
    );

    expect(result).toContain('Before the sponsor.');
    expect(result).toContain('After the sponsor.');
    expect(result).not.toContain('Tripo');
    expect(result).not.toContain('Secret sponsor copy');
    expect(result).not.toContain('tripo3d');
  });

  it('keeps the children of an unrecognized component', async () => {
    const result = await mdxToMarkdown(
      '<SomeBrandNewThing>Important words.</SomeBrandNewThing>'
    );

    expect(result).toContain('Important words.');
    expect(result).not.toContain('SomeBrandNewThing');
  });

  it('leaves JSX inside fenced code blocks untouched', async () => {
    const source = [
      'Here is how you use it:',
      '',
      '```jsx',
      '<Image publicId="demo/thing" alt="demo" />',
      '```',
    ].join('\n');

    const result = await mdxToMarkdown(source);

    expect(result).toContain('<Image publicId="demo/thing" alt="demo" />');
    expect(result).toContain('```jsx');
  });

  it('strips import and export statements', async () => {
    const result = await mdxToMarkdown(
      "import Thing from './thing';\n\nReal content.\n"
    );

    expect(result).not.toContain('import Thing');
    expect(result).toContain('Real content.');
  });

  it('strips jsx expression comments', async () => {
    const result = await mdxToMarkdown(
      '{/* a note to self */}\n\nVisible text.\n'
    );

    expect(result).not.toContain('a note to self');
    expect(result).toContain('Visible text.');
  });

  it('preserves gfm tables', async () => {
    const source = ['| a | b |', '| --- | --- |', '| 1 | 2 |'].join('\n');
    const result = await mdxToMarkdown(source);

    expect(result).toContain('| a | b |');
  });
});
