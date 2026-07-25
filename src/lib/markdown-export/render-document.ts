import type { MarkdownDocument } from '@data/content-types';
import type { MarkdownExportOptions, MarkdownRelatedLink } from './types';

import { mdxToMarkdown } from './mdx-to-markdown';

/**
 * Frontmatter dates arrive as UTC strings from processMDXFileContent, so read
 * the UTC parts directly. Using local getters would shift the calendar day for
 * anyone running outside UTC.
 */
const toIsoDate = (value: string | number | Date): string | null => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  return `${date.getUTCFullYear()}-${month}-${day}`;
};

const quote = (value: string) => `'${value.replace(/'/g, "''")}'`;

const linkList = (links: MarkdownRelatedLink[]) =>
  links.map(({ title, url }) => `- [${title}](${url})`).join('\n');

/**
 * Renders a post or newsletter as a standalone Markdown file: a small YAML
 * header, the title as an H1, the body with every custom component resolved
 * to real Markdown, then links onward to related content and an attribution
 * line.
 *
 * The trailing sections matter for machine readers. Without them each file is
 * a dead end with no path to the rest of the site, and no unambiguous
 * statement of who wrote it or where it lives.
 */
export const renderMarkdownDocument = async (
  document: MarkdownDocument,
  options: MarkdownExportOptions
): Promise<string> => {
  const { frontmatter } = document;
  const lines: string[] = ['---'];

  lines.push(`title: ${quote(String(frontmatter.title ?? ''))}`);

  const date = toIsoDate(frontmatter.date);
  if (date) lines.push(`date: ${date}`);

  if (frontmatter.updated) {
    const updated = toIsoDate(frontmatter.updated);
    if (updated) lines.push(`updated: ${updated}`);
  }

  if (frontmatter.excerpt) {
    lines.push(`excerpt: ${quote(frontmatter.excerpt)}`);
  }

  if (frontmatter.tags && frontmatter.tags.length > 0) {
    lines.push(`tags: [${frontmatter.tags.join(', ')}]`);
  }

  lines.push(`canonical: ${options.canonicalUrl}`);
  lines.push('---', '');

  const body = await mdxToMarkdown(document.content);

  // Post bodies carry no H1 of their own; the site renders the title from
  // frontmatter, so add it back for standalone Markdown.
  const sections = [`${lines.join('\n')}# ${frontmatter.title}`];

  // Answer-first summary, kept directly under the title where an extractive
  // reader will find it. Authored for exactly this purpose.
  if (frontmatter.tldr) {
    const tldr = await mdxToMarkdown(String(frontmatter.tldr));
    sections.push(`> **TL;DR:** ${tldr.trim()}`);
  }

  sections.push(body.trim());

  if (options.series && options.series.entries.length > 0) {
    sections.push(
      [
        `## Part of the ${options.series.name} series`,
        '',
        linkList(options.series.entries),
        '',
        `Full series: ${options.series.url}`,
      ].join('\n')
    );
  }

  if (options.relatedLinks && options.relatedLinks.length > 0) {
    // Deliberately not "Related reading": three posts already use that heading
    // for their own external links, and this list is specifically other pages
    // on this site.
    sections.push(
      ['## More from mikebifulco.com', '', linkList(options.relatedLinks)].join(
        '\n'
      )
    );
  }

  sections.push(
    [
      '---',
      '',
      `Written by Mike Bifulco. Originally published at ${options.canonicalUrl}`,
    ].join('\n')
  );

  return `${sections.join('\n\n')}\n`;
};
