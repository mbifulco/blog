import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

type Frontmatter = {
  date: string | number | Date;
  tags?: string[];
  published?: boolean;
  slug?: string;
  podcastUrl?: string;
} & Record<string, string | number | boolean | Date | string[]>;
// Extend MarkdownDocument to include common frontmatter fields and other fields as needed
export type MarkdownDocument = {
  frontmatter: Frontmatter; // Use intersection type to combine BaseFrontmatter with generic T
  content: string;
  slug: string;
  source: MDXRemoteSerializeResult; // Define what 'source' should contain more specifically if possible
};

type NewsletterMetadata = {
  coverImagePublicId: string;
  date: string | number | Date;
  excerpt: string;
  slug: string;
  tags: string[];
  title: string;
  path: string;
};

export type Newsletter = {
  frontmatter: NewsletterMetadata;
} & MarkdownDocument;

export type NewsletterItemProps = {
  newsletter: Newsletter;
  compact?: boolean;
};

export type BlogPost = MarkdownDocument & {
  frontmatter: {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    content: string;
    author?: string;
    coverImagePublicId: string;
    published: boolean;
    path: string;
    tags?: Tag[];
  };
};

export type Article = MarkdownDocument & {
  frontmatter: {
    date: string;
    url: string;
    title: string;
    tags: string[];
    slug: string;
  };
};

export type Tag = string;
