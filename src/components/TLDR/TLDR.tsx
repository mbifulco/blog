import type { HTMLAttributes } from 'react';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { MDXRemote } from 'next-mdx-remote';

import clsxm from '@utils/clsxm';
import { components } from '@utils/MDXProviderWrapper';

// Reuse the shared MDX component map (so code spans, links, emphasis match the
// rest of the site) but override the paragraph so the summary keeps the TL;DR
// box typography instead of the large serif body style.
const TldrParagraph: React.FC<HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  ...props
}) => (
  <p
    className={clsxm(
      'text-ink m-0 text-pretty font-serif text-lg leading-snug',
      className
    )}
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
      'not-prose border-riso-pink mb-10 border-y-2 py-5',
      className
    )}
  >
    <p className="riso-kicker m-0 mb-2">TL;DR</p>
    <MDXRemote {...source} components={tldrComponents} />
  </aside>
);
