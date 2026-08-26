import { fireEvent, render, screen } from '@testing-library/react';
import posthog from 'posthog-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import PreferredSource from './PreferredSource';

vi.mock('posthog-js', () => ({
  default: { capture: vi.fn() },
}));

// next/script renders nothing useful in jsdom, and loading Google's library is
// exactly what these tests stand in for.
vi.mock('next/script', () => ({
  default: () => null,
}));

type QueueCallback = (api: {
  init: (options: unknown) => void;
  addPreferredSource: () => void;
}) => void;

const getQueue = () =>
  globalThis.PREFERRED_SOURCE as unknown as QueueCallback[] | undefined;

const link = () =>
  screen.getByRole('link', {
    name: /make mikebifulco\.com a preferred source/i,
  });

describe('PreferredSource', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete (globalThis as { PREFERRED_SOURCE?: unknown }).PREFERRED_SOURCE;
  });

  it('links to the source preferences deeplink for this site', () => {
    render(<PreferredSource />);

    expect(link()).toHaveAttribute(
      'href',
      'https://www.google.com/preferences/source?q=mikebifulco.com'
    );
  });

  it('queues an initialization callback for Google’s library', () => {
    render(<PreferredSource />);

    expect(getQueue()).toHaveLength(1);
  });

  it('follows the deeplink while the library has not loaded', () => {
    render(<PreferredSource />);

    const notPrevented = fireEvent.click(link());

    expect(notPrevented).toBe(true);
    expect(posthog.capture).toHaveBeenCalledWith('preferred_source_clicked', {
      in_page_flow: false,
    });
  });

  it('opens the in-page flow once the library has loaded', () => {
    render(<PreferredSource />);

    const init = vi.fn();
    const addPreferredSource = vi.fn();
    // Stand in for the library draining the queue on load.
    getQueue()?.forEach((callback) => callback({ init, addPreferredSource }));

    expect(init).toHaveBeenCalledWith({ theme: 'light' });

    const notPrevented = fireEvent.click(link());

    expect(addPreferredSource).toHaveBeenCalledTimes(1);
    expect(notPrevented).toBe(false); // default prevented, so no navigation
    expect(posthog.capture).toHaveBeenCalledWith('preferred_source_clicked', {
      in_page_flow: true,
    });
  });
});
