// Set up Jest DOM syntax in Vitest
import '@testing-library/jest-dom';

import { resolve } from 'path';
// Load test environment variables
import { config } from 'dotenv';

// jsdom does not implement ResizeObserver; provide a no-op stub so that
// components using it (e.g. cmdk) do not throw in the test environment.
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Load .env.test file
config({ path: resolve(process.cwd(), '.env.test') });
