import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: [
    'src/pages/**/*.{ts,tsx}',
    'src/app/**/*.{ts,tsx}',
    'src/utils/email/templates/**/*.tsx',
    'src/**/*.test.{ts,tsx}', // vitest runs these directly as entry points
    'scripts/**/*.ts',
    // next.config.mjs uses dynamic jiti import of pagination-redirects,
    // which knip can't trace statically — both files need to be entry points
    'next.config.{mjs,js,ts}',
    'src/utils/pagination-redirects.ts',
    'tailwind.config.{js,ts}',
    'postcss.config.{js,ts}',

  ],
  project: ['src/**/*.{ts,tsx}', 'scripts/**/*.ts'],
  ignoreDependencies: [
    'sharp', // next/image peer dep, not imported directly
    '@react-email/ui', // auto-installed at runtime by react-email CLI, not a direct import
    'eslint-config-prettier', // loaded by eslint config name, not imported
    'pagefind', // CLI tool invoked via `npx pagefind` in scripts/postbuild.ts
    '@data/generated/*', // build-time generated JSON files, gitignored — not present in CI
  ],
  ignoreBinaries: [
    'eslint-config-prettier-check', // binary from eslint-config-prettier package
  ],
  ignoreExportsUsedInFile: true,
  rules: {
    duplicates: 'off',
  },
  paths: {
    '@components/*': ['src/components/*'],
    '@data/*': ['src/data/*'],
    '@hooks/*': ['src/hooks/*'],
    '@layouts/*': ['src/components/layouts/*'],
    '@lib/*': ['src/lib/*'],
    '@utils/*': ['src/utils/*'],
    '@server/*': ['src/server/*'],
    '@/config': ['src/config.ts'],
    '@ui/*': ['src/components/ui/*'],
  },
};

export default config;
