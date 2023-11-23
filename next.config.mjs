import withBundleAnalyzer from '@next/bundle-analyzer';

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
      {
        source: '/tinyimprovements',
        destination: '/newsletter',
        permanent: false,
      },
    ];
  },
};

export default withBundleAnalyzer({ enabled: process.env.ANALYZE === true })(
  config
);
