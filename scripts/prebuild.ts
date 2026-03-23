#!/usr/bin/env npx tsx
/**
 * Prebuild orchestrator
 *
 * Runs generate-top-tags and generate-related-posts in parallel.
 * Both scripts must complete before `next build` starts.
 */
import { spawn } from 'child_process';

function runScript(script: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn('npx', ['tsx', script], { stdio: 'inherit' });
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${script} exited with code ${code}`));
    });
  });
}

async function main() {
  console.log('Running prebuild scripts...');
  await Promise.all([
    runScript('scripts/generate-top-tags.ts'),
    runScript('scripts/generate-related-posts.ts'),
  ]);
  console.log('Prebuild complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
