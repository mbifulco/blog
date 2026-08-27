import { fireEvent, render, screen } from '@testing-library/react';
import posthog from 'posthog-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('posthog-js', () => ({
  default: { capture: vi.fn() },
}));

// jsdom can't load Google's script; the tests drive the queue directly.
vi.mock('next/script', () => ({
  default: () => null,
}));

/** Registration happens once per module load, so each test gets a fresh one. */
const loadButton = async () => {
  vi.resetModules();

  return (await import('./PreferredSource')).default;
};

const renderButton = async () => {
  const PreferredSource = await loadButton();

  render(<PreferredSource />);
};

const link = () =>
  screen.getByRole('link', {
    name: /make mikebifulco\.com a preferred source/i,
  });

describe('PreferredSource', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete globalThis.PREFERRED_SOURCE;
  });

  it('links to the source preferences deeplink for this site', async () => {
    await renderButton();

    expect(link()).toHaveAttribute(
      'href',
      'https://www.google.com/preferences/source?q=mikebifulco.com'
    );
  });

  it('follows the deeplink while the library has not loaded', async () => {
    await renderButton();

    const notPrevented = fireEvent.click(link());

    expect(notPrevented).toBe(true);
    expect(posthog.capture).toHaveBeenCalledWith('preferred_source_clicked', {
      in_page_flow: false,
    });
  });

  it('opens the in-page flow once the library has loaded', async () => {
    await renderButton();

    const init = vi.fn();
    const addPreferredSource = vi.fn();
    // Stand in for the library draining the queue on load.
    globalThis.PREFERRED_SOURCE?.forEach((callback) =>
      callback({ init, addPreferredSource })
    );

    expect(init).toHaveBeenCalledWith({ theme: 'light' });

    const notPrevented = fireEvent.click(link());

    expect(addPreferredSource).toHaveBeenCalledTimes(1);
    expect(notPrevented).toBe(false); // default prevented, so no navigation
    expect(posthog.capture).toHaveBeenCalledWith('preferred_source_clicked', {
      in_page_flow: true,
    });
  });

  it('queues one callback no matter how many times it mounts', async () => {
    const PreferredSource = await loadButton();

    render(<PreferredSource />).unmount();
    render(<PreferredSource />);

    expect(globalThis.PREFERRED_SOURCE).toHaveLength(1);
  });
});
