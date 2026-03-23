import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SearchProvider } from './SearchContext';
import { SearchModal } from './SearchModal';

// Mock next/router
vi.mock('next/router', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

// Mock usePagefind — returns empty results by default
vi.mock('@hooks/usePagefind', () => ({
  usePagefind: () => ({
    results: [],
    isLoading: false,
    search: vi.fn(),
  }),
}));

const renderModal = () =>
  render(
    <SearchProvider>
      <SearchModal />
    </SearchProvider>
  );

describe('SearchModal', () => {
  it('is not visible on mount', () => {
    renderModal();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens on ⌘K keydown', () => {
    renderModal();
    fireEvent.keyDown(document, { key: 'k', metaKey: true });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('opens on Ctrl+K keydown', () => {
    renderModal();
    fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
