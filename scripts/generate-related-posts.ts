#!/usr/bin/env npx tsx
/**
 * Pre-build script to generate related posts data
 *
 * Reads all posts and newsletters once, scores related content for each slug,
 * and writes a JSON map used by getStaticProps at build time.
 * This replaces O(N²) corpus reads with a single corpus read + in-memory scoring.
 *
 * Usage: npx tsx scripts/generate-related-posts.ts
 *
 * NOTE: Uses loadContentFromDirectory (frontmatter-only, no MDX compilation)
 * instead of getAllPosts/getAllNewsletters to avoid @mdx-js/mdx pulling in
 * estree-walker which lacks an "exports" main in its package.json under Node 24.
 */

import * as fs from 'fs';
import * as path from 'path';

import { findRelatedContent } from '../src/lib/related-posts';
import { loadContentFromDirectory } from '../src/lib/tags/loadContentFromDirectory';

const OUTPUT_DIR = path.join(process.cwd(), 'src/data/generated');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'relatedPosts.json');
const LIMIT = 3;

async function main() {
  console.log('Generating related posts data...');

  const postsDir = path.join(process.cwd(), 'src', 'data', 'posts');
  const newslettersDir = path.join(
    process.cwd(),
    'src',
    'data',
    'newsletters'
  );

  const [posts, newsletters] = await Promise.all([
    loadContentFromDirectory(postsDir, 'post'),
    loadContentFromDirectory(newslettersDir, 'newsletter'),
  ]);

  console.log(`Loaded ${posts.length} posts, ${newsletters.length} newsletters`);

  const relatedContent: Record<string, ReturnType<typeof findRelatedContent>> =
    {};

  for (const post of posts) {
    relatedContent[post.slug] = findRelatedContent(
      post.slug,
      post.frontmatter.tags ?? [],
      posts as Parameters<typeof findRelatedContent>[2],
      newsletters as Parameters<typeof findRelatedContent>[3],
      LIMIT
    );
  }

  for (const newsletter of newsletters) {
    relatedContent[newsletter.slug] = findRelatedContent(
      newsletter.slug,
      newsletter.frontmatter.tags ?? [],
      posts as Parameters<typeof findRelatedContent>[2],
      newsletters as Parameters<typeof findRelatedContent>[3],
      LIMIT
    );
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        relatedContent,
      },
      null,
      2
    )
  );

  const totalEntries = Object.keys(relatedContent).length;
  console.log(`Generated ${OUTPUT_FILE} with ${totalEntries} entries`);
}

main().catch((error) => {
  console.error('Failed to generate related posts:', error);
  process.exit(1);
});
