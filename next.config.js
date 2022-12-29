const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const config = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx'],
  images: {
    domains: ['i.ytimg.com', 'res.cloudinary.com', 'images.unsplash.com'],
  },
  productionBrowserSourceMaps: true,
  experimental: {
    esmExternals: false,
  },
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
        destination: 'https://www.passionfroot.xyz/irreverentmike',
        permanent: false,
      },
    ];
  },
};

module.exports = withBundleAnalyzer(config);
