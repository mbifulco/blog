const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const config = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx'],
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
    ];
  },
};

module.exports = withBundleAnalyzer(config);
