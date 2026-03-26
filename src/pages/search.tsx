import { useEffect } from 'react';
import { useQueryState } from 'nuqs';

import SEO from '@components/seo';
import { Badge } from '@components/Badge';
import Link from '@components/Link';
import { usePagefind } from '@hooks/usePagefind';
import type {PagefindResultData} from '@hooks/usePagefind';

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
    void search(query);
  }, [query, search]);

  return (
    <>
      <SEO title="Search" />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Search</h1>

        <input
          type="search"
          value={query}
          onChange={(e) => void setQuery(e.target.value !== '' ? e.target.value : null)}
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
              No results for &quot;{query}&quot; — try broader terms.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchPage;
