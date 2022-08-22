/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://mikebifulco.com',
  generateRobotsTxt: process.env.CONTEXT === 'production', // only generate robots.txt for prod
  // ...other options
};
