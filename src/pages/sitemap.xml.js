import { getStaticPageUrls } from '../lib/staticPagesLoader';
import { getAllPosts } from '../lib/blog';
import { getAllTags } from '../lib/tags';
import config from '../config';

const { siteUrl } = config;

const urlEntryForPage = (url, frequency = 'daily') => `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${frequency}</changefreq>
    <priority>1.0</priority>
  </url>
`;

export const getServerSideProps = async ({ res }) => {
  const staticPageUrls = getStaticPageUrls();

  const allPostUrls = (await getAllPosts()).map(
    (post) => `${siteUrl}/${post.frontmatter.path}`
  );

  const allTagUrls = Array.from((await getAllTags()).allTags).map(
    (tag) => `${siteUrl}/tags/${tag}`
  );

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticPageUrls.map((page) => urlEntryForPage(page)).join('')}
      ${allPostUrls.map((post) => urlEntryForPage(post)).join('')}
      ${allTagUrls.map((tag) => urlEntryForPage(tag)).join('')}
    </urlset>
  `;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

const Sitemap = () => {};

export default Sitemap;
