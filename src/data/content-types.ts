import type { Series } from '@lib/series';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

/**
 * Represents a heading in MDX content with its hierarchy level,
 * display text, and URL-safe slug
 */
export type Heading = {
  level: number; // h1 = 1, h2 = 2, etc.
  text: string; // Display text
  slug: string; // URL-safe identifier
};

/**
 * Base properties that all content types share in their frontmatter
 */
export type BaseFrontmatter = {
  date: string | number | Date;
  title: string;
  slug: string;
  tags?: string[];
  published?: boolean;
};

/**
 * Additional frontmatter fields that may appear in any content type
 */
export type OptionalFrontmatter = {
  podcastUrl?: string;
  youTubeId?: string;
  series?: string;
  excerpt?: string;
  coverImagePublicId?: string;
  url?: string;
  content?: string;
  // Date the content was last meaningfully updated. Drives dateModified in
  // structured data and article:modified_time. Falls back to `date` when absent.
  updated?: string | number | Date;
  // Answer-first summary. Rendered as a TL;DR box near the title and emitted
  // into BlogPosting structured data (abstract) for AI/search extraction.
  tldr?: string;
};

/**
 * Complete frontmatter type that combines base and optional fields
 */
export type Frontmatter = BaseFrontmatter & OptionalFrontmatter;

/**
 * Core document structure for all markdown content
 */
export type MarkdownDocument = {
  // we add a type to the frontmatter to help with type inference
  frontmatter: Frontmatter & { type: string };
  content: string;
  tableOfContents?: Heading[];
  slug: string;
  source: MDXRemoteSerializeResult;
  // Serialized `tldr` frontmatter, so the TL;DR box can render inline markdown
  // (code spans, links, emphasis) instead of raw text.
  tldrSource?: MDXRemoteSerializeResult;
};

/**
 * Newsletter-specific metadata requirements
 */
export type NewsletterMetadata = BaseFrontmatter & {
  coverImagePublicId: string;
  excerpt: string;
};

/**
 * Complete Newsletter type including content and metadata
 */
export type Newsletter = MarkdownDocument & {
  frontmatter: NewsletterMetadata;
};

export type NewsletterItemProps = {
  newsletter: Newsletter;
  series?: Series;
};

/**
 * Blog post type with specific frontmatter requirements
 */
export type BlogPost = MarkdownDocument & {
  frontmatter: {
    coverImagePublicId: string;
    excerpt: string;
    content: string;
    published: boolean;
  } & BaseFrontmatter;
};

/**
 * External article reference type
 */
export type Article = MarkdownDocument & {
  frontmatter: {
    url: string;
  } & BaseFrontmatter;
};

export const ContentTypes = {
  Post: 'post',
  Newsletter: 'newsletter',
  Article: 'article',
} as const;

/**
 * Union type of all content types on the site
 */
export type ContentType = (typeof ContentTypes)[keyof typeof ContentTypes];
