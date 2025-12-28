import { getAllPosts } from '@lib/blog';
import { getAllNewsletters } from '@lib/newsletters';
import { getAllTags } from '@lib/tags';
import { BASE_SITE_URL } from '@/config';

export async function GET() {
  const posts = await getAllPosts();
  const newsletters = await getAllNewsletters();
  const tags = await getAllTags();

  // Get recent posts (last 20)
  const recentPosts = posts.slice(0, 20);
  const recentNewsletters = newsletters.slice(0, 10);

  // Get popular tags (for topic organization)
  const popularTags = tags.slice(0, 15);

  const content = `# mikebifulco.com

> Mike Bifulco's personal site featuring articles on React, Next.js, startup building, developer advocacy, and software engineering. Mike is a startup CTO, Y Combinator alum, and creator of the Tiny Improvements newsletter.

## About the Author

Mike Bifulco is a software engineer, startup founder, and developer advocate. He has worked at Stripe, Google, and Microsoft, and is currently CTO at Craftwork. He is a Y Combinator alum (S21) and writes about building products, React/Next.js development, and startup life.

- [About Mike](${BASE_SITE_URL}/about): Full bio and background
- [Work History](${BASE_SITE_URL}/work): Professional experience and projects
- [Integrity & Values](${BASE_SITE_URL}/integrity): What Mike believes in

## Newsletter

- [Tiny Improvements Newsletter](${BASE_SITE_URL}/newsletter): Weekly newsletter on building better products and becoming a better developer. ${newsletters.length}+ issues published.

## Recent Articles

${recentPosts.map((post) => `- [${post.frontmatter.title}](${BASE_SITE_URL}/posts/${post.slug}): ${post.frontmatter.excerpt || ''}`).join('\n')}

## Recent Newsletter Issues

${recentNewsletters.map((newsletter) => `- [${newsletter.frontmatter.title}](${BASE_SITE_URL}/newsletter/${newsletter.slug}): ${newsletter.frontmatter.excerpt || ''}`).join('\n')}

## Topics

Browse articles by topic:

${popularTags.map((tag) => `- [${tag}](${BASE_SITE_URL}/tags/${tag})`).join('\n')}

## Optional

Additional resources that can be skipped for shorter context:

- [All Tags](${BASE_SITE_URL}/tags): Complete list of all topics covered
- [Podcast](${BASE_SITE_URL}/podcast): Tiny Improvements podcast episodes
- [RSS Feed](${BASE_SITE_URL}/rss.xml): Subscribe via RSS
- [Sitemap](${BASE_SITE_URL}/sitemap.xml): Full site structure
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
