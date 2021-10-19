// Install gray-matter and date-fns
import matter from 'gray-matter';
import { parse, compareDesc } from 'date-fns';
import fs from 'fs';
import { join } from 'path';

export function getContentBySlug(slug, directory) {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = join(directory, `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  // store date in frontmatter as milliseconds since epoch
  const date = parse(data.date, 'MM-dd-yyyy', new Date()).getTime();

  return {
    slug: realSlug,
    frontmatter: {
      ...data,
      date,
    },
    content,
  };
}

export function getAllContentFromDirectory(directory) {
  const slugs = fs.readdirSync(directory);
  const articles = slugs.map((slug) => getContentBySlug(slug, directory));

  // sort posts by date,  newest first
  articles.sort((a, b) =>
    compareDesc(a?.frontmatter.date, b?.frontmatter.date)
  );

  /// filter out drafts for production
  if (process.env.NODE_ENV === 'production') {
    return articles.filter(
      (article) => articles.frontmatter?.published !== false
    );
  }

  return articles;
}
