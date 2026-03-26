import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePagefind } from './usePagefind';

describe('usePagefind', () => {
  it('returns empty results and isLoading=false on init', () => {
    const { result } = renderHook(() => usePagefind());
    expect(result.current.results).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('search() does not throw when pagefind is unavailable', async () => {
    const { result } = renderHook(() => usePagefind());
    await act(async () => {
      await result.current.search('react hooks');
    });
    // pagefind.js missing in test env — results stay empty, no throw
    expect(result.current.results).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });
});
