import { getStaticPageUrls } from '../../lib/staticPagesLoader';
import { getAllPosts } from '../../lib/blog';
import { getAllTags } from '../../lib/tags';
import config from '../../config';

const { siteUrl } = config;

const urlEntryForPage = (url, frequency = 'daily', priority = 1.0) => `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${frequency}</changefreq>
    <priority>${priority}</priority>
  </url>
`;

export default async function handler(req, res) {
  const staticPageUrls = getStaticPageUrls();

  const allPostUrls = (await getAllPosts()).map(
    (post) => `${siteUrl}/posts/${post.frontmatter.path}`
  );

  const allTagUrls = Array.from((await getAllTags()).allTags).map(
    (tag) => `${siteUrl}/tags/${tag}`
  );

  const allUrls = [siteUrl, ...staticPageUrls, ...allPostUrls, ...allTagUrls];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${allUrls.map((page) => urlEntryForPage(page)).join('')}
    </urlset>
  `;
  res.setHeader('Content-Type', 'text/xml').status(200).send(sitemap);
}
