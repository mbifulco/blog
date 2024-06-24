// Install gray-matter and date-fns
import fs from 'fs';
import { join } from 'path';
import { compareDesc } from 'date-fns';
import matter from 'gray-matter';

import type { MarkdownDocument } from '../data/content-types';
import { getHeadings, serialize } from '../utils/mdx';
import { parseTag } from './tags';

export const getContentBySlug = async (
  slug: string,
  directory: fs.PathLike,
  type: string
): Promise<MarkdownDocument> => {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = join(directory.toString(), `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const { data, content } = matter(fileContents);

  const { date, tags } = data;

  const articleDate = new Date(date as string);

  const mdxSource = await serialize(content);
  const headings = getHeadings(content);

  return {
    slug: realSlug,
    frontmatter: {
      ...data,
      date: articleDate.toUTCString(),
      tags: (tags as string[])?.map((tag: string) => parseTag(tag)) || [],
      type,
    },
    content,
    tableOfContents: headings,
    source: mdxSource,
  };
};

export async function getAllContentFromDirectory(
  directory: fs.PathLike,
  type: string
) {
  const slugs = fs.readdirSync(directory);
  const articles = await Promise.all(
    slugs.map(async (slug) => await getContentBySlug(slug, directory, type))
  );

  // sort posts by date,  newest first
  articles.sort((a, b) =>
    compareDesc(new Date(a?.frontmatter?.date), new Date(b?.frontmatter?.date))
  );

  /// filter out drafts for production
  if (process.env.NODE_ENV === 'production') {
    return articles.filter(
      (article) => article.frontmatter?.published !== false
    );
  }

  return articles;
}
