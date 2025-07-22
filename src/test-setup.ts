// Set up Jest DOM syntax in Vitest
import '@testing-library/jest-dom';

// Load test environment variables
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.test file
config({ path: resolve(process.cwd(), '.env.test') });
