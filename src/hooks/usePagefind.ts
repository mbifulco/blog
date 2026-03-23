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

type PagefindAPI = {
  search: (query: string) => Promise<{ results: PagefindResult[] }>;
};

type UsePagefindReturn = {
  results: PagefindResultData[];
  isLoading: boolean;
  search: (query: string) => Promise<void>;
};

export function usePagefind(): UsePagefindReturn {
  const pagefindRef = useRef<PagefindAPI | null>(null);
  const [results, setResults] = useState<PagefindResultData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // /pagefind/pagefind.js is only available after `next build` + postbuild.
    // In `next dev` / test env, the import fails silently — search is non-functional.
    // Use a runtime-computed path so bundlers/Vite don't attempt static analysis.
    const pagefindUrl = '/pagefind/pagefind.js';
    import(/* @vite-ignore */ /* webpackIgnore: true */ pagefindUrl)
      .then((pf: unknown) => {
        pagefindRef.current = pf as PagefindAPI;
      })
      .catch(() => undefined);
  }, []);

  const search = useCallback(async (query: string) => {
    if (!pagefindRef.current || !query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const { results: stubs } = await pagefindRef.current.search(query);
      const data = await Promise.all(stubs.map((r) => r.data()));
      setResults(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { results, isLoading, search };
}
