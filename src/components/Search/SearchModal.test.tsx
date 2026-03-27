import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SearchProvider } from './SearchContext';
import { SearchModal } from './SearchModal';
import type { PagefindResultData } from '@hooks/usePagefind';

// Hoist mock fn references so they're available inside vi.mock factories
const { mockCapture, mockUsePagefind } = vi.hoisted(() => ({
  mockCapture: vi.fn(),
  mockUsePagefind: vi.fn(),
}));

vi.mock('next/router', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('posthog-js', () => ({ default: { capture: mockCapture } }));

vi.mock('@hooks/usePagefind', () => ({
  usePagefind: mockUsePagefind,
}));

const makeResult = (overrides?: Partial<PagefindResultData>): PagefindResultData => ({
  url: '/posts/test',
  meta: { title: 'Test Post' },
  excerpt: 'An excerpt',
  filters: {},
  ...overrides,
});

const defaultHookReturn = () => ({
  results: [] as PagefindResultData[],
  isLoading: false,
  lastCompletedQuery: '',
  search: vi.fn(),
});

const renderModal = () =>
  render(
    <SearchProvider>
      <SearchModal />
    </SearchProvider>
  );

const openModal = () => fireEvent.keyDown(document, { key: 'k', metaKey: true });

beforeEach(() => {
  mockCapture.mockClear();
  mockUsePagefind.mockReturnValue(defaultHookReturn());
  // jsdom doesn't implement scrollIntoView — cmdk calls it on item selection
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

describe('SearchModal', () => {
  it('is not visible on mount', () => {
    renderModal();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens on ⌘K keydown', () => {
    renderModal();
    openModal();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('opens on Ctrl+K keydown', () => {
    renderModal();
    fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  describe('analytics', () => {
    it('captures search_performed when results resolve', () => {
      const { rerender } = renderModal();
      openModal();

      mockUsePagefind.mockReturnValue({
        ...defaultHookReturn(),
        results: [makeResult()],
        lastCompletedQuery: 'test query',
      });

      rerender(
        <SearchProvider>
          <SearchModal />
        </SearchProvider>
      );

      expect(mockCapture).toHaveBeenCalledWith('search_performed', {
        query: 'test query',
        results_count: 1,
      });
    });

    it('does not capture search_performed when lastCompletedQuery is empty', () => {
      const { rerender } = renderModal();
      openModal();

      mockUsePagefind.mockReturnValue({
        ...defaultHookReturn(),
        results: [makeResult()],
        lastCompletedQuery: '',
      });

      rerender(
        <SearchProvider>
          <SearchModal />
        </SearchProvider>
      );

      expect(mockCapture).not.toHaveBeenCalledWith('search_performed', expect.anything());
    });

    it('captures search_result_clicked with correct properties when a result is selected', () => {
      mockUsePagefind.mockReturnValue({
        ...defaultHookReturn(),
        results: [makeResult({ url: '/posts/my-post', meta: { title: 'My Post' } })],
        lastCompletedQuery: 'my post',
      });

      renderModal();
      openModal();

      fireEvent.click(screen.getByText('My Post'));

      expect(mockCapture).toHaveBeenCalledWith('search_result_clicked', {
        query: '',
        url: '/posts/my-post',
        title: 'My Post',
        result_position: 0,
      });
    });

    it('captures search_result_clicked with correct position for non-first results', () => {
      mockUsePagefind.mockReturnValue({
        ...defaultHookReturn(),
        results: [
          makeResult({ url: '/posts/first', meta: { title: 'First Post' } }),
          makeResult({ url: '/posts/second', meta: { title: 'Second Post' } }),
        ],
        lastCompletedQuery: 'post',
      });

      renderModal();
      openModal();

      fireEvent.click(screen.getByText('Second Post'));

      expect(mockCapture).toHaveBeenCalledWith('search_result_clicked',
        expect.objectContaining({ result_position: 1, title: 'Second Post' })
      );
    });
  });
});
