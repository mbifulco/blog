import fs from 'fs';
import { join } from 'path';

import { getAllPosts, getAllExternalReferences } from '../lib/blog';
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
  const staticPagesDirectory = join(process.cwd(), 'src', 'pages');
  const staticPages = fs
    .readdirSync(staticPagesDirectory)
    .filter((staticPage) => {
      return ![
        '[slug].js',
        '_app.js',
        '_document.js',
        '_error.js',
        'sitemap.xml.js',
      ].includes(staticPage);
    })
    .map((staticPagePath) => {
      return `${siteUrl}/${staticPagePath.replace('.js', '')}`;
    });

  const allPostUrls = (await getAllPosts()).map(
    (post) => `${siteUrl}/${post.frontmatter.path}`
  );

  const allTagUrls = Array.from((await getAllTags()).allTags).map(
    (tag) => `${siteUrl}/tags/${tag}`
  );

  console.log(allPostUrls);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticPages.map((page) => urlEntryForPage(page)).join('')}
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
