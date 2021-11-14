import fs from 'fs';
import { join } from 'path';

import config from '../config';

const { siteUrl } = config;

export const getStaticPageUrls = () => {
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

  return staticPages;
};
