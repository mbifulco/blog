import type { HTMLAttributes } from 'react';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { MDXRemote } from 'next-mdx-remote';

import clsxm from '@utils/clsxm';
import { components } from '@utils/MDXProviderWrapper';

// Reuse the shared MDX component map (so code spans, links, emphasis match the
// rest of the site) but override the paragraph so the summary keeps the TL;DR
// box typography instead of the large serif body style.
const TldrParagraph: React.FC<HTMLAttributes<HTMLParagraphElement>> = (
  props
) => (
  <p
    className="m-0 text-pretty text-lg leading-snug text-gray-800 dark:text-gray-200"
    {...props}
  />
);

const tldrComponents = { ...components, p: TldrParagraph };

type TLDRProps = {
  source: MDXRemoteSerializeResult;
  className?: string;
};

/**
 * Answer-first summary box rendered near the top of a post. Sourced from the
 * (serialized) `tldr` frontmatter field; the raw string is also emitted into
 * BlogPosting structured data as `abstract` for AI/search extraction.
 */
export const TLDR: React.FC<TLDRProps> = ({ source, className }) => (
  <aside
    aria-label="Summary"
    data-pagefind-ignore
    className={clsxm(
      'not-prose mb-8 rounded-lg border-l-8 border-pink-400 bg-pink-50 px-6 py-4 dark:bg-pink-950/20',
      className
    )}
  >
    <p className="m-0 mb-1 text-xs font-bold uppercase tracking-wide text-pink-700 dark:text-pink-300">
      TL;DR
    </p>
    <MDXRemote {...source} components={tldrComponents} />
  </aside>
);
