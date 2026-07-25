import type { MarkdownDocument } from '@data/content-types';
import type { MarkdownContentType } from '@lib/markdown-export/urls';
import { after } from 'next/server';
import { flushLogs } from '@server/logging/otel-logs';

import { getAllPosts } from '@lib/blog';
import { buildExportOptions } from '@lib/markdown-export/export-context';
import { renderMarkdownDocument } from '@lib/markdown-export/render-document';
import { getAllNewsletters } from '@lib/newsletters';

export const dynamic = 'force-static';

type FeedEntry = {
  document: MarkdownDocument;
  type: MarkdownContentType;
};

export async function GET() {
  const [posts, newsletters] = await Promise.all([
    getAllPosts(),
    getAllNewsletters(),
  ]);

  const entries: FeedEntry[] = [
    ...posts.map((document) => ({ document, type: 'posts' as const })),
    ...newsletters.map((document) => ({
      document,
      type: 'newsletter' as const,
    })),
  ].sort(
    (a, b) =>
      new Date(b.document.frontmatter.date).getTime() -
      new Date(a.document.frontmatter.date).getTime()
  );

  const rendered = await Promise.all(
    entries.map(async ({ document, type }) =>
      renderMarkdownDocument(
        document,
        await buildExportOptions(document, type, document.slug)
      )
    )
  );

  const content = [
    '# mikebifulco.com: full content',
    '',
    "> Every published article and newsletter issue from Mike Bifulco's site, in Markdown. Each document carries a `canonical` field pointing at its web URL.",
    '',
    rendered.join('\n\n---\n\n'),
  ].join('\n');

  after(flushLogs);

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
