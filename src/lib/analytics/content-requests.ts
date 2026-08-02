import type { MarkdownContentType } from '@lib/markdown-export/urls';

import { isMarkdownContentType } from '@lib/markdown-export/urls';

/**
 * The machine-readable files this site serves alongside its HTML pages. None of
 * them execute JavaScript, so the analytics snippets that cover the rest of the
 * site never see a request for one — the proxy is the only place they can be
 * counted. See src/server/analytics/track-content-request.ts.
 */
export type ContentRequestFormat = 'markdown' | 'llms-index' | 'llms-full';

export type TrackedContentRequest = {
  format: ContentRequestFormat;
  /** Set for markdown twins; null for the llms.txt files, which span the site. */
  contentType: MarkdownContentType | null;
  slug: string | null;
  /** The public path that was requested, e.g. `/posts/all-about-ch.md`. */
  path: string;
};

/**
 * Proxy matchers covering every path `classifyContentRequest` can match.
 *
 * Next.js requires the `matcher` array in src/proxy.ts to be a static literal it
 * can read without executing the file, so these strings cannot be imported
 * there. Keep the two lists in sync — a path missing from proxy.ts's matcher is
 * never routed through the proxy and silently goes uncounted.
 */
export const TRACKED_CONTENT_MATCHERS = [
  '/posts/:slug.md',
  '/newsletter/:slug.md',
  '/llms.txt',
  '/llms-full.txt',
] as const;

/** `/posts/some-slug.md` and `/newsletter/some-slug.md`, but nothing deeper. */
const MARKDOWN_TWIN_PATH = /^\/([^/]+)\/([^/]+)\.md$/;

/**
 * Identify a request for a machine-readable file, or return null for anything
 * else. Path-only: the proxy matcher has already narrowed the traffic, and this
 * guards against a matcher that drifts wider than the routes that exist.
 */
export const classifyContentRequest = (
  pathname: string
): TrackedContentRequest | null => {
  if (pathname === '/llms.txt') {
    return {
      format: 'llms-index',
      contentType: null,
      slug: null,
      path: pathname,
    };
  }

  if (pathname === '/llms-full.txt') {
    return {
      format: 'llms-full',
      contentType: null,
      slug: null,
      path: pathname,
    };
  }

  const match = MARKDOWN_TWIN_PATH.exec(pathname);
  if (!match) return null;

  const [, type, slug] = match;
  if (!isMarkdownContentType(type)) return null;

  return { format: 'markdown', contentType: type, slug, path: pathname };
};
