// next.config.js
const withMDX = require('@next/mdx')({
  extension: /\.(md|mdx)$/,
  options: {
    providerImportSource: '@mdx-js/react',
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
      domains: ['i.ytimg.com', 'res.cloudinary.com', 'images.unsplash.com'],
    },
    productionBrowserSourceMaps: true,
    compress: false,
    webpack: (config, context) => {
      return {
        ...config,
        optimization: {
          ...config?.optimzation,
          minimize: false,
        },
      };
    },
    async redirects() {
      return [
        {
          source: '/meet',
          destination:
            'https://calendar.google.com/calendar/u/0/appointments/AcZssZ0QlIIDE1tJhxGyqfaTa-ap5wT9tKqrA7PpxWs=',
          permanent: false,
        },
        {
          source: '/meet/pod',
          destination:
            'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2Zi9tQAqlVuP3eLMftB7i7JOBoKdfMxB_GKNJHeE-CQJS6q8YMCUa1KJRJaZ4NprJ516JUAtYP',
          permanent: false,
        },
      ];
    },
  })
);
