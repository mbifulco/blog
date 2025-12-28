#!/usr/bin/env npx tsx
/**
 * Pre-build script to generate top tags data
 *
 * This script runs before the build and generates a JSON file
 * with the top tags sorted by content count. This allows the
 * footer to display dynamically-ordered tags without runtime
 * async calls.
 *
 * Usage: npx tsx scripts/generate-top-tags.ts
 */

import * as fs from 'fs';
import * as path from 'path';

import { getTopTags } from '../src/lib/tags';

const OUTPUT_DIR = path.join(process.cwd(), 'src/data/generated');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'topTags.json');

async function main() {
  console.log('Generating top tags data...');

  // Get top 15 tags (a few extra in case some are filtered out)
  const topTags = await getTopTags(15);

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Write the data
  fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        tags: topTags,
      },
      null,
      2
    )
  );

  console.log(`Generated ${OUTPUT_FILE}`);
  console.log(`Top tags: ${topTags.map((t) => `${t.tag} (${t.count})`).join(', ')}`);
}

main().catch((error) => {
  console.error('Failed to generate top tags:', error);
  process.exit(1);
});
