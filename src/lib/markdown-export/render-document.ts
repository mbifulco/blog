import type { MarkdownDocument } from '@data/content-types';
import type { MarkdownExportOptions } from './types';

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

/**
 * Renders a post or newsletter as a standalone Markdown file: a small YAML
 * header, the title as an H1, then the body with every custom component
 * resolved to real Markdown.
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
  return `${lines.join('\n')}# ${frontmatter.title}\n\n${body.trimStart()}`;
};
