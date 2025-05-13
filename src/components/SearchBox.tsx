import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useSearch } from '@/hooks/useSearch';
import { Command } from 'cmdk';
import { Search, FileText, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { ContentTypes } from '@/data/content-types';

export function SearchBox() {
  const [open, setOpen] = useState(false);
  const { results, isLoading, search } = useSearch();
  const router = useRouter();
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSearch = (value: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      search(value, { limit: 5 });
    }, 300);
  };

  const handleSelect = (result: typeof results[0]) => {
    setOpen(false);
    const path = result.type === ContentTypes.Newsletter ? '/newsletters' : '/posts';
    router.push(`${path}/${result.slug}`);
  };

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          'relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2',
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
        )}
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">Search...</span>
        <span className="sr-only">Search</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search posts and newsletters..."
          onValueChange={handleSearch}
        />
        <CommandList>
          <CommandEmpty>
            {isLoading ? 'Searching...' : 'No results found.'}
          </CommandEmpty>
          {results.length > 0 && (
            <CommandGroup heading="Results">
              {results.map((result) => (
                <CommandItem
                  key={result.slug}
                  onSelect={() => handleSelect(result)}
                  className="flex items-center gap-2"
                >
                  {result.type === ContentTypes.Newsletter ? (
                    <Mail className="h-4 w-4" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                  <div className="flex flex-col">
                    <span>{result.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {result.excerpt}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
