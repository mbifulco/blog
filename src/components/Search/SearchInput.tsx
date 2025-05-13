import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useSearch } from '@hooks/useSearch';
import { Search, FileText, Mail } from 'lucide-react';
import { cn } from '@utils/cn';
import { Button } from '@components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@components/ui/command';
import { ContentTypes } from '@data/content-types';

export function SearchInput() {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { results, isLoading, search } = useSearch();
  const router = useRouter();
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

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

  useEffect(() => {
    console.log('Search results:', results);
  }, [results]);

  const handleSearch = (value: string) => {
    setInputValue(value);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      search(value, { limit: 5 });
    }, 300);
  };

  const handleSelect = (value: string) => {
    const result = results.find(
      r => `${r.slug}-${r.score.toFixed(4)}` === value
    );
    if (result) {
      setOpen(false);
      setInputValue('');
      const path = result.type === ContentTypes.Newsletter ? '/newsletter' : '/posts';
      router.push(`${path}/${result.slug}`);
    }
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
        <div className="bg-white" title="Search posts and newsletters...">
          <CommandInput
            placeholder="Search posts and newsletters..."
            onValueChange={handleSearch}
            value={inputValue}
          />
          <CommandList>
            {isLoading ? (
              <CommandEmpty>Searching...</CommandEmpty>
            ) : results.length === 0 ? (
              <CommandEmpty>No results found.</CommandEmpty>
            ) : (
              <CommandGroup heading="Results" className="block">
                {results.map((result) => (
                  <CommandItem
                    key={`${result.slug}-${result.score.toFixed(4)}`}
                    value={`${result.slug}-${result.score.toFixed(4)}`}
                    onSelect={handleSelect}
                    className="flex flex-col items-start gap-1 p-3 hover:bg-gray-100 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 w-full">
                      {result.type === ContentTypes.Newsletter ? (
                        <Mail className="h-4 w-4 shrink-0" />
                      ) : (
                        <FileText className="h-4 w-4 shrink-0" />
                      )}
                      <span className="font-medium">{result.title}</span>
                      <span className="ml-auto text-xs text-gray-500">
                        {result.type === ContentTypes.Newsletter ? 'Newsletter' : 'Post'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 pl-6">{result.excerpt}</p>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </div>
      </CommandDialog>
    </>
  );
}
