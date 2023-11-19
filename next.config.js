const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/**
 * @type {import('next').NextConfig}
 **/

const config = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'webmention.io',
      },
    ],
  },
  productionBrowserSourceMaps: true,
  redirects: async () => {
    return [
      {
        source: '/meet',
        destination: 'https://savvycal.com/irreverentmike/30m',
        permanent: false,
      },
      {
        source: '/meet/pod',
        destination: 'https://savvycal.com/irreverentmike/pod',
        permanent: false,
      },
      {
        source: '/sponsor',
        destination: 'https://www.passionfroot.me/irreverentmike',
        permanent: false,
      },
      {
        source: '/tinyimprovements',
        destination: '/newsletter',
        permanent: false,
      },
    ];
  },
};

module.exports = withBundleAnalyzer(config);
