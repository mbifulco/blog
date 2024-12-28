import type { MetadataRoute } from 'next';

import { getAllPosts } from '@lib/blog';
import { getAllNewsletters } from '@lib/newsletters';
import { getAllTags } from '@lib/tags';
import { BASE_SITE_URL } from '@/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = BASE_SITE_URL;

  const newsletters = await getAllNewsletters();
  const newslettersSitemap = newsletters.map((newsletter) => ({
    url: `${baseUrl}/newsletter/${newsletter.slug}`,
    lastModified: new Date(newsletter.frontmatter.date),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const posts = await getAllPosts();
  const postsSitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.frontmatter.date),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const { allTags } = await getAllTags();
  const tagsSitemap = allTags.map((tag) => ({
    url: `${baseUrl}/tags/${tag}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  // Define your static routes
  const routes: string[] = [
    '', // home page
    '/about',
    '/integrity',
    '/newsletter',
    '/podcast',
    '/posts',
    '/tags',
    '/work',
    '/shop',
  ];

  // Create sitemap entries for static routes
  const staticRoutesSitemap = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return [
    ...staticRoutesSitemap,
    ...newslettersSitemap,
    ...postsSitemap,
    ...tagsSitemap,
  ];
}
