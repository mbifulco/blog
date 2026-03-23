# Pagefind Site Search — Design Spec

**Date:** 2026-03-23
**Status:** Approved (v3 — final)

---

## Overview

Add full-text site search to mikebifulco.com using [Pagefind](https://pagefind.app/). The feature includes a command-palette modal (cmdk/shadcn `CommandDialog`) triggered by ⌘K or a navbar button, a shareable `/search` page with URL-driven state (nuqs), and a post-build indexing step that generates the search index from pre-rendered HTML.

Related posts replacement is explicitly deferred to a future iteration.

---

## Prerequisites

Before implementing `SearchModal`, the shadcn `command` component must be installed. It is not yet present in `src/components/ui/`:

```sh
npx shadcn@latest add command
```

This installs the cmdk-based `Command`, `CommandDialog`, `CommandInput`, `CommandList`, `CommandItem`, `CommandEmpty`, and `CommandGroup` components. `@radix-ui/react-dialog` is already installed.

---

## Build Pipeline

### Scripts

The existing `package.json` `prebuild` value (`npx tsx scripts/generate-top-tags.ts && npx tsx scripts/generate-related-posts.ts`) is **replaced** by two new orchestrator scripts. This is a planned implementation change — neither script exists yet.

- `scripts/prebuild.ts` — new orchestrator. Calls `generate-top-tags.ts` and `generate-related-posts.ts` (both unchanged). These two steps are independent and run in parallel via `Promise.all`.
- `scripts/postbuild.ts` — new orchestrator. Runs the pagefind CLI.

### `package.json` changes

```json
"prebuild": "npx tsx scripts/prebuild.ts",
"postbuild": "npx tsx scripts/postbuild.ts"
```

The old inline `prebuild` value is removed to prevent double-execution.

### Pagefind CLI invocation (inside `postbuild.ts`)

```sh
pagefind \
  --site .next/server/pages \
  --glob "{posts,newsletter}/*.html" \
  --output-path public/pagefind
```

- `--glob` restricts indexing to posts and newsletter pages only. Other pre-rendered pages (About, Work, Shop, Tags, Topics, Podcast) are excluded.
- Post HTML files are flat inside `.next/server/pages/posts/` and `.next/server/pages/newsletter/` (not in subdirectories), so `*.html` is correct.
- Note: `.next/server/pages/` also contains `newsletter.html` (the newsletter index page). The glob `newsletter/*.html` targets only the subdirectory files and will not match `newsletter.html` — this is the desired behavior.
- Pagefind strips `.html` extensions, producing URLs like `/posts/some-slug` matching the live site. The site sets `skipTrailingSlashRedirect: true` in `next.config.mjs` (no trailing slashes) — this should be consistent, but verify against a sample of indexed URLs after first build.

### Deployment

`postbuild` runs automatically via npm lifecycle after `next build` on Vercel. No changes to `vercel.json` or Vercel build settings are needed. `public/pagefind/` is included in Vercel's static output automatically.

Note: the `analyze` script (`ANALYZE=true next build`) is a separate script and does not trigger `prebuild` or `postbuild`. Bundle analysis runs will not regenerate top-tags, related-posts data, or the Pagefind index — this is expected and acceptable.

### `.gitignore`

Add `public/pagefind/` — generated build artifact, not source.

---

## Indexing Strategy

All changes in `src/components/Post/FullPost.tsx`. This component is shared by both posts and newsletters.

### Structure of `FullPost.tsx`

```html
<article>                          ← line 110: outer article
  <header>                         ← line 111: breadcrumbs, h1, date, tags, cover image
    <Heading as="h1">...</Heading> ← line 115: post title
    ...
  </header>
  <div>
    <main>
      <article class="max-w-prose"> ← line 138: inner article — MDX prose content
        <div class="prose">
          <MDXRemote />              ← line 150: actual post content
        </div>
        <MentionsSummary />
      </article>
      <div class="sticky ...">      ← line 154: sidebar (TOC + CarbonAd) — sibling of inner article
      </div>
    </main>
  </div>
</article>
```

### Attributes to add

| Element | Attribute | Purpose |
| --- | --- | --- |
| Inner `<article>` (line 138) | `data-pagefind-body` | Restrict indexed body to prose content only — excludes breadcrumbs, date, tags, cover image, sidebar |
| `<Heading as="h1">` (line 115) | `data-pagefind-meta="title"` | Provides clean post title to pagefind; `Heading` spreads `{...props}` to the underlying DOM element, so this attribute is correctly forwarded to `<h1>` |
| Outer `<article>` (line 110) | `data-pagefind-filter="type:post"` or `"type:newsletter"` | Enables type filtering in search UI; driven by `contentType` prop |

The sidebar at line 154 is a sibling of the inner article (not within it), so it is not indexed and does not need `data-pagefind-ignore`.

### `contentType` filter note

`contentType` defaults to `'post'` in `FullPost.tsx`. Current call sites:

- `src/pages/newsletter/[slug].tsx` — passes `contentType="newsletter"` explicitly. Correct.
- `src/pages/posts/[slug].tsx` — uses `<Post>` which calls `<FullPost>` without `contentType`, falling through to the `'post'` default. This is correct and acceptable — no change needed.

For any future call sites, always pass `contentType` explicitly; never rely on the default.

### Metadata

The existing `SEO` component sets `og:description` in `<head>`, which pagefind auto-extracts as the result excerpt. Page titles are overridden via `data-pagefind-meta="title"` on the `<h1>` to avoid the `"Post Title | mikebifulco.com"` suffix that would otherwise appear in search results.

---

## Search UI Components

### `usePagefind` hook (`src/hooks/usePagefind.ts`)

- Dynamically imports `/pagefind/pagefind.js` on the client only (`typeof window !== 'undefined'` guard).
- The dynamic import is wrapped in `try/catch`. If the file is missing (e.g. `next dev` before a build has run), the hook returns `{ results: [], isLoading: false }` silently. Search is non-functional in dev — document this with a code comment.
- Exposes `search(query: string)` function.
- Returns `{ results: PagefindResultData[], isLoading: boolean }`.
- Results are lazy-loaded: pagefind returns lightweight stubs, then `result.data()` is called per item.
- Define explicit local types (no `any`):

```ts
type PagefindResult = {
  id: string;
  data: () => Promise<PagefindResultData>;
};

type PagefindResultData = {
  url: string;
  meta: { title: string; image?: string };
  excerpt: string;
  filters: { type?: string[] };
};
```

### `SearchContext` (`src/components/Search/SearchContext.tsx`)

- Provides `{ open: boolean, setOpen: (open: boolean) => void }` via React context.
- Context is used (rather than a module-level ref) because two unrelated component trees — the Navbar button and the `⌘K` keyboard listener inside `SearchModal` — need shared `open` state without prop drilling.
- Provider mounted in `_app.tsx` (see below).

### `SearchModal` (`src/components/Search/SearchModal.tsx`)

- Uses shadcn `CommandDialog`.
- Registers a `keydown` listener for ⌘K (Mac) / Ctrl+K (other) that calls `setOpen(true)` from `SearchContext`.
- Debounce: implemented with `useRef` + `setTimeout`, 150ms delay. No new dependency.
- Results render as `CommandItem` components: title, excerpt (1–2 lines), type badge (`Article` or `💌 Newsletter`).
- Selecting a result calls `router.push(result.url)` and closes the modal.
- Empty state: "No results for '…'"

### Navbar search trigger (`src/components/Navbar/Navbar.tsx`)

- Desktop: lucide `Search` icon (already installed) + `⌘K` hint text; calls `setOpen(true)` from `SearchContext`.
- Mobile: `Search` icon in the `DisclosurePanel` alongside existing nav items.

### `/search` page (`src/pages/search.tsx`)

- **No `getStaticProps`** — fully client-rendered. The page shell pre-renders as static HTML but results load client-side.
- URL state managed by nuqs `useQueryState('q')`. Typing updates `?q=` in real time; URL is shareable.
- Includes `<SEO title="Search" />` (consistent with all other pages in the codebase).
- Layout: search input at top → results count ("X results for 'query'") → vertical list of result cards (title, type badge, date, 1–2 line excerpt).
- Empty state: "No results for 'foo' — try broader terms."
- Loading state: spinner or skeleton while pagefind initializes.

---

## `_app.tsx` changes

`NuqsAdapter` (required by nuqs v2 for Pages Router) wraps the entire `MyApp` return. `SearchContext.Provider` sits inside it. `SearchModal` is rendered alongside `NewsletterModal` inside `DefaultLayout`.

The actual app export is `trpcPages.withTRPC(MyApp)` — `withTRPC` wraps `MyApp` externally. `NuqsAdapter` sits inside `MyApp`'s return, which means it is inside the tRPC provider tree. This is correct: `NuqsAdapter` only needs to be an ancestor of pages that use `useQueryState`, not an ancestor of the tRPC provider.

Complete updated `MyApp` return:

```tsx
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NuqsAdapter>
      <SearchContext.Provider value={...}>
        <PostHogProvider client={posthog}>
          <StructuredData structuredData={siteStructuredData} />
          <div className={fontVariables}>
            <DefaultLayout>
              <FathomAnalytics siteId={env.NEXT_PUBLIC_FATHOM_ID} />
              <Component {...pageProps} />
              <Toaster ... />
              <NewsletterModal />
              <SearchModal />
            </DefaultLayout>
          </div>
        </PostHogProvider>
      </SearchContext.Provider>
    </NuqsAdapter>
  );
}
```

---

## New Dependencies

| Package | Type | Purpose |
| --- | --- | --- |
| `pagefind` | devDependency | CLI that builds the search index post-build |
| `nuqs` | dependency | Type-safe URL search param management; requires `NuqsAdapter` in `_app.tsx` for Pages Router |
| shadcn `command` | (via `npx shadcn@latest add command`) | cmdk-based command palette UI component |

---

## File Changelist

```text
scripts/
  prebuild.ts                    new — orchestrates generate-top-tags + generate-related-posts
  postbuild.ts                   new — runs pagefind CLI

src/
  hooks/
    usePagefind.ts               new — pagefind JS API hook with explicit types

  components/
    Search/
      SearchModal.tsx            new — CommandDialog search UI
      SearchContext.tsx          new — open/setOpen context + provider
    Post/
      FullPost.tsx               modified — data-pagefind-body on inner article,
                                            data-pagefind-meta on h1,
                                            data-pagefind-filter on outer article
    Navbar/
      Navbar.tsx                 modified — search trigger button (desktop + mobile)

  pages/
    search.tsx                   new — /search page, client-rendered, nuqs URL state
    _app.tsx                     modified — NuqsAdapter, SearchContext.Provider, SearchModal

public/
  pagefind/                      gitignored, generated by postbuild

package.json                     modified — prebuild + postbuild scripts updated,
                                            pagefind + nuqs added
.gitignore                       modified — public/pagefind/ added
```

---

## Out of Scope

- Replacing related posts with pagefind runtime queries (deferred)
- Search analytics / tracking search queries
- Filter UI in the command palette (type filter data is captured via `data-pagefind-filter`, UI deferred)
