import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

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
} from '@components/ui/dialog';
import { usePagefind } from '@hooks/usePagefind';
import { useSearch } from './SearchContext';

export function SearchModal() {
  const { open, setOpen } = useSearch();
  const { results, search } = usePagefind();
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Register ⌘K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setOpen]);

  const handleInput = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => void search(value), 150);
  };

  const handleSelect = (url: string) => {
    setOpen(false);
    void router.push(url);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden p-0" aria-describedby={undefined}>
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
