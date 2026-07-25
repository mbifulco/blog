import { BASE_SITE_URL } from '@/config';

/**
 * URL segments that have a Markdown twin. These match the public routes
 * (`/posts/...`, `/newsletter/...`), not the content type names.
 */
export const MARKDOWN_CONTENT_TYPES = ['posts', 'newsletter'] as const;

export type MarkdownContentType = (typeof MARKDOWN_CONTENT_TYPES)[number];

export const isMarkdownContentType = (
  value: string
): value is MarkdownContentType =>
  (MARKDOWN_CONTENT_TYPES as readonly string[]).includes(value);

/**
 * Site-relative path to a document's Markdown twin. Prefer this in the browser
 * so fetches stay same-origin on localhost and preview deployments.
 */
export const markdownPathFor = (type: MarkdownContentType, slug: string) =>
  `/${type}/${slug}.md`;

/**
 * The absolute public URL for a document's Markdown twin, for crawlers and
 * anything shared off-site. The `/md/...` route is an implementation detail
 * reached through a rewrite; this is what we advertise.
 */
export const markdownUrlFor = (type: MarkdownContentType, slug: string) =>
  `${BASE_SITE_URL}${markdownPathFor(type, slug)}`;

/** The canonical HTML URL a Markdown document points back at. */
export const canonicalUrlFor = (type: MarkdownContentType, slug: string) =>
  `${BASE_SITE_URL}/${type}/${slug}`;
