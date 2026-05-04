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
    // Skip in dev/test — search is non-functional there and the missing file
    // causes Turbopack to surface a TypeError in the error overlay.
    if (process.env.NODE_ENV !== 'production') return;

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
    // Increment the global counter and capture the value for this invocation.
    // Every call — including empty/clear calls — bumps the counter so that any
    // previously in-flight request becomes "stale" and will bail out when it
    // checks its own requestId below.
    const requestId = ++requestIdRef.current;

    if (!pagefindRef.current || !query.trim()) {
      setResults([]);
      setLastCompletedQuery('');
      return;
    }
    setIsLoading(true);
    try {
      const { results: stubs } = await pagefindRef.current.search(query);
      // If a newer search has started since this one was issued, discard results.
      if (requestId !== requestIdRef.current) return;

      console.log('[pagefind] search("' + query + '") → ' + stubs.length + ' results');

      // Each stub is a lightweight reference; calling .data() fetches the full result.
      const data = await Promise.all(stubs.map((r) => r.data()));
      // Check again after the second async gap — another search may have fired.
      if (requestId !== requestIdRef.current) return;

      // Pagefind derives URLs from .html filenames in .next/server/pages/.
      // Strip the .html suffix so links resolve correctly in Next.js.
      setResults(data.map((d) => ({ ...d, url: d.url.replace(/\.html$/, '') })));
      setLastCompletedQuery(query);
    } finally {
      // Only clear the loading state if no newer request has taken over.
      if (requestId === requestIdRef.current) setIsLoading(false);
    }
  }, []);

  return { results, isLoading, lastCompletedQuery, search };
}
