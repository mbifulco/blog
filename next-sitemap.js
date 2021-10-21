module.exports = {
  siteUrl: process.env.SITE_URL || 'https://mikebifulco.com',
  generateRobotsTxt: process.env.NODE_ENV === 'production',
  // ...other options
};
