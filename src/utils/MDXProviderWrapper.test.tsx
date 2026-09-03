import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { customComponents } from './MDXProviderWrapper';

vi.mock('posthog-js', () => ({
  default: { capture: vi.fn() },
}));

const Pre = customComponents.pre as React.FC<{ children?: React.ReactNode }>;

/** Mirrors what MDX hands `pre`: a `code` element with a trailing newline. */
const renderBlock = (source: string, language = 'ts') =>
  render(
    <Pre>
      <code className={`language-${language}`}>{source}</code>
    </Pre>
  );

describe('Pre', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  it('renders every line of the block, including the last', () => {
    const { container } = renderBlock(
      'const a = 1;\nconst b = 2;\nconst c = 3;\n'
    );
    const rendered = container.querySelector('pre')!.textContent!;

    // The renderer drops the final token line to swallow MDX's trailing
    // newline. If the source it highlights is ever pre-trimmed to match the
    // clipboard copy, that last line is a real one and silently disappears.
    expect(rendered).toContain('const a = 1;');
    expect(rendered).toContain('const b = 2;');
    expect(rendered).toContain('const c = 3;');
  });

  it('copies the source without the trailing newline', async () => {
    renderBlock('const a = 1;\nconst b = 2;\n');
    fireEvent.click(screen.getByRole('button', { name: /copy code/i }));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'const a = 1;\nconst b = 2;'
      );
    });
  });

  it('still copies a block with no trailing newline intact', async () => {
    renderBlock('const a = 1;');
    fireEvent.click(screen.getByRole('button', { name: /copy code/i }));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'const a = 1;'
      );
    });
  });

  it('renders nothing when the child is not an element', () => {
    const { container } = render(<Pre>plain text</Pre>);

    expect(container).toBeEmptyDOMElement();
  });
});
