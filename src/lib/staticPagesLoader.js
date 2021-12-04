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
        '_app.js',
        '_document.js',
        '[slug].js',
        'index.js',
        '_error.js',
      ].includes(staticPage);
    })
    .map((staticPagePath) => {
      return `${siteUrl}/${staticPagePath.replace('.js', '')}`;
    });

  return staticPages;
};
