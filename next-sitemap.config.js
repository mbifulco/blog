/** @type {import('next-sitemap').IConfig} */
module.exports = {
  // process.env.SITE_URL provided by next.js, no need to use env for it
  siteUrl: process.env.env.SITE_URL || 'https://mikebifulco.com',
  generateRobotsTxt: process.env.CONTEXT === 'production', // only generate robots.txt for prod
  // ...other options
};
