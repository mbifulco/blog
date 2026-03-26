import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SearchPage from '../../pages/search';

// nuqs requires the NuqsAdapter — use the test adapter in unit tests
vi.mock('nuqs', () => ({
  useQueryState: vi.fn().mockReturnValue(['', vi.fn()]),
}));

vi.mock('@hooks/usePagefind', () => ({
  usePagefind: () => ({
    results: [],
    isLoading: false,
    search: vi.fn(),
  }),
}));

vi.mock('@components/seo', () => ({
  default: () => null,
}));

describe('SearchPage', () => {
  it('renders a search input', () => {
    render(<SearchPage />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('shows no results message when query is set but results are empty', async () => {
    const { useQueryState } = vi.mocked(await import('nuqs'));
    (useQueryState as ReturnType<typeof vi.fn>).mockReturnValue(['react', vi.fn()]);

    render(<SearchPage />);
    expect(screen.getByText(/no results for "react"/i)).toBeInTheDocument();
  });
});
