// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useNewsletterModalTrigger } from './useNewsletterModalTrigger';

describe('useNewsletterModalTrigger', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it('does not open when the reader scrolls', () => {
    const { result } = renderHook(() => useNewsletterModalTrigger());

    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      value: 3000,
    });
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 1000,
    });
    act(() => {
      window.scrollY = 1900;
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.isOpen).toBe(false);
  });

  it('opens from the floating button and closes on dismiss', () => {
    const { result } = renderHook(() => useNewsletterModalTrigger());

    act(() => result.current.open('fab'));
    expect(result.current.isOpen).toBe(true);
    expect(result.current.openedBy).toBe('fab');

    act(() => result.current.dismiss());
    expect(result.current.isOpen).toBe(false);
  });
});
