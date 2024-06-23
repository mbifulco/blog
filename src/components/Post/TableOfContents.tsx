import { useEffect, useRef, useState } from "react";
import { Heading as HtmlHeading } from "@components/Heading";
import { type Heading } from "src/data/content-types";
import clsxm from "@utils/clsxm";
import Link from "next/link";

type TableOfContentsProps = {
  headings?: Heading[];
};


// shout out to Alex Khomenko for this hook!
// https://claritydev.net/blog/nextjs-blog-remark-interactive-table-of-contents
function useHighlighted(id) {
  const observer = useRef<IntersectionObserver>();
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const handleObserver = (entries) => {
      entries.forEach((entry) => {
        if (entry?.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    observer.current = new IntersectionObserver(handleObserver, {
      rootMargin: "0% 0% -35% 0px",
    });

    const elements = document.querySelectorAll("h2, h3, h4");
    elements.forEach((elem) => observer.current?.observe(elem));
    return () => observer.current?.disconnect();
  }, []);

  return [activeId === id, setActiveId];
}

const ToCLink = ({ heading }) => {
  const [isHighlighted, setIsHighlighted] = useHighlighted(heading.slug);

  return (
    <li key={heading.slug} className={clsxm("border-l-2 border-l-pink-600 pl-4 py-1 rounded-r pr-1", isHighlighted && "bg-pink-600 ")}>
      <Link
        href={`#${heading.slug}`}
        className={clsxm(isHighlighted && "text-white hover:text-white")}
      >
        {heading.text}
      </Link>
    </li>
  );
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ headings }) => {
  if (!headings) return null;
  if (!headings?.length) return null;

  return (
    <nav className="p-4 md:flex flex-col gap-2.5 text-sm rounded bg-pink-50 hidden md:visible">
      <HtmlHeading as="h3">In this article</HtmlHeading>
      <ol>
        {headings?.map((heading) => <ToCLink heading={heading} key={heading.slug} />)}
      </ol>
    </nav>
  );
}

export default TableOfContents;
