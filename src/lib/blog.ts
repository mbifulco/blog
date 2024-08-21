// Install gray-matter and date-fns
import { join } from 'path';

import type { BlogPost } from '../data/content-types';
import {
  getAllContentFromDirectory,
  getContentBySlug,
} from './contentTypeLoader';

// Add markdown files in `src/content/blog`
const postsDirectory = join(process.cwd(), 'src', 'data', 'posts');
const POST_CONTENT_TYPE = 'post';

export const getPostBySlug = async (slug: string) => {
  const post = await getContentBySlug(slug, postsDirectory, POST_CONTENT_TYPE);

  return post as BlogPost;
};

export const getAllPosts = async () => {
  const allPosts = (await getAllContentFromDirectory(
    postsDirectory,
    POST_CONTENT_TYPE
  )) as BlogPost[];

  return allPosts;
};

export const getAllPostsByTag = async (tag: string) => {
  const posts = await getAllPosts();

  if (!tag) {
    return [];
  }

  return posts.filter((post) => {
    if (post.frontmatter.tags) {
      return post.frontmatter.tags.includes(tag);
    }
    return false;
  });
};
