import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import posthog from 'posthog-js';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@components/ui/dialog';
import { usePagefind } from '@hooks/usePagefind';
import { useSearch } from './SearchContext';

export function SearchModal() {
  const { open, setOpen } = useSearch();
  const { results, lastCompletedQuery, search } = usePagefind();
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentQueryRef = useRef('');

  // Register ⌘K / Ctrl+K keyboard shortcut — toggles open/closed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setOpen]);

  // Clear pending debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Reset results when modal closes so stale results don't show on reopen
  useEffect(() => {
    if (!open) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      currentQueryRef.current = '';
      void search('');
    }
  }, [open, search]);

  // Track search after results resolve — lastCompletedQuery comes from the hook
  // so it's always the query that produced the current results (no race condition).
  useEffect(() => {
    if (!lastCompletedQuery.trim()) return;
    posthog.capture('search_performed', {
      query: lastCompletedQuery,
      results_count: results.length,
    });
  }, [results, lastCompletedQuery]);

  const handleInput = (value: string) => {
    currentQueryRef.current = value;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => void search(value), 150);
  };

  const handleSelect = (url: string) => {
    const query = currentQueryRef.current;
    const index = results.findIndex((r) => r.url === url);
    const result = index >= 0 ? results[index] : null;
    posthog.capture('search_result_clicked', {
      query,
      url,
      title: result?.meta.title ?? null,
      result_position: result ? index : null,
    });
    setOpen(false);
    void router.push(url);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden p-0" aria-describedby={undefined}>
        {/* Visually hidden title gives screen readers an accessible dialog name */}
        <DialogTitle className="sr-only">Search</DialogTitle>
        {/* shouldFilter=false — pagefind handles all filtering */}
        <Command shouldFilter={false} className="[&_[cmdk-input-wrapper]]:border-b [&_[cmdk-input]]:h-12">
          <CommandInput
            placeholder="Search posts and newsletters…"
            onValueChange={handleInput}
          />
          <CommandList className="max-h-[400px]">
            <CommandEmpty>No results found.</CommandEmpty>
            {results.length > 0 && (
              <CommandGroup heading="Results">
                {results.map((result) => (
                  <CommandItem
                    key={result.url}
                    value={result.url}
                    onSelect={() => handleSelect(result.url)}
                    className="flex flex-col items-start gap-1 py-3"
                  >
                    <span className="font-medium">{result.meta.title}</span>
                    {/* excerpt contains <mark> HTML from pagefind highlighting */}
                    <span
                      className="line-clamp-2 text-sm text-gray-500"
                      dangerouslySetInnerHTML={{ __html: result.excerpt }}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
