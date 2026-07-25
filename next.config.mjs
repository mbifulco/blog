import withBundleAnalyzer from '@next/bundle-analyzer';
import { withPostHogConfig } from '@posthog/nextjs-config';
import { createJiti } from 'jiti';

const jiti = createJiti(new URL(import.meta.url).pathname);

await jiti.import('./src/utils/env');

const { POSTHOG_API_HOST, POSTHOG_ASSETS_HOST } = await jiti.import(
  './src/lib/posthog/hosts'
);

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
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  productionBrowserSourceMaps: false,
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
    {
      // Corrects a long-standing typo'd internal link to this post's real slug
      source: '/posts/seo-tools-for-new-projects',
      destination: '/posts/seo-tools-for-new-web-projects',
      permanent: true,
    },
    ...generatePaginationConfigRedirects(),
    ...postRedirects,
  ],
  rewrites: async () => [
    // Markdown twins: /posts/foo.md and /newsletter/foo.md are served by the
    // static route handler at /md/[type]/[slug].
    {
      source: '/posts/:slug.md',
      destination: '/md/posts/:slug',
    },
    {
      source: '/newsletter/:slug.md',
      destination: '/md/newsletter/:slug',
    },
    {
      source: '/ingest/static/:path*',
      destination: `${POSTHOG_ASSETS_HOST}/static/:path*`,
    },
    {
      source: '/ingest/:path*',
      destination: `${POSTHOG_API_HOST}/:path*`,
    },
    {
      source: '/ingest/decide',
      destination: `${POSTHOG_API_HOST}/decide`,
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

export default withPostHogConfig(
  withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })(config),
  {
    personalApiKey: process.env.POSTHOG_PERSONAL_API_KEY,
    projectId: process.env.NEXT_PUBLIC_POSTHOG_PROJECT_ID,
    // Always use the real API host for build-time uploads. NEXT_PUBLIC_POSTHOG_HOST
    // may be pointed at the /ingest reverse proxy (which does not proxy the
    // sourcemap upload API), which would silently break uploads.
    host: POSTHOG_API_HOST,
    sourcemaps: {
      enabled: process.env.VERCEL_ENV === 'production',
      deleteAfterUpload: true,
    },
  }
);
