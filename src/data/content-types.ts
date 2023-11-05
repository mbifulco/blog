type NewsletterMetadata = {
  coverImagePublicId: string;
  date: string | number | Date;
  excerpt: string;
  slug: string;
  tags: string[];
  title: string;
};

export type Newsletter = {
  frontmatter: NewsletterMetadata;
};
export type NewsletterItemProps = {
  newsletter: Newsletter;
  compact?: boolean;
};
export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
};
export type Article = {
  slug: string;
  title: string;
  description: string;
  url: string;
  image: string;
  date: string;
};
