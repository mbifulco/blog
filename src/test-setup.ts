// Set up Jest DOM syntax in Vitest
import '@testing-library/jest-dom';

import { resolve } from 'path';
// Load test environment variables
import { config } from 'dotenv';

// Load .env.test file
config({ path: resolve(process.cwd(), '.env.test') });
