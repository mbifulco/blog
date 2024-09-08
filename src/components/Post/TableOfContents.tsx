import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { Heading } from 'src/data/content-types';

import { Heading as HtmlHeading } from '@/components/Heading';
import { cn } from '@/lib/utils';

type TableOfContentsProps = {
  headings?: Heading[];
};

// This is a tweaked version of Alex Khomenko's useHighlighted hook.
// Shout out to Alex for the great starting point!
// https://claritydev.net/blog/nextjs-blog-remark-interactive-table-of-contents
function useHighlighted(id: string) {
  const observer = useRef<IntersectionObserver>();
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries?.forEach((entry) => {
        if (entry?.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    observer.current = new IntersectionObserver(handleObserver, {
      rootMargin: '0% 0% -35% 0px',
    });

    const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    elements.forEach((elem) => observer.current?.observe(elem));
    return () => observer.current?.disconnect();
  }, []);

  return [activeId === id, setActiveId];
}

const ToCLink: React.FC<{ heading: Heading }> = ({ heading }) => {
  const [isHighlighted] = useHighlighted(heading.slug);

  return (
    <li
      key={heading.slug}
      className={cn('rounded-r py-1 pr-1 text-gray-600')}
      style={{ paddingLeft: `${Math.max(heading.level - 2, 0)}ch` }}
    >
      <Link
        href={`#${heading.slug}`}
        className={cn(
          'font-medium text-gray-700',
          isHighlighted && 'text-pink-600 underline hover:italic'
        )}
      >
        {heading.text}
      </Link>
    </li>
  );
};

const TableOfContents: React.FC<TableOfContentsProps> = ({ headings }) => {
  if (!headings) return null;
  if (!headings?.length) return null;

  return (
    <nav className="hidden flex-col gap-2.5 rounded border px-4 py-3 text-sm shadow md:visible md:flex">
      <HtmlHeading as="h3">In this article</HtmlHeading>
      <ol>
        {headings?.map((heading) => (
          <ToCLink heading={heading} key={heading.slug} />
        ))}
      </ol>
    </nav>
  );
};

export default TableOfContents;
