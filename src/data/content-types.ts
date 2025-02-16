import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

import type { Series } from '@lib/series';

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

export type Tag = string;

/**
 * Union type of all possible frontmatter shapes
 */
export type ContentFrontmatter = NewsletterMetadata | Article['frontmatter'];
