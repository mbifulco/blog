// Install gray-matter and date-fns
import matter from 'gray-matter';
import { compareDesc } from 'date-fns';
import fs from 'fs';
import { join } from 'path';
import { serialize } from 'next-mdx-remote/serialize';
import { parseTag } from './tags';

export async function getContentBySlug(slug, directory, type) {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = join(directory, `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const { data, content } = matter(fileContents);

  const articleDate = new Date(data.date);

  const mdxSource = await serialize(content);

  return {
    slug: realSlug,
    frontmatter: {
      ...data,
      date: articleDate.toUTCString(),
      tags: data?.tags?.map((tag) => parseTag(tag)) || [],
      type,
    },
    content,
    source: mdxSource,
  };
}

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
