import type { Paragraph, RootContent } from 'mdast';
import type { JsxHandler } from './types';

import { getCloudinaryImageUrl } from '@utils/images';

const paragraph = (children: RootContent[]): Paragraph =>
  ({ type: 'paragraph', children }) as Paragraph;

const heading = (depth: 2 | 3, value: string): RootContent =>
  ({
    type: 'heading',
    depth,
    children: [{ type: 'text', value }],
  }) as RootContent;

const linkParagraph = (url: string, label: string): Paragraph =>
  paragraph([
    {
      type: 'link',
      url,
      children: [{ type: 'text', value: label }],
    } as RootContent,
  ]);

/**
 * Images carry a Cloudinary publicId rather than a URL, so resolve it to the
 * same optimized asset the site serves. A missing publicId means there is
 * nothing useful to emit.
 */
const imageHandler: JsxHandler = (attrs) => {
  const { publicId, alt, caption } = attrs;

  if (!publicId) return [];

  const image = paragraph([
    {
      type: 'image',
      url: getCloudinaryImageUrl(publicId),
      alt: alt ?? '',
      title: null,
    } as RootContent,
  ]);

  if (!caption) return [image];

  return [
    image,
    paragraph([
      {
        type: 'emphasis',
        children: [{ type: 'text', value: caption }],
      } as RootContent,
    ]),
  ];
};

const blockquoteHandler: JsxHandler = (_attrs, children) => [
  { type: 'blockquote', children } as RootContent,
];

export const componentHandlers: Record<string, JsxHandler> = {
  Image: imageHandler,
  OrtonEffectImage: imageHandler,

  Aside: blockquoteHandler,
  PullQuote: blockquoteHandler,

  FAQ: (_attrs, children) => [heading(2, 'FAQ'), ...children],

  FAQItem: (attrs, children) => [
    ...(attrs.question ? [heading(3, attrs.question)] : []),
    ...children,
  ],

  YouTube: (attrs) => {
    const id = attrs.youTubeId ?? attrs.id;
    if (!id) return [];
    return [
      linkParagraph(
        `https://www.youtube.com/watch?v=${id}`,
        'Watch on YouTube'
      ),
    ];
  },

  Tweet: (attrs) => {
    const url = attrs.url ?? attrs.tweetLink;
    return url ? [linkParagraph(url, 'View on X')] : [];
  },

  Threads: (attrs) => {
    const url = attrs.url ?? attrs.href;
    return url ? [linkParagraph(url, 'View on Threads')] : [];
  },

  Link: (attrs, children) => {
    if (!attrs.href) return children;
    return [
      {
        type: 'link',
        url: attrs.href,
        children:
          children.length > 0
            ? children
            : [{ type: 'text', value: attrs.href }],
      } as RootContent,
    ];
  },

  // Purely visual wrappers: keep the words, drop the styling.
  Highlight: (_attrs, children) => children,
  Button: (_attrs, children) => children,
};

/**
 * Components removed from exported Markdown along with their children.
 *
 * SponsoredSection is dropped deliberately: sponsorship copy should not be
 * handed to language models. The rest are interactive demos or page furniture
 * with no textual meaning.
 */
export const droppedComponents: ReadonlySet<string> = new Set([
  'SponsoredSection',
  'Colophon',
  'Script',
  'TextPrettyDemo',
  'CenteredTextDemo',
]);
