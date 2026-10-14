#!/usr/bin/env npx tsx
/**
 * Postbuild orchestrator
 *
 * Runs after `next build`. Generates the Pagefind search index from the
 * pre-rendered post and newsletter HTML.
 *
 * Where that HTML lives depends on how the build ran:
 * - plain `next build`: .next/server/pages/<section>/<slug>.html
 * - on Vercel, where Next.js loads Vercel's build adapter (NEXT_ADAPTER_PATH):
 *   .next/output/functions/<section>/<slug>.prerender-fallback.html
 *
 * Either way, the pages are staged as <section>/<slug>.html so Pagefind
 * derives the same URLs (usePagefind strips the .html suffix).
 *
 * The index is written to public/pagefind/. When the adapter has already
 * assembled its deploy output, public/ has been copied into
 * .next/output/static/ by then, so the index is copied there as well.
 *
 * NOTE: Search is not available in `next dev` — pagefind.js only exists
 * after a production build.
 */
import { execSync } from 'child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'fs';
import path from 'path';

const SECTIONS = ['posts', 'newsletter'];
const HTML_SOURCES = [
  { dir: '.next/server/pages', suffix: '.html' },
  { dir: '.next/output/functions', suffix: '.prerender-fallback.html' },
];
const STAGING_DIR = '.next/pagefind-site';
const OUTPUT_DIR = 'public/pagefind';
const ADAPTER_STATIC_DIR = '.next/output/static';

function stageHtml(): number {
  rmSync(STAGING_DIR, { recursive: true, force: true });

  for (const { dir, suffix } of HTML_SOURCES) {
    let staged = 0;
    for (const section of SECTIONS) {
      const sectionDir = path.join(dir, section);
      if (!existsSync(sectionDir)) continue;

      for (const entry of readdirSync(sectionDir, { withFileTypes: true })) {
        if (!entry.isFile() || !entry.name.endsWith(suffix)) continue;
        const slug = entry.name.slice(0, -suffix.length);
        mkdirSync(path.join(STAGING_DIR, section), { recursive: true });
        cpSync(
          path.join(sectionDir, entry.name),
          path.join(STAGING_DIR, section, `${slug}.html`)
        );
        staged++;
      }
    }
    if (staged > 0) {
      console.log(`Staged ${staged} pages from ${dir}`);
      return staged;
    }
  }
  return 0;
}

async function main() {
  console.log('Generating Pagefind search index...');

  if (stageHtml() === 0) {
    throw new Error(
      `No pre-rendered post or newsletter HTML found in ${HTML_SOURCES.map((s) => s.dir).join(' or ')}`
    );
  }

  execSync(`npx pagefind --site ${STAGING_DIR} --output-path ${OUTPUT_DIR}`, {
    stdio: 'inherit',
  });
  console.log(`Pagefind index written to ${OUTPUT_DIR}/`);

  if (existsSync(ADAPTER_STATIC_DIR)) {
    cpSync(OUTPUT_DIR, path.join(ADAPTER_STATIC_DIR, 'pagefind'), {
      recursive: true,
    });
    console.log(`Pagefind index copied to ${ADAPTER_STATIC_DIR}/pagefind/`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
