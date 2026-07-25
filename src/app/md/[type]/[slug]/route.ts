import type { MarkdownDocument } from '@data/content-types';
import type { MarkdownContentType } from '@lib/markdown-export/urls';
import { after } from 'next/server';
import { flushLogs } from '@server/logging/otel-logs';

import { getAllPosts, getPostBySlug } from '@lib/blog';
import { renderMarkdownDocument } from '@lib/markdown-export/render-document';
import {
  canonicalUrlFor,
  isMarkdownContentType,
} from '@lib/markdown-export/urls';
import { getAllNewsletters, getNewsletterBySlug } from '@lib/newsletters';

export const dynamic = 'force-static';

type RouteParams = {
  params: Promise<{ type: string; slug: string }>;
};

const loadDocument = async (
  type: MarkdownContentType,
  slug: string
): Promise<MarkdownDocument | null> => {
  try {
    return type === 'posts'
      ? await getPostBySlug(slug)
      : await getNewsletterBySlug(slug);
  } catch {
    return null;
  }
};

export const generateStaticParams = async () => {
  const [posts, newsletters] = await Promise.all([
    getAllPosts(),
    getAllNewsletters(),
  ]);

  return [
    ...posts.map((post) => ({ type: 'posts', slug: post.slug })),
    ...newsletters.map((newsletter) => ({
      type: 'newsletter',
      slug: newsletter.slug,
    })),
  ];
};

export async function GET(_request: Request, { params }: RouteParams) {
  const { type, slug } = await params;

  if (!isMarkdownContentType(type)) {
    return new Response('Not found', { status: 404 });
  }

  const document = await loadDocument(type, slug);

  // Drafts are filtered out of generateStaticParams in production, but guard
  // here too so a direct hit on /md/... in dev behaves the same way.
  if (!document || document.frontmatter?.published === false) {
    return new Response('Not found', { status: 404 });
  }

  const content = await renderMarkdownDocument(document, {
    canonicalUrl: canonicalUrlFor(type, slug),
  });

  after(flushLogs);

  return new Response(content, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
