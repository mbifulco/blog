const env = import('./src/utils/env.mjs');

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: env.SITE_URL || 'https://mikebifulco.com',
  generateRobotsTxt: process.env.CONTEXT === 'production', // only generate robots.txt for prod
  // ...other options
};
