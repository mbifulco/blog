import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SearchProvider, useSearch } from './SearchContext';

describe('SearchContext', () => {
  it('provides initial closed state', () => {
    const { result } = renderHook(() => useSearch(), {
      wrapper: SearchProvider,
    });
    expect(result.current.open).toBe(false);
  });

  it('setOpen updates open state', () => {
    const { result } = renderHook(() => useSearch(), {
      wrapper: SearchProvider,
    });
    act(() => result.current.setOpen(true));
    expect(result.current.open).toBe(true);
    act(() => result.current.setOpen(false));
    expect(result.current.open).toBe(false);
  });
});
