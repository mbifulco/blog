import { describe, expect, it } from 'vitest';

import { readingMinutes } from './readingTime';

describe('readingMinutes', () => {
  it('rounds prose to whole minutes at 230 words per minute', () => {
    expect(readingMinutes('word '.repeat(690))).toBe(3);
  });

  it('does not count fenced code or JSX tags', () => {
    const code = '```ts\n' + 'const x = 1;\n'.repeat(500) + '```';
    expect(
      readingMinutes(`${'word '.repeat(460)}\n${code}\n<YouTube id="x" />`)
    ).toBe(2);
  });

  it('never reports less than a minute', () => {
    expect(readingMinutes('')).toBe(1);
  });
});
