#!/usr/bin/env tsx
/**
 * Verifies that the Cloudflare Turnstile keys are configured correctly.
 *
 * It does two things:
 *   1. Reports whether the site key + secret key are set, and whether they are
 *      still Cloudflare's always-pass TEST keys (which provide no real protection).
 *   2. Calls Cloudflare's live siteverify endpoint with your secret and a dummy
 *      token, then interprets the response to tell you whether Cloudflare
 *      recognizes your secret key.
 *
 * Usage:
 *   pnpm tsx scripts/verify-turnstile.ts
 *
 * Reads from .env.local (preferred) then .env, matching Next.js precedence.
 */
import dotenv from 'dotenv';

// .env.local wins over .env (dotenv does not override already-set vars).
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const TEST_SITE_KEYS = new Set([
  '1x00000000000000000000AA', // always passes, visible
  '1x00000000000000000000BB', // always passes, invisible
  '2x00000000000000000000AB', // always blocks, visible
  '3x00000000000000000000FF', // forces an interactive challenge
]);
const TEST_SECRET_KEYS = new Set([
  '1x0000000000000000000000000000000AA', // always passes
  '2x0000000000000000000000000000000AA', // always fails
  '3x0000000000000000000000000000000AA', // always "token already spent"
]);

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const secretKey = process.env.TURNSTILE_SECRET_KEY;

const ok = (m: string) => console.log(`\x1b[32m✓\x1b[0m ${m}`);
const warn = (m: string) => console.log(`\x1b[33m!\x1b[0m ${m}`);
const fail = (m: string) => console.log(`\x1b[31m✗\x1b[0m ${m}`);

async function main() {
  console.log('\n— Cloudflare Turnstile key check —\n');

  // 1. Site key
  if (!siteKey) {
    fail('NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set.');
  } else if (TEST_SITE_KEYS.has(siteKey)) {
    warn(
      'NEXT_PUBLIC_TURNSTILE_SITE_KEY is the always-pass TEST site key — fine for local dev, but provides no protection in production.'
    );
  } else {
    ok(`NEXT_PUBLIC_TURNSTILE_SITE_KEY is set (${siteKey.slice(0, 8)}…).`);
  }

  // 2. Secret key presence
  if (!secretKey) {
    fail('TURNSTILE_SECRET_KEY is not set. Cannot verify against Cloudflare.');
    process.exit(1);
  }
  if (TEST_SECRET_KEYS.has(secretKey)) {
    warn(
      'TURNSTILE_SECRET_KEY is a Cloudflare TEST secret — fine for local dev/CI, but provides no protection in production.'
    );
  } else {
    ok(`TURNSTILE_SECRET_KEY is set (${secretKey.slice(0, 6)}…).`);
  }

  // 3. Live check against siteverify with a deliberately invalid token.
  console.log('\nCalling Cloudflare siteverify with a dummy token…\n');
  const body = new URLSearchParams({
    secret: secretKey,
    response: 'dummy-invalid-token',
  });
  const res = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    { method: 'POST', body }
  );
  const data = (await res.json()) as {
    success: boolean;
    'error-codes'?: string[];
  };
  const errorCodes = data['error-codes'] ?? [];

  if (data.success) {
    // Only the always-pass test secret returns success for a bogus token.
    warn(
      'siteverify returned success for a DUMMY token — you are using the always-pass test secret. Real bot protection is OFF.'
    );
  } else if (errorCodes.includes('invalid-input-secret')) {
    fail(
      'Cloudflare rejected the SECRET KEY itself (invalid-input-secret). The TURNSTILE_SECRET_KEY value is wrong — re-copy it from the Cloudflare dashboard.'
    );
    process.exit(1);
  } else if (errorCodes.includes('invalid-input-response')) {
    ok(
      'Cloudflare recognized your secret key and (correctly) rejected the dummy token. Your TURNSTILE_SECRET_KEY is valid. ✅'
    );
  } else {
    warn(
      `Unexpected siteverify response. error-codes: ${JSON.stringify(errorCodes)}`
    );
  }

  console.log('');
}

main().catch((err) => {
  fail(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
