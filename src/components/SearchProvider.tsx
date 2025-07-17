'use client';

import { createContext, useContext, useState, useCallback } from 'react';

import type { BlogPost } from '@data/content-types';
import { SearchCommand } from '@components/SearchCommand';

type SearchContextType = {
  openSearch: () => void;
  posts: BlogPost[];
  setPosts: (posts: BlogPost[]) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

type SearchProviderProps = {
  children: React.ReactNode;
};

export function SearchProvider({ children }: SearchProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [postsLoaded, setPostsLoaded] = useState(false);

  const openSearch = useCallback(() => {
    if (!postsLoaded) {
      // Load posts on demand when search is first opened
      fetch('/api/search-posts')
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Failed to fetch posts');
        })
        .then(data => {
          setPosts(data.posts);
          setPostsLoaded(true);
        })
        .catch(error => {
          console.error('Failed to load posts for search:', error);
        });
    }
    setIsOpen(true);
  }, [postsLoaded]);

  return (
    <SearchContext.Provider value={{ openSearch, posts, setPosts }}>
      {children}
      <SearchCommand 
        posts={posts} 
        open={isOpen} 
        onOpenChange={setIsOpen}
      />
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}