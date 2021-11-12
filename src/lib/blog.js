// Install gray-matter and date-fns
import matter from 'gray-matter';
import { compareDesc, format, parse } from 'date-fns';
import fs from 'fs';
import { join } from 'path';

// Add markdown files in `src/content/blog`
const postsDirectory = join(process.cwd(), 'src', 'data', 'posts');

export function getPostBySlug(slug) {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = join(postsDirectory, `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const stats = fs.statSync(fullPath);
  const { mtime } = stats;

  const { data, content } = matter(fileContents);

  // store date in frontmatter as milliseconds since epoch
  const lastModified = new Date(mtime);
  const postDate = new Date(data.date);

  let date = compareDesc(lastModified, postDate) < 0 ? lastModified : postDate;

  return {
    slug: realSlug,
    frontmatter: {
      ...data,
      date: date.toUTCString(),
    },
    content,
  };
}

export function getAllPosts() {
  const slugs = fs.readdirSync(postsDirectory);
  const posts = slugs.map((slug) => getPostBySlug(slug));

  // sort posts by date,  newest first
  posts.sort((a, b) =>
    compareDesc(new Date(a.frontmatter.date), new Date(b.frontmatter.date))
  );

  /// filter out drafts for production
  if (process.env.NODE_ENV === 'production') {
    return posts.filter((post) => post.frontmatter?.published !== false);
  }

  return posts;
}

export const getAllPostsByTag = (tag) =>
  getAllPosts().filter((post) => post?.frontmatter?.tags?.includes(tag)) || [];
