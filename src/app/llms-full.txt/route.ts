import type { MarkdownDocument } from '@data/content-types';
import type { MarkdownContentType } from '@lib/markdown-export/urls';
import { after } from 'next/server';
import { flushLogs } from '@server/logging/otel-logs';

import { getAllPosts } from '@lib/blog';
import { renderCollectionEntry } from '@lib/markdown-export/render-collection';
import { canonicalUrlFor } from '@lib/markdown-export/urls';
import { getAllNewsletters } from '@lib/newsletters';
import { BASE_SITE_URL } from '@/config';

export const dynamic = 'force-static';

/**
 * Horizontal rule between entries. The llms.txt convention concatenates whole
 * documents separated by a rule, which only stays unambiguous because entries
 * carry no YAML frontmatter of their own.
 */
const ENTRY_SEPARATOR = '\n\n---\n\n';

type Group = {
  heading: string;
  type: MarkdownContentType;
  documents: MarkdownDocument[];
};

const newestFirst = (a: MarkdownDocument, b: MarkdownDocument) =>
  new Date(b.frontmatter.date).getTime() -
  new Date(a.frontmatter.date).getTime();

const renderGroup = async ({ heading, type, documents }: Group) => {
  const entries = await Promise.all(
    documents
      .slice()
      .sort(newestFirst)
      .map((document) =>
        renderCollectionEntry(document, {
          canonicalUrl: canonicalUrlFor(type, document.slug),
        })
      )
  );

  return `## ${heading}\n\n${entries.join(ENTRY_SEPARATOR)}`;
};

export async function GET() {
  const [posts, newsletters] = await Promise.all([
    getAllPosts(),
    getAllNewsletters(),
  ]);

  const groups: Group[] = [
    { heading: 'Articles', type: 'posts', documents: posts },
    {
      heading: 'Newsletter Issues',
      type: 'newsletter',
      documents: newsletters,
    },
  ];

  const rendered = await Promise.all(groups.map(renderGroup));

  // Structure follows the llms.txt convention: a single h1, a blockquote
  // summary, then h2 sections. Each document sits at h3 with its source URL,
  // so a reader can attribute any passage back to a page on the site.
  const content = [
    '# mikebifulco.com',
    '',
    "> The complete text of every published article and newsletter issue from Mike Bifulco's site. Mike is a startup CTO, Y Combinator alum, and writes about building products, React and Next.js development, design, and startup life.",
    '',
    `Each entry below is introduced by an h3 heading and a Source line giving its canonical URL. Individual documents are also available as Markdown by appending \`.md\` to any URL on the site, and a linked index lives at ${BASE_SITE_URL}/llms.txt.`,
    '',
    rendered.join('\n\n'),
  ].join('\n');

  after(flushLogs);

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
