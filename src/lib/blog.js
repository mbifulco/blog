// Install gray-matter and date-fns
import matter from 'gray-matter';
import { parse, compareDesc } from 'date-fns';
import fs from 'fs';
import { join } from 'path';

// Add markdown files in `src/content/blog`
const postsDirectory = join(process.cwd(), 'src', 'data', 'posts');

export function getPostBySlug(slug) {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = join(postsDirectory, `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  // store date in frontmatter as milliseconds since epoch
  const date = parse(data.date, 'mm-dd-yyyy', new Date()).getTime();

  return {
    slug: realSlug,
    frontmatter: {
      ...data,
      date,
    },
    content,
  };
}

export function getAllPosts() {
  const slugs = fs.readdirSync(postsDirectory);
  let posts = slugs.map((slug) => getPostBySlug(slug));

  //sort posts by date,  newest first
  posts.sort((a, b) => compareDesc(a.frontmatter.date, b.frontmatter.date));

  return posts;
}
