import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CopyCodeButton } from './CopyCodeButton';

vi.mock('posthog-js', () => ({
  default: { capture: vi.fn() },
}));

const RESET_WINDOW_MS = 2000;
const CODE = "const iso = (d: Date) => format(d, 'yyyy-MM-dd');";

describe('CopyCodeButton', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  it('renders a copy button', () => {
    render(<CopyCodeButton code={CODE} language="ts" />);

    expect(
      screen.getByRole('button', { name: /copy code/i })
    ).toBeInTheDocument();
  });

  it('writes the code to the clipboard verbatim', async () => {
    render(<CopyCodeButton code={CODE} language="ts" />);
    fireEvent.click(screen.getByRole('button', { name: /copy code/i }));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(CODE);
    });
    await waitFor(() => {
      expect(screen.getByText(/copied/i)).toBeInTheDocument();
    });
  });

  it('shows a failure state when the clipboard write rejects', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    });

    render(<CopyCodeButton code={CODE} language="ts" />);
    fireEvent.click(screen.getByRole('button', { name: /copy code/i }));

    await waitFor(() => {
      expect(screen.getByText(/copy failed/i)).toBeInTheDocument();
    });
  });

  it('keeps a stable accessible name while the visible label changes', async () => {
    render(<CopyCodeButton code={CODE} language="ts" />);
    const button = screen.getByRole('button', { name: 'Copy code' });

    fireEvent.click(button);

    await waitFor(() => expect(button.textContent).toMatch(/copied/i));
    expect(screen.getByRole('button', { name: 'Copy code' })).toBe(button);
  });

  it('gives a second copy a full reset window instead of the first timer cutting it short', async () => {
    vi.useFakeTimers();

    try {
      render(<CopyCodeButton code={CODE} language="ts" />);
      const button = screen.getByRole('button', { name: 'Copy code' });
      const label = () => button.textContent;

      fireEvent.click(button);
      await act(async () => {});
      expect(label()).toMatch(/copied/i);

      // Click again just before the first reset would fire.
      await act(async () => {
        vi.advanceTimersByTime(1900);
      });
      fireEvent.click(button);
      await act(async () => {});
      expect(label()).toMatch(/copied/i);

      // The first click's deadline passes here: if its timer wasn't cleared,
      // the label snaps back 100ms after the second click.
      await act(async () => {
        vi.advanceTimersByTime(200);
      });
      expect(label()).toMatch(/copied/i);

      await act(async () => {
        vi.advanceTimersByTime(RESET_WINDOW_MS);
      });
      expect(label()).toMatch(/copy$/i);
    } finally {
      vi.useRealTimers();
    }
  });
});
