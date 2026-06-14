import { describe, expect, it } from 'vitest';

import { isRequestOriginAllowed } from './origin';

describe('isRequestOriginAllowed', () => {
  it('allows requests with a missing (null) origin', () => {
    // Some legitimate clients omit the Origin header; never block them.
    expect(isRequestOriginAllowed(null, 'mikebifulco.com')).toBe(true);
  });

  it('allows requests with an empty origin', () => {
    expect(isRequestOriginAllowed('', 'mikebifulco.com')).toBe(true);
  });

  it('allows same-hostname origin and host', () => {
    expect(
      isRequestOriginAllowed('https://mikebifulco.com', 'mikebifulco.com')
    ).toBe(true);
  });

  it('allows a Vercel preview URL where origin host matches the host header', () => {
    expect(
      isRequestOriginAllowed(
        'https://blog-git-feat-x.vercel.app',
        'blog-git-feat-x.vercel.app'
      )
    ).toBe(true);
  });

  it('allows localhost with a port (port difference on same hostname matches)', () => {
    expect(
      isRequestOriginAllowed('http://localhost:3000', 'localhost:3000')
    ).toBe(true);
  });

  it('allows localhost where host has a port but origin does not', () => {
    expect(isRequestOriginAllowed('http://localhost', 'localhost:3000')).toBe(
      true
    );
  });

  it('blocks a different hostname', () => {
    expect(isRequestOriginAllowed('https://evil.com', 'mikebifulco.com')).toBe(
      false
    );
  });

  it('blocks when origin parses but host is null (cannot confirm same-origin)', () => {
    expect(isRequestOriginAllowed('https://evil.com', null)).toBe(false);
  });

  it('blocks a malformed origin (lenient parsing still cannot confirm match)', () => {
    // A present-but-unparseable origin is treated as not matching → blocked.
    expect(isRequestOriginAllowed('not a url', 'mikebifulco.com')).toBe(false);
  });
});
