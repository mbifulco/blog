import type { Heading } from '@data/content-types';
import { useEffect, useRef, useState } from 'react';

import Link from '@components/Link';
import clsxm from '@utils/clsxm';

type TableOfContentsProps = {
  headings?: Heading[];
  title?: string;
};

// This is a tweaked version of Alex Khomenko's useHighlighted hook.
// Shout out to Alex for the great starting point!
// https://claritydev.net/blog/nextjs-blog-remark-interactive-table-of-contents
function useHighlighted(id: string) {
  const observer = useRef<IntersectionObserver>(undefined);
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
      className="py-1 pr-1"
      style={{ paddingLeft: `${Math.max(heading.level - 2, 0)}ch` }}
    >
      <Link
        href={`#${heading.slug}`}
        className={clsxm(
          'text-ink-muted hover:text-riso-blue no-underline',
          isHighlighted &&
            'text-riso-blue decoration-riso-pink font-bold underline decoration-[3px] underline-offset-4'
        )}
      >
        {heading.text}
      </Link>
    </li>
  );
};

const TableOfContents: React.FC<TableOfContentsProps> = ({
  headings,
  title = 'In this article',
}) => {
  if (!headings) return null;
  if (!headings?.length) return null;

  return (
    <nav
      aria-label={title}
      className="hidden flex-col gap-2 text-sm leading-snug md:flex"
    >
      <p className="text-ink m-0 font-futura text-sm font-bold">{title}</p>
      <ol className="m-0 list-none p-0">
        {headings?.map((heading) => (
          <ToCLink heading={heading} key={heading.slug} />
        ))}
      </ol>
    </nav>
  );
};

export default TableOfContents;
