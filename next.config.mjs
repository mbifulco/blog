import withBundleAnalyzer from '@next/bundle-analyzer';
import { createJiti } from 'jiti';

const jiti = createJiti(new URL(import.meta.url).pathname);

// Use the recommended import() method instead of direct call
await jiti.import('./src/utils/env');

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
  swcMinify: false,
  productionBrowserSourceMaps: true,
  skipTrailingSlashRedirect: true,
  redirects: async () => [
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
  ],
  rewrites: async () => [
    {
      source: '/ingest/static/:path*',
      destination: 'https://us-assets.i.posthog.com/static/:path*',
    },
    {
      source: '/ingest/:path*',
      destination: 'https://us.i.posthog.com/:path*',
    },
    {
      source: '/ingest/decide',
      destination: 'https://us.i.posthog.com/decide',
    },
  ],
  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      config.optimization.minimize = false;
    }
    return config;
  },
};

export default withBundleAnalyzer({ enabled: process.env.ANALYZE === true })(
  config
);
