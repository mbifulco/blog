// Install gray-matter and date-fns
import { join } from 'path';

import type { BlogPost } from '../data/content-types';
import { getAllContentFromDirectory } from './content-loaders/getAllContentFromDirectory';
import { getContentBySlug } from './content-loaders/getContentBySlug';
import { getContentSlugsForTag } from './tags';

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
  try {
    const posts = await getAllPosts();
    const slugsForTag = await getContentSlugsForTag(tag);
    return posts.filter((post) => slugsForTag.includes(post.slug));
  } catch (error) {
    console.error('Error getting posts by tag:', error);
    return [];
  }
};
