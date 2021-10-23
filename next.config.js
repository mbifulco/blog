// next.config.js
const withMDX = require('@next/mdx')({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(
  withMDX({
    pageExtensions: ['js', 'jsx', 'md', 'mdx'],
    images: {
      domains: ['i.ytimg.com', 'res.cloudinary.com'],
    },
    i18n: {
      locales: ['en'],
      defaultLocale: 'en',
    },
  })
);
