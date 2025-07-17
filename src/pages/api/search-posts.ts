import type { NextApiRequest, NextApiResponse } from 'next';

import { getAllPosts } from '@lib/blog';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const posts = await getAllPosts();
    
    // Only return essential data for search to reduce payload size
    const searchPosts = posts.map(post => ({
      frontmatter: {
        title: post.frontmatter.title,
        slug: post.frontmatter.slug,
        excerpt: post.frontmatter.excerpt,
        tags: post.frontmatter.tags,
        date: post.frontmatter.date,
      },
      content: post.content,
    }));

    res.status(200).json({ posts: searchPosts });
  } catch (error) {
    console.error('Error loading posts for search:', error);
    res.status(500).json({ message: 'Failed to load posts' });
  }
}