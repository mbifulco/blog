# Pagefind Site Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add full-text site search to mikebifulco.com via a Pagefind post-build index, a ⌘K command-palette modal, and a shareable `/search` page.

**Architecture:** Pagefind indexes pre-rendered HTML from `.next/server/pages/` after `next build`. A `usePagefind` hook loads the JS API client-side; a `SearchContext` shares modal open/close state across the tree; the `SearchModal` and `/search` page both query the same hook.

**Tech Stack:** Pagefind CLI, shadcn `Command` (cmdk), nuqs v2 (URL state), Next.js Pages Router, Vitest + jsdom (tests), TypeScript, TailwindCSS.

---

## File Map

```text
scripts/
  prebuild.ts           NEW  — parallel orchestrator for generate-top-tags + generate-related-posts
  postbuild.ts          NEW  — runs pagefind CLI after next build

src/
  hooks/
    usePagefind.ts      NEW  — loads pagefind JS API client-side, exposes search()
    usePagefind.test.ts NEW  — graceful-degradation + result-loading tests

  components/
    Search/
      SearchContext.tsx         NEW — { open, setOpen } React context + SearchProvider
      SearchContext.test.tsx    NEW — verifies context state updates
      SearchModal.tsx           NEW — Dialog + Command (shouldFilter=false) + pagefind results
      SearchModal.test.tsx      NEW — keyboard shortcut, render, selection tests
    Post/
      FullPost.tsx              MODIFY — add data-pagefind-* attributes
    Navbar/
      Navbar.tsx                MODIFY — add Search icon button (desktop + mobile)

  pages/
    search.tsx                  NEW — /search page, client-rendered, nuqs URL state
    search.test.tsx             NEW — URL param → search() call test
    _app.tsx                    MODIFY — NuqsAdapter, SearchProvider, SearchModal

.gitignore                      MODIFY — add public/pagefind/
package.json                    MODIFY — install deps, update prebuild/postbuild scripts
```

---

## Task 1: Install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install pagefind, nuqs, and the shadcn command component**

```bash
cd /Users/mike/src/blog
pnpm add nuqs
pnpm add -D pagefind
npx shadcn@latest add command
```

- [ ] **Step 2: Verify shadcn command component was created**

```bash
ls src/components/ui/command.tsx
```

Expected: file exists.

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml src/components/ui/command.tsx
git commit -m "chore: install pagefind, nuqs, and shadcn command component"
```

---

## Task 2: Build pipeline — prebuild orchestrator

Replaces the inline `prebuild` shell command in `package.json` with a TypeScript orchestrator that runs both scripts in parallel.

**Files:**
- Create: `scripts/prebuild.ts`
- Modify: `package.json`

- [ ] **Step 1: Create `scripts/prebuild.ts`**

```ts
#!/usr/bin/env npx tsx
/**
 * Prebuild orchestrator
 *
 * Runs generate-top-tags and generate-related-posts in parallel.
 * Both scripts must complete before `next build` starts.
 */
import { spawn } from 'child_process';

function runScript(script: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn('npx', ['tsx', script], { stdio: 'inherit' });
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${script} exited with code ${code}`));
    });
  });
}

async function main() {
  console.log('Running prebuild scripts...');
  await Promise.all([
    runScript('scripts/generate-top-tags.ts'),
    runScript('scripts/generate-related-posts.ts'),
  ]);
  console.log('Prebuild complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: Update `package.json` — replace `prebuild` and remove old inline command**

Change:
```json
"prebuild": "npx tsx scripts/generate-top-tags.ts && npx tsx scripts/generate-related-posts.ts",
```
To:
```json
"prebuild": "npx tsx scripts/prebuild.ts",
```

- [ ] **Step 3: Verify it runs correctly**

```bash
pnpm run prebuild
```

Expected: both `generate-top-tags.ts` and `generate-related-posts.ts` output appears in the terminal (possibly interleaved), exits with code 0.

- [ ] **Step 4: Commit**

```bash
git add scripts/prebuild.ts package.json
git commit -m "chore: add prebuild orchestrator script"
```

---

## Task 3: Build pipeline — postbuild orchestrator + .gitignore

**Files:**
- Create: `scripts/postbuild.ts`
- Modify: `package.json`
- Modify: `.gitignore`

- [ ] **Step 1: Create `scripts/postbuild.ts`**

```ts
#!/usr/bin/env npx tsx
/**
 * Postbuild orchestrator
 *
 * Runs after `next build`. Generates the Pagefind search index from the
 * pre-rendered HTML files in .next/server/pages/.
 *
 * The --glob flag restricts indexing to posts and newsletters only.
 * The index is written to public/pagefind/ and served as static assets.
 *
 * NOTE: Search is not available in `next dev` — pagefind.js only exists
 * after a production build.
 */
import { execSync } from 'child_process';

async function main() {
  console.log('Generating Pagefind search index...');
  execSync(
    'npx pagefind --site .next/server/pages --glob "{posts,newsletter}/*.html" --output-path public/pagefind',
    { stdio: 'inherit' }
  );
  console.log('Pagefind index written to public/pagefind/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: Add `postbuild` script to `package.json`**

Add after the `"build"` line:
```json
"postbuild": "npx tsx scripts/postbuild.ts",
```

- [ ] **Step 3: Add `public/pagefind/` to `.gitignore`**

Append to `.gitignore`:
```
# Pagefind search index (generated by postbuild)
public/pagefind/
```

- [ ] **Step 4: Commit**

```bash
git add scripts/postbuild.ts package.json .gitignore
git commit -m "chore: add postbuild pagefind indexing script"
```

---

## Task 4: Indexing — add data-pagefind attributes to FullPost

`FullPost.tsx` is shared by both posts and newsletters. Three attributes are needed:
- `data-pagefind-body` on the **inner** `<article>` (line 138) — scopes indexed content to prose only
- `data-pagefind-meta="title"` on `<Heading as="h1">` (line 115) — overrides the `"Title | mikebifulco.com"` page title
- `data-pagefind-filter` on the **outer** `<article>` (line 110) — enables type filtering

`Heading` uses `{...props}` spread, so `data-pagefind-meta` forwards correctly to the `<h1>` DOM element.

**Files:**
- Modify: `src/components/Post/FullPost.tsx`

- [ ] **Step 1: Add `data-pagefind-filter` to outer `<article>` (line 110)**

Change:
```tsx
<article>
```
To:
```tsx
<article data-pagefind-filter={`type:${contentType}`}>
```

- [ ] **Step 2: Add `data-pagefind-meta="title"` to `<Heading as="h1">` (line 115)**

Change:
```tsx
<Heading as="h1" className="m-0 mt-2 p-0">
```
To:
```tsx
<Heading as="h1" className="m-0 mt-2 p-0" data-pagefind-meta="title">
```

- [ ] **Step 3: Add `data-pagefind-body` to inner `<article>` (line 138)**

Change:
```tsx
<article className="max-w-prose">
```
To:
```tsx
<article className="max-w-prose" data-pagefind-body>
```

- [ ] **Step 4: Verify TypeScript compiles cleanly**

```bash
pnpm typecheck
```

Expected: no errors. (React accepts arbitrary `data-*` attributes on HTML elements.)

- [ ] **Step 5: Commit**

```bash
git add src/components/Post/FullPost.tsx
git commit -m "feat: add pagefind data attributes to FullPost"
```

---

## Task 5: `usePagefind` hook (TDD)

The hook dynamically imports `/pagefind/pagefind.js` on the client. It gracefully returns empty results if the file is missing (dev mode / pre-build). In Vitest/jsdom the dynamic import will reject (no server), so graceful degradation is tested automatically.

**Files:**
- Create: `src/hooks/usePagefind.ts`
- Create: `src/hooks/usePagefind.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/hooks/usePagefind.test.ts`:

```ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePagefind } from './usePagefind';

describe('usePagefind', () => {
  it('returns empty results and isLoading=false on init', () => {
    const { result } = renderHook(() => usePagefind());
    expect(result.current.results).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('search() does not throw when pagefind is unavailable', async () => {
    const { result } = renderHook(() => usePagefind());
    await act(async () => {
      await result.current.search('react hooks');
    });
    // pagefind.js missing in test env — results stay empty, no throw
    expect(result.current.results).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });
});
```

- [ ] **Step 2: Run to confirm failure**

```bash
pnpm test:unit -- --reporter=verbose src/hooks/usePagefind.test.ts
```

Expected: FAIL — `usePagefind` module not found.

- [ ] **Step 3: Create `src/hooks/usePagefind.ts`**

```ts
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
    // In `next dev`, the import fails silently — search is non-functional.
    import(/* @vite-ignore */ '/pagefind/pagefind.js')
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
```

- [ ] **Step 4: Run tests to confirm pass**

```bash
pnpm test:unit -- --reporter=verbose src/hooks/usePagefind.test.ts
```

Expected: 2 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/usePagefind.ts src/hooks/usePagefind.test.ts
git commit -m "feat: add usePagefind hook with graceful degradation"
```

---

## Task 6: `SearchContext` (TDD)

**Files:**
- Create: `src/components/Search/SearchContext.tsx`
- Create: `src/components/Search/SearchContext.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/Search/SearchContext.test.tsx`:

```tsx
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SearchProvider, useSearch } from './SearchContext';

describe('SearchContext', () => {
  it('provides initial closed state', () => {
    const { result } = renderHook(() => useSearch(), {
      wrapper: SearchProvider,
    });
    expect(result.current.open).toBe(false);
  });

  it('setOpen updates open state', () => {
    const { result } = renderHook(() => useSearch(), {
      wrapper: SearchProvider,
    });
    act(() => result.current.setOpen(true));
    expect(result.current.open).toBe(true);
    act(() => result.current.setOpen(false));
    expect(result.current.open).toBe(false);
  });
});
```

- [ ] **Step 2: Run to confirm failure**

```bash
pnpm test:unit -- --reporter=verbose src/components/Search/SearchContext.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/components/Search/SearchContext.tsx`**

```tsx
import { createContext, useContext, useState } from 'react';

type SearchContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const SearchContext = createContext<SearchContextValue>({
  open: false,
  setOpen: () => undefined,
});

export const SearchProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <SearchContext.Provider value={{ open, setOpen }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
```

- [ ] **Step 4: Run tests to confirm pass**

```bash
pnpm test:unit -- --reporter=verbose src/components/Search/SearchContext.test.tsx
```

Expected: 2 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Search/SearchContext.tsx src/components/Search/SearchContext.test.tsx
git commit -m "feat: add SearchContext for modal open/close state"
```

---

## Task 7: `SearchModal` (TDD)

Uses `Dialog` + `Command` (with `shouldFilter={false}`) directly instead of `CommandDialog`, so cmdk's built-in filtering doesn't interfere with Pagefind's results. The `@radix-ui/react-dialog` components are already available via shadcn's `dialog` component.

**Files:**
- Create: `src/components/Search/SearchModal.tsx`
- Create: `src/components/Search/SearchModal.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `src/components/Search/SearchModal.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SearchProvider } from './SearchContext';
import { SearchModal } from './SearchModal';

// Mock next/router
vi.mock('next/router', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

// Mock usePagefind — returns empty results by default
vi.mock('@hooks/usePagefind', () => ({
  usePagefind: () => ({
    results: [],
    isLoading: false,
    search: vi.fn(),
  }),
}));

const renderModal = () =>
  render(
    <SearchProvider>
      <SearchModal />
    </SearchProvider>
  );

describe('SearchModal', () => {
  it('is not visible on mount', () => {
    renderModal();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens on ⌘K keydown', () => {
    renderModal();
    fireEvent.keyDown(document, { key: 'k', metaKey: true });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('opens on Ctrl+K keydown', () => {
    renderModal();
    fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to confirm failure**

```bash
pnpm test:unit -- --reporter=verbose src/components/Search/SearchModal.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/components/Search/SearchModal.tsx`**

```tsx
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
import { Badge } from '@components/Badge';
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
      <DialogContent className="overflow-hidden p-0">
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
                    <div className="flex items-center gap-2">
                      <Badge>
                        {result.filters.type?.[0] === 'newsletter'
                          ? '💌 Newsletter'
                          : 'Article'}
                      </Badge>
                      <span className="font-medium">{result.meta.title}</span>
                    </div>
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
```

- [ ] **Step 4: Run tests to confirm pass**

```bash
pnpm test:unit -- --reporter=verbose src/components/Search/SearchModal.test.tsx
```

Expected: 3 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Search/SearchModal.tsx src/components/Search/SearchModal.test.tsx
git commit -m "feat: add SearchModal command palette with pagefind"
```

---

## Task 8: Navbar search trigger

Adds a search button to the existing Navbar — desktop and mobile. The button reads `open/setOpen` from `SearchContext`.

`SearchContext` is mounted in `_app.tsx` (Task 10), so `useSearch()` will be available when the Navbar renders.

**Files:**
- Modify: `src/components/Navbar/Navbar.tsx`

- [ ] **Step 1: Add desktop search button**

In `Navbar.tsx`, add the `Search` icon import alongside the existing lucide imports:

```tsx
import { Menu, X, Search } from 'lucide-react';
```

Add the `useSearch` import:

```tsx
import { useSearch } from '@components/Search/SearchContext';
```

Inside the `Navbar` component body, add:

```tsx
const { setOpen } = useSearch();
```

In the desktop nav (inside the `<NavigationMenuList>`), add a search button **before** the Newsletter CTA item:

```tsx
{/* Search trigger */}
<NavigationMenuItem>
  <button
    onClick={() => setOpen(true)}
    className={clsxm(
      'group inline-flex h-9 w-max items-center justify-center gap-1.5 rounded-md',
      'bg-transparent px-4 py-2 text-sm font-semibold uppercase text-gray-700',
      'transition-colors hover:bg-gray-100'
    )}
    aria-label="Search"
  >
    <Search className="h-4 w-4" />
    <span className="hidden lg:inline">Search</span>
    <kbd className="hidden rounded border border-gray-200 bg-gray-100 px-1 py-0.5 text-xs text-gray-500 lg:inline">
      ⌘K
    </kbd>
  </button>
</NavigationMenuItem>
```

- [ ] **Step 2: Add mobile search button**

Inside the `<DisclosurePanel>` (mobile nav), add a search button at the top of the links, before the Topics section:

```tsx
{/* Search trigger */}
<div className="border-b border-gray-200 pb-2">
  <button
    onClick={() => setOpen(true)}
    className="flex w-full items-center gap-2 px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
  >
    <Search className="h-4 w-4" />
    Search
  </button>
</div>
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
pnpm typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Navbar/Navbar.tsx
git commit -m "feat: add search trigger button to navbar"
```

---

## Task 9: `/search` page (TDD)

Fully client-rendered page. Uses nuqs `useQueryState` for the `?q=` URL param. Calls `usePagefind`'s `search()` whenever the query changes.

**Files:**
- Create: `src/pages/search.tsx`
- Create: `src/pages/search.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/pages/search.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import SearchPage from './search';

// nuqs requires the NuqsAdapter — use the test adapter in unit tests
vi.mock('nuqs', () => ({
  useQueryState: vi.fn().mockReturnValue(['', vi.fn()]),
}));

vi.mock('@hooks/usePagefind', () => ({
  usePagefind: () => ({
    results: [],
    isLoading: false,
    search: vi.fn(),
  }),
}));

vi.mock('@components/seo', () => ({
  default: () => null,
}));

describe('SearchPage', () => {
  it('renders a search input', () => {
    render(<SearchPage />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('shows no results message when query is set but results are empty', async () => {
    const { useQueryState } = vi.mocked(await import('nuqs'));
    (useQueryState as ReturnType<typeof vi.fn>).mockReturnValue(['react', vi.fn()]);

    render(<SearchPage />);
    expect(screen.getByText(/no results for "react"/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to confirm failure**

```bash
pnpm test:unit -- --reporter=verbose src/pages/search.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/pages/search.tsx`**

```tsx
import { useEffect } from 'react';
import { useQueryState } from 'nuqs';

import SEO from '@components/seo';
import { Badge } from '@components/Badge';
import Link from '@components/Link';
import { usePagefind, type PagefindResultData } from '@hooks/usePagefind';

const SearchResultCard = ({ result }: { result: PagefindResultData }) => (
  <article className="flex flex-col gap-2">
    <div className="flex items-center gap-2">
      <Badge>
        {result.filters.type?.[0] === 'newsletter' ? '💌 Newsletter' : 'Article'}
      </Badge>
    </div>
    <h2 className="text-xl font-semibold">
      <Link href={result.url} className="text-pink-600 hover:underline no-underline">
        {result.meta.title}
      </Link>
    </h2>
    {/* excerpt contains <mark> HTML from pagefind highlighting */}
    <p
      className="line-clamp-3 text-sm text-gray-600"
      dangerouslySetInnerHTML={{ __html: result.excerpt }}
    />
  </article>
);

const SearchPage = () => {
  const [query, setQuery] = useQueryState('q', { defaultValue: '' });
  const { results, isLoading, search } = usePagefind();

  useEffect(() => {
    if (query) void search(query);
  }, [query, search]);

  return (
    <>
      <SEO title="Search" />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Search</h1>

        <input
          type="search"
          value={query}
          onChange={(e) => void setQuery(e.target.value || null)}
          placeholder="Search posts and newsletters…"
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-pink-500"
          autoFocus
        />

        {query && (
          <p className="mt-3 text-sm text-gray-500">
            {isLoading
              ? 'Searching…'
              : `${results.length} result${results.length === 1 ? '' : 's'} for "${query}"`}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-8">
          {results.map((result) => (
            <SearchResultCard key={result.url} result={result} />
          ))}

          {query && !isLoading && results.length === 0 && (
            <p className="text-gray-500">
              No results for &ldquo;{query}&rdquo; — try broader terms.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchPage;
```

- [ ] **Step 4: Run tests to confirm pass**

```bash
pnpm test:unit -- --reporter=verbose src/pages/search.test.tsx
```

Expected: 2 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/search.tsx src/pages/search.test.tsx
git commit -m "feat: add /search page with nuqs URL state"
```

---

## Task 10: Wire `_app.tsx` — NuqsAdapter + SearchProvider + SearchModal

**Files:**
- Modify: `src/pages/_app.tsx`

- [ ] **Step 1: Add imports to `_app.tsx`**

Add at the top of the imports block:

```tsx
import { NuqsAdapter } from 'nuqs/adapters/next/pages';
import { SearchProvider } from '@components/Search/SearchContext';
import { SearchModal } from '@components/Search/SearchModal';
```

- [ ] **Step 2: Update `MyApp` return**

Replace the current return with:

```tsx
function MyApp({ Component, pageProps }: AppProps) {
  return (
    // NuqsAdapter must be an ancestor of all useQueryState call sites.
    // It sits inside MyApp (which is wrapped externally by trpcPages.withTRPC) — this is correct.
    <NuqsAdapter>
      <SearchProvider>
        <PostHogProvider client={posthog}>
          <StructuredData structuredData={siteStructuredData} />
          <div className={fontVariables}>
            <DefaultLayout>
              <FathomAnalytics siteId={env.NEXT_PUBLIC_FATHOM_ID} />
              <Component {...pageProps} />
              <Toaster
                richColors
                closeButton
                position="top-right"
                toastOptions={{
                  style: {
                    background: 'white',
                    border: '1px solid #e5e5e5',
                    color: '#333',
                  },
                }}
              />
              <NewsletterModal />
              <SearchModal />
            </DefaultLayout>
          </div>
        </PostHogProvider>
      </SearchProvider>
    </NuqsAdapter>
  );
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
pnpm typecheck
```

Expected: no errors.

- [ ] **Step 4: Run unit tests to make sure nothing broke**

```bash
pnpm test:unit
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/pages/_app.tsx
git commit -m "feat: wire SearchProvider, SearchModal, and NuqsAdapter into app"
```

---

## Task 11: Manual verification

- [ ] **Step 1: Run a production build**

```bash
pnpm build
```

Expected:
- `prebuild` runs both scripts
- `next build` succeeds
- `postbuild` runs pagefind, outputs something like:
  ```
  [pagefind] Indexed N pages
  [pagefind] Indexed N words
  Pagefind index written to public/pagefind/
  ```

- [ ] **Step 2: Verify index files exist**

```bash
ls public/pagefind/
```

Expected: `pagefind.js`, `pagefind-entry.json`, and other generated files.

- [ ] **Step 3: Spot-check URLs in the index**

```bash
cat public/pagefind/pagefind-entry.json | head -30
```

Verify that URLs look like `/posts/some-slug` (no `.html` suffix, no trailing slash). If URLs are wrong, re-read the spec section on `--glob` and `skipTrailingSlashRedirect`.

- [ ] **Step 4: Start the production server and test search**

```bash
pnpm start
```

Open `http://localhost:3000`. Press ⌘K — the search modal should open. Type a query — results should appear within ~150ms. Click a result — should navigate to the post.

Open `http://localhost:3000/search?q=react` — should show search results for "react".

- [ ] **Step 5: Verify navbar search button**

On desktop: should see Search icon + ⌘K hint in the nav bar. On mobile: should see Search icon in the mobile menu.

- [ ] **Step 6: Final commit if any adjustments were made during verification**

```bash
git add -p
git commit -m "fix: post-verification adjustments"
```
