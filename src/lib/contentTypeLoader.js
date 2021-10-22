// Install gray-matter and date-fns
import matter from 'gray-matter';
import { parse, compareDesc } from 'date-fns';
import fs from 'fs';
import { join } from 'path';
import { serialize } from 'next-mdx-remote/serialize';

export async function getContentBySlug(slug, directory, type) {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = join(directory, `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  let date;
  try {
    // store date in frontmatter as milliseconds since epoch
    date = parse(data.date, 'MM-dd-yyyy', new Date()).getTime();
  } catch (e) {
    console.error('invalid date in frontmatter of', data.title);
    throw e;
  }

  const mdxSource = await serialize(content);

  return {
    slug: realSlug,
    frontmatter: {
      ...data,
      date,
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
    compareDesc(a?.frontmatter?.date, b?.frontmatter?.date)
  );

  /// filter out drafts for production
  if (process.env.NODE_ENV === 'production') {
    return articles.filter(
      (article) => article.frontmatter?.published !== false
    );
  }

  return articles;
}
