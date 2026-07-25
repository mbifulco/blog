import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CopyAsMarkdown } from './CopyAsMarkdown';

vi.mock('posthog-js', () => ({
  default: { capture: vi.fn() },
}));

const markdownPath = '/posts/all-about-ch.md';

const mockFetch = () => globalThis.fetch as ReturnType<typeof vi.fn>;

describe('CopyAsMarkdown', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  it('renders a copy button', () => {
    render(<CopyAsMarkdown markdownPath={markdownPath} />);

    expect(
      screen.getByRole('button', { name: /copy as markdown/i })
    ).toBeInTheDocument();
  });

  it('fetches the markdown and writes it to the clipboard', async () => {
    mockFetch().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('---\ntitle: x\n---\n\n# x\n'),
    });

    render(<CopyAsMarkdown markdownPath={markdownPath} />);
    fireEvent.click(screen.getByRole('button', { name: /copy as markdown/i }));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        '---\ntitle: x\n---\n\n# x\n'
      );
    });

    expect(globalThis.fetch).toHaveBeenCalledWith(markdownPath);
    await waitFor(() => {
      expect(screen.getByText(/copied/i)).toBeInTheDocument();
    });
  });

  it('shows a failure state when the fetch rejects', async () => {
    mockFetch().mockRejectedValue(new Error('offline'));

    render(<CopyAsMarkdown markdownPath={markdownPath} />);
    fireEvent.click(screen.getByRole('button', { name: /copy as markdown/i }));

    await waitFor(() => {
      expect(screen.getByText(/copy failed/i)).toBeInTheDocument();
    });
  });

  it('shows a failure state when the response is not ok', async () => {
    mockFetch().mockResolvedValue({
      ok: false,
      status: 404,
      text: () => Promise.resolve(''),
    });

    render(<CopyAsMarkdown markdownPath={markdownPath} />);
    fireEvent.click(screen.getByRole('button', { name: /copy as markdown/i }));

    await waitFor(() => {
      expect(screen.getByText(/copy failed/i)).toBeInTheDocument();
    });

    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
  });

  it('exposes a menu trigger for the secondary actions', () => {
    render(<CopyAsMarkdown markdownPath={markdownPath} />);

    expect(
      screen.getByRole('button', { name: /more markdown options/i })
    ).toBeInTheDocument();
  });

  it('offers copy-link and open actions in the menu', async () => {
    render(<CopyAsMarkdown markdownPath={markdownPath} />);

    // Radix opens the menu on keydown/pointerdown, not on a synthetic click.
    fireEvent.keyDown(
      screen.getByRole('button', { name: /more markdown options/i }),
      { key: 'Enter' }
    );

    await waitFor(() => {
      expect(screen.getByText(/copy link to \.md/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/open \.md/i)).toBeInTheDocument();
  });

  it('copies an absolute url resolved against the current origin', async () => {
    render(<CopyAsMarkdown markdownPath={markdownPath} />);

    fireEvent.keyDown(
      screen.getByRole('button', { name: /more markdown options/i }),
      { key: 'Enter' }
    );

    const item = await screen.findByText(/copy link to \.md/i);
    fireEvent.click(item);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        `${window.location.origin}${markdownPath}`
      );
    });
  });

  it('links the open action at the same-origin path', () => {
    render(<CopyAsMarkdown markdownPath={markdownPath} />);

    fireEvent.keyDown(
      screen.getByRole('button', { name: /more markdown options/i }),
      { key: 'Enter' }
    );

    expect(
      screen.getByRole('menuitem', { name: /open \.md/i })
    ).toHaveAttribute('href', markdownPath);
  });
});
