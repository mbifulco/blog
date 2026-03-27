import { useState, useEffect, useRef, useCallback } from 'react';

type PagefindResult = {
  id: string;
  data: () => Promise<PagefindResultData>;
};

export type PagefindResultData = {
  url: string;
  meta: { title: string; image?: string };
  excerpt: string;
  filters: { type?: string[] };
};

// Minimal subset of the Pagefind API — pagefind ships no TS types.
// Extend here if additional methods (e.g. filters, debouncedSearch) are needed.
type PagefindAPI = {
  search: (query: string) => Promise<{ results: PagefindResult[] }>;
};

type UsePagefindReturn = {
  results: PagefindResultData[];
  isLoading: boolean;
  lastCompletedQuery: string;
  search: (query: string) => Promise<void>;
};

export function usePagefind(): UsePagefindReturn {
  const pagefindRef = useRef<PagefindAPI | null>(null);
  const [results, setResults] = useState<PagefindResultData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastCompletedQuery, setLastCompletedQuery] = useState('');
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // /pagefind/pagefind.js is only available after `next build` + postbuild.
    // In `next dev` / test env, the import will fail — search is non-functional.
    // Use a runtime-computed path so bundlers/Vite don't attempt static analysis.
    const pagefindUrl = '/pagefind/pagefind.js';
    import(/* @vite-ignore */ /* webpackIgnore: true */ pagefindUrl)
      .then((pf: unknown) => {
        console.log('[pagefind] loaded successfully');
        pagefindRef.current = pf as PagefindAPI;
      })
      .catch((err: unknown) => {
        console.error('[pagefind] failed to load:', err);
      });
  }, []);

  const search = useCallback(async (query: string) => {
    if (!pagefindRef.current || !query.trim()) {
      setResults([]);
      setLastCompletedQuery('');
      return;
    }

    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    try {
      const { results: stubs } = await pagefindRef.current.search(query);
      if (requestId !== requestIdRef.current) return;

      console.log('[pagefind] search("' + query + '") → ' + stubs.length + ' results');

      const data = await Promise.all(stubs.map((r) => r.data()));
      if (requestId !== requestIdRef.current) return;

      // Pagefind derives URLs from .html filenames in .next/server/pages/.
      // Strip the .html suffix so links resolve correctly in Next.js.
      setResults(data.map((d) => ({ ...d, url: d.url.replace(/\.html$/, '') })));
      setLastCompletedQuery(query);
    } finally {
      if (requestId === requestIdRef.current) setIsLoading(false);
    }
  }, []);

  return { results, isLoading, lastCompletedQuery, search };
}
