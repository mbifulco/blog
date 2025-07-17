// Install gray-matter and date-fns
import { join } from 'path';

import { ContentTypes } from '../data/content-types';
import type { BlogPost } from '../data/content-types';
import { paginate } from '../utils/pagination';
import type { PaginatedResult, PaginationOptions } from '../utils/pagination';
import { getAllContentFromDirectory } from './content-loaders/getAllContentFromDirectory';
import { getContentBySlug } from './content-loaders/getContentBySlug';

// Add markdown files in `src/content/blog`
const postsDirectory = join(process.cwd(), 'src', 'data', 'posts');

export const getPostBySlug = async (slug: string) => {
  const post = await getContentBySlug(slug, postsDirectory, ContentTypes.Post);

  return post as BlogPost;
};

export const getAllPosts = async () => {
  const allPosts = (await getAllContentFromDirectory(
    postsDirectory,
    ContentTypes.Post
  )) as BlogPost[];

  return allPosts;
};

export const getPaginatedPosts = async (
  options: PaginationOptions = {}
): Promise<PaginatedResult<BlogPost>> => {
  const allPosts = await getAllPosts();
  return paginate(allPosts, options);
};
