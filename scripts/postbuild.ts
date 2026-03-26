#!/usr/bin/env npx tsx
/**
 * Postbuild orchestrator
 *
 * Runs after `next build`. Generates the Pagefind search index from the
 * pre-rendered HTML files in .next/server/pages/.
 *
 * The --glob flag restricts indexing to posts and newsletters only.
 * The index is written to public/pagefind/ and served as static assets.
 *
 * NOTE: Search is not available in `next dev` — pagefind.js only exists
 * after a production build.
 */
import { execSync } from 'child_process';

async function main() {
  console.log('Generating Pagefind search index...');
  execSync(
    'npx pagefind --site .next/server/pages --glob "{posts,newsletter}/*.html" --output-path public/pagefind',
    { stdio: 'inherit' }
  );
  console.log('Pagefind index written to public/pagefind/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
