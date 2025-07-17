'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FileText, Hash, Quote, Search as SearchIcon } from 'lucide-react';

import type { BlogPost } from '@data/content-types';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@components/ui/command';
import { createHighlightedURL, searchPosts } from '@utils/search';
import type { SearchResult } from '@utils/search';

type SearchCommandProps = {
  posts: BlogPost[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const getMatchIcon = (matchType: SearchResult['matchType']) => {
  switch (matchType) {
    case 'title':
      return <FileText className="h-4 w-4" />;
    case 'tags':
      return <Hash className="h-4 w-4" />;
    case 'excerpt':
      return <Quote className="h-4 w-4" />;
    case 'content':
      return <SearchIcon className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const getMatchTypeLabel = (matchType: SearchResult['matchType']) => {
  switch (matchType) {
    case 'title':
      return 'Title';
    case 'tags':
      return 'Tags';
    case 'excerpt':
      return 'Excerpt';
    case 'content':
      return 'Content';
    default:
      return 'Post';
  }
};

export function SearchCommand({ posts, open, onOpenChange }: SearchCommandProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchResults = searchPosts(posts, query);
    setResults(searchResults.slice(0, 10)); // Limit to 10 results
  }, [query, posts]);

  const handleSelect = (result: SearchResult) => {
    const url = createHighlightedURL(result.post.frontmatter.slug, query);
    router.push(url);
    onOpenChange(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onOpenChange(false);
      setQuery('');
    }
  };

  // Close on click outside
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false);
      setQuery('');
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
    >
      <div className="fixed left-[50%] top-[20%] max-h-[60vh] w-full max-w-[550px] translate-x-[-50%] rounded-lg border bg-white shadow-xl">
        <Command>
          <CommandInput
            placeholder="Search articles..."
            value={query}
            onValueChange={setQuery}
            className="h-12"
          />
          <CommandList>
            <CommandEmpty>No articles found.</CommandEmpty>
            {results.length > 0 && (
              <CommandGroup heading="Articles">
                {results.map((result, index) => (
                  <CommandItem
                    key={`${result.post.frontmatter.slug}-${index}`}
                    onSelect={() => handleSelect(result)}
                    className="cursor-pointer space-y-1 p-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-gray-500">
                        {getMatchIcon(result.matchType)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-gray-900 line-clamp-1">
                            {result.post.frontmatter.title}
                          </div>
                          <div className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                            {getMatchTypeLabel(result.matchType)}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 line-clamp-2">
                          {result.snippet}
                        </div>
                        {result.post.frontmatter.tags && (
                          <div className="flex flex-wrap gap-1">
                            {result.post.frontmatter.tags.slice(0, 3).map(tag => (
                              <span
                                key={tag}
                                className="text-xs text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                            {result.post.frontmatter.tags.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{result.post.frontmatter.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </div>
    </div>
  );
}