import type { MarkdownDocument } from '@data/content-types';

import { mdxToMarkdown } from './mdx-to-markdown';

/**
 * Depth of the heading that introduces each document inside llms-full.txt.
 * The file itself owns the single h1, and h2 groups the content types, so
 * documents sit at h3 and their own headings shift below that.
 */
const ENTRY_HEADING_DEPTH = 3;

/**
 * Body headings must sit strictly below the entry heading. Several posts open
 * at h1, so this is a floor rather than a fixed offset: without it those
 * headings would land on h3 and read as new entries.
 */
const MIN_BODY_HEADING_DEPTH = ENTRY_HEADING_DEPTH + 1;

const toIsoDate = (value: string | number | Date): string | null => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  return `${date.getUTCFullYear()}-${month}-${day}`;
};

export type CollectionEntryOptions = {
  canonicalUrl: string;
};

/**
 * Renders one document for inclusion in the concatenated llms-full.txt.
 *
 * This differs from the standalone `.md` twin on purpose. YAML frontmatter is
 * replaced with a plain metadata line, because `---` fences are
 * indistinguishable from the horizontal rules that separate entries. Headings
 * shift down so the whole file keeps one h1. Related-reading and series links
 * are omitted, since every document they point at is already in this file.
 */
export const renderCollectionEntry = async (
  document: MarkdownDocument,
  options: CollectionEntryOptions
): Promise<string> => {
  const { frontmatter } = document;
  const heading = '#'.repeat(ENTRY_HEADING_DEPTH);

  const meta = [`Source: ${options.canonicalUrl}`];

  const date = toIsoDate(frontmatter.date);
  if (date) meta.push(`Published: ${date}`);

  if (frontmatter.updated) {
    const updated = toIsoDate(frontmatter.updated);
    if (updated) meta.push(`Updated: ${updated}`);
  }

  if (frontmatter.tags && frontmatter.tags.length > 0) {
    meta.push(`Tags: ${frontmatter.tags.join(', ')}`);
  }

  const sections = [`${heading} ${frontmatter.title}`, meta.join(' | ')];

  if (frontmatter.tldr) {
    const tldr = await mdxToMarkdown(String(frontmatter.tldr));
    sections.push(`> **TL;DR:** ${tldr.trim()}`);
  }

  const body = await mdxToMarkdown(document.content, {
    minHeadingDepth: MIN_BODY_HEADING_DEPTH,
  });

  sections.push(body.trim());

  return sections.join('\n\n');
};
