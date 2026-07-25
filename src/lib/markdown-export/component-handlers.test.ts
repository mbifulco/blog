import { describe, expect, it } from 'vitest';

import { componentHandlers, droppedComponents } from './component-handlers';

const text = (value: string) =>
  ({ type: 'paragraph', children: [{ type: 'text', value }] }) as never;

describe('componentHandlers', () => {
  it('renders Image as an image node with a cloudinary url', () => {
    const nodes = componentHandlers.Image(
      { publicId: 'posts/all-about-ch/wikipedia-4k', alt: 'A screenshot' },
      []
    );

    expect(nodes).toHaveLength(1);
    const paragraph = nodes[0] as unknown as {
      type: string;
      children: { type: string; url: string; alt: string }[];
    };
    expect(paragraph.type).toBe('paragraph');
    expect(paragraph.children[0].type).toBe('image');
    expect(paragraph.children[0].alt).toBe('A screenshot');
    expect(paragraph.children[0].url).toContain(
      'posts/all-about-ch/wikipedia-4k'
    );
  });

  it('adds an emphasised caption paragraph when caption is present', () => {
    const nodes = componentHandlers.Image(
      { publicId: 'x/y', alt: 'alt text', caption: 'A caption' },
      []
    );

    expect(nodes).toHaveLength(2);
    expect(JSON.stringify(nodes[1])).toContain('A caption');
    expect(
      (nodes[1] as unknown as { children: { type: string }[] }).children[0].type
    ).toBe('emphasis');
  });

  it('omits the image entirely when publicId is missing', () => {
    expect(componentHandlers.Image({ alt: 'no id' }, [])).toEqual([]);
  });

  it('renders OrtonEffectImage the same way as Image', () => {
    expect(componentHandlers.OrtonEffectImage).toBe(componentHandlers.Image);
  });

  it('renders Aside as a blockquote wrapping its children', () => {
    const nodes = componentHandlers.Aside({}, [text('Heads up')]);

    expect(nodes).toHaveLength(1);
    expect((nodes[0] as { type: string }).type).toBe('blockquote');
    expect(JSON.stringify(nodes[0])).toContain('Heads up');
  });

  it('renders PullQuote as a blockquote', () => {
    const nodes = componentHandlers.PullQuote({}, [text('Quotable')]);
    expect((nodes[0] as { type: string }).type).toBe('blockquote');
  });

  it('renders FAQ as a heading followed by its children', () => {
    const nodes = componentHandlers.FAQ({}, [text('inner')]);

    expect((nodes[0] as { type: string }).type).toBe('heading');
    expect((nodes[0] as unknown as { depth: number }).depth).toBe(2);
    expect(JSON.stringify(nodes[0])).toContain('FAQ');
    expect(JSON.stringify(nodes[1])).toContain('inner');
  });

  it('renders FAQItem as an h3 question plus the answer body', () => {
    const nodes = componentHandlers.FAQItem({ question: 'What is a ch?' }, [
      text('A character width.'),
    ]);

    expect((nodes[0] as unknown as { depth: number }).depth).toBe(3);
    expect(JSON.stringify(nodes[0])).toContain('What is a ch?');
    expect(JSON.stringify(nodes[1])).toContain('A character width.');
  });

  it('renders YouTube as a watch link', () => {
    const nodes = componentHandlers.YouTube({ youTubeId: 'abc123' }, []);

    expect(JSON.stringify(nodes)).toContain(
      'https://www.youtube.com/watch?v=abc123'
    );
  });

  it('renders Tweet as a link to the tweet', () => {
    const nodes = componentHandlers.Tweet(
      { url: 'https://twitter.com/irreverentmike/status/1' },
      []
    );

    expect(JSON.stringify(nodes)).toContain(
      'https://twitter.com/irreverentmike/status/1'
    );
  });

  it('renders Link as a markdown link keeping its children', () => {
    const nodes = componentHandlers.Link({ href: 'https://example.com' }, [
      { type: 'text', value: 'Example' } as never,
    ]);

    expect(JSON.stringify(nodes)).toContain('https://example.com');
    expect(JSON.stringify(nodes)).toContain('Example');
  });

  it('renders Highlight as its children only', () => {
    const children = [{ type: 'text', value: 'shiny' } as never];
    expect(componentHandlers.Highlight({}, children)).toEqual(children);
  });

  it('drops SponsoredSection along with its children', () => {
    expect(droppedComponents.has('SponsoredSection')).toBe(true);
  });

  it('drops non-content components', () => {
    for (const name of [
      'Colophon',
      'Script',
      'TextPrettyDemo',
      'CenteredTextDemo',
    ]) {
      expect(droppedComponents.has(name)).toBe(true);
    }
  });

  it('never lists a component as both handled and dropped', () => {
    for (const name of Object.keys(componentHandlers)) {
      expect(droppedComponents.has(name)).toBe(false);
    }
  });
});
