// Install gray-matter and date-fns
import matter from 'gray-matter';
import { compareDesc } from 'date-fns';
import fs from 'fs';
import { join } from 'path';
import { serialize } from 'next-mdx-remote/serialize';
import imageSize from 'rehype-img-size';
import rehypeSlug from 'rehype-slug';

import { parseTag } from './tags';
import options from '../utils/mdxOptions';
import { MarkdownDocument } from '../data/content-types';

const { mdxOptions } = options;

export const getContentBySlug = async <T extends Record<string, any>>(
  slug: string,
  directory: string,
  type: string
): Promise<MarkdownDocument> => {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = join(directory, `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const { data, content } = matter(fileContents);

  const articleDate = new Date(data?.date);

  const mdxSource = await serialize(content, {
    mdxOptions: {
      rehypePlugins: [
        rehypeSlug, // add IDs to any h1-h6 tag that doesn't have one, using a slug made from its text
      ],
    },
    parseFrontmatter: true,
  });

  return {
    slug: realSlug,
    frontmatter: {
      ...data,
      date: articleDate.toUTCString(),
      tags: data?.tags?.map((tag: string) => parseTag(tag)) || [],
      type,
    },
    content,
    source: mdxSource,
  };
};

export async function getAllContentFromDirectory(directory, type) {
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
