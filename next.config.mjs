import withBundleAnalyzer from '@next/bundle-analyzer';
import { withBotId } from 'botid/next/config';
import { createJiti } from 'jiti';

const jiti = createJiti(new URL(import.meta.url).pathname);

await jiti.import('./src/utils/env');

// Import centralized pagination redirect logic
const { generatePaginationConfigRedirects } = await jiti.import(
  './src/utils/pagination-redirects'
);

// Redirect legacy post paths to the new pattern
const oldPostPaths = [
  '/why-fathom-analytics',
  '/on-normalcy',
  '/plan-for-things-to-go-wrong-in-your-web-app',
  '/are-you-suddenly-a-remote-worker',
  '/crosspost-introducing-pistola',
  '/gatsby-dev-to-cross-poster-brainstorm',
  '/i-have-to-tell-you-about-dependabot',
  '/all-about-ch',
  '/promise-all-settled-pt-2-its-partly-settled',
  '/picking-apart-javascript-import',
  '/solve-all-your-problems-with-promise-allsettled',
  '/reclaimed-10gb-of-disk-space-from-node-modules',
  '/sticker-update-we-raised-176-nzd',
  '/deconfusing-javascript-destructuring-syntax',
  '/quick-tip-uninstall-postgres-from-your-mac',
  '/egg-them-all',
  '/chrome-extensions-i-use',
  '/my-favorite-design-problem-microphones',
  '/embracing-prettier',
  '/it-was-time',
  '/tech-product-growth-wabi-sabi',
  '/naming-your-product-kiki-bouba',
  '/design-decisions-cafe-tables',
];

const postRedirects = oldPostPaths.map((path) => ({
  source: path,
  destination: `/posts${path}`,
  permanent: false,
}));

/**
 * @type {import('next').NextConfig}
 **/
const config = {
  reactCompiler: true,
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
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
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
    ...generatePaginationConfigRedirects(),
    ...postRedirects,
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
  turbopack: {},
  webpack: (config, { dev, isServer: _ }) => {
    // Only apply webpack config when not using turbopack
    if (!dev) {
      return config;
    }
    if (dev) {
      config.optimization.minimize = false;
    }
    return config;
  },
};

export default withBotId(
  withBundleAnalyzer({ enabled: process.env.ANALYZE === true })(config)
);
