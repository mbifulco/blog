import { useState, useCallback } from 'react';
import type { ContentTypes } from '@data/content-types';

export type SearchResult = {
  title: string;
  slug: string;
  type: typeof ContentTypes[keyof typeof ContentTypes];
  score: number;
  excerpt: string;
};

type SearchOptions = {
  type?: typeof ContentTypes[keyof typeof ContentTypes];
  limit?: number;
  minScore?: number;
};

export const useSearch = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string, options: SearchOptions = {}) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        q: query,
        ...(options.type && { type: options.type }),
        ...(options.limit && { limit: options.limit.toString() }),
        ...(options.minScore && { minScore: options.minScore.toString() }),
      });

      const response = await fetch(`/api/search?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Search failed');
      }

      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    results,
    isLoading,
    error,
    search,
  };
};
