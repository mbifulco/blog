import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    // Include only unit test files, exclude e2e/Playwright tests
    include: ['src/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['e2e/**/*', 'node_modules/**/*'],
  },
});
