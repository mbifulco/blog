import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  HTMLProps,
  ReactElement,
} from 'react';
import type { MDXComponents } from 'mdx/types';
import type { HeadingProps } from '../components/Heading';
import React, { Children } from 'react';
import Script from 'next/script';
import { MDXProvider } from '@mdx-js/react';
import { Highlight, themes } from 'prism-react-renderer';

import { CopyCodeButton } from '@components/CodeBlock';
import { FAQ, FAQItem } from '@components/FAQ';
import Link from '@components/Link';
import { PullQuote } from '@components/PullQuote';
import clsxm from '@utils/clsxm';
// one off component imports
import { CenteredTextDemo } from '../components/demos/CenteredTextDemo';
import { OrtonEffectImage } from '../components/demos/OrtonEffectImage';
import { TextPrettyDemo } from '../components/demos/TextPrettyDemo';
import { Heading } from '../components/Heading';
import { Image } from '../components/Image';
import { Threads, Tweet, Vimeo, YouTube } from '../components/MdxEmbed';
import { SponsoredSection } from '../components/SponsoredSection';

const CustomHeading: React.FC<HeadingProps> = ({
  as,
  children,
  id,
  ...props
}) => {
  if (id) {
    // if we have an ID, render a "#" character before the heading on hover
    return (
      <Link href={`#${id}`} className="block no-underline hover:no-underline">
        <Heading
          as={as}
          className={clsxm(
            'inline tracking-normal no-underline',
            "hover:before:text-riso-pink hover:before:relative hover:before:-ml-[1.2ch] hover:before:inline hover:before:border-b-0 hover:before:pr-[0.2ch] hover:before:no-underline hover:before:content-['#']",
            'scroll-mt-2'
          )}
          id={id}
          {...props}
        >
          {children}
        </Heading>
      </Link>
    );
  }
  return (
    <Heading as={as} {...props}>
      {children}
    </Heading>
  );
};

/**
 * note: we force H1 -> H2, because all H1s on the site are rendered
 * directly in page templates. We only want 1 possible H1 per page, so this
 * intentionally bumps them down. Leaving a data- attribute to render in HTML
 * in case I ever run into this as a problem 🤣
 */
const H1: React.FC<HeadingProps> = (props) => (
  <CustomHeading {...props} as="h2" />
);
const H2: React.FC<HeadingProps> = (props) => (
  <CustomHeading {...props} as="h2" />
);
const H3: React.FC<HeadingProps> = (props) => (
  <CustomHeading {...props} as="h3" />
);
const H4: React.FC<HeadingProps> = (props) => (
  <CustomHeading {...props} as="h4" />
);
const H5: React.FC<HeadingProps> = (props) => (
  <CustomHeading {...props} as="h5" />
);
const H6: React.FC<HeadingProps> = (props) => (
  <CustomHeading {...props} as="h6" />
);

const P: React.FC<HTMLAttributes<HTMLParagraphElement>> = (props) => (
  <p className="text-pretty font-serif text-xl leading-relaxed" {...props} />
);

const Blockquote: React.FC<HTMLAttributes<HTMLQuoteElement>> = ({
  children,
}) => {
  return (
    <blockquote className="text-riso-blue [&>p:first-of-type]:before:text-riso-pink [&>p:last-of-type]:after:text-riso-pink my-10 border-0 pl-0 font-normal not-italic [&>p:first-of-type]:before:content-[open-quote] sm:[&>p:first-of-type]:before:absolute sm:[&>p:first-of-type]:before:-translate-x-full sm:[&>p:first-of-type]:before:pr-1 [&>p:last-child]:mb-0 [&>p:last-of-type]:after:content-[close-quote] [&_p]:text-balance [&_p]:text-2xl [&_p]:leading-snug">
      {children}
    </blockquote>
  );
};

type CustomLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

const CustomLink: React.FC<CustomLinkProps> = ({ children, ...props }) => {
  return <a {...props}>{children}</a>;
};

const Colophon = () => {
  return (
    <div
      className="text-riso-pink mb-6 mt-12 flex flex-row gap-2 font-bold"
      aria-hidden
    >
      <div className="flex flex-row gap-5">
        <span>*</span>
        <span>*</span>
        <span>*</span>
      </div>
    </div>
  );
};

type AsideProps = HTMLProps<HTMLDivElement> & {
  type: 'default' | 'info' | 'note' | 'error' | 'warning';
};
const Aside: React.FC<AsideProps> = ({ type = 'default', ...props }) => {
  return (
    <aside
      className={clsxm(
        'text-ink my-8 text-pretty border-y-2 border-solid px-5 py-4 [&_p:last-child]:mb-0',
        type === 'default' && 'border-riso-pink bg-tint-pink',
        type === 'info' && 'border-riso-blue bg-tint-blue',
        type === 'note' && 'border-riso-blue bg-tint-blue',
        (type === 'error' || type === 'warning') &&
          'border-destructive bg-destructive/10'
      )}
      {...props}
    />
  );
};

const TextHighlight = ({ key: _, ...rest }: HTMLProps<HTMLElement>) => (
  <mark
    className={clsxm(
      'xs bg-tint-pink text-ink inline px-[0.5ch] leading-tight',
      rest.className
    )}
    {...rest}
  />
);

const InlineCode: React.FC<HTMLAttributes<HTMLElement>> = ({ ...props }) => {
  return (
    <code
      {...props}
      className="bg-tint-blue text-riso-blue inline px-[0.5ch] py-[0.1ch] font-mono text-[0.85em]"
    />
  );
};

// Code prints on federal-blue ink in both themes; Night Owl's token colors stay
// for legibility, only its ground and gutter are replaced.
const CODE_INK = '#141a3d';
const CODE_GUTTER = '#ff48b0';
// Night Owl's comment gray is 3.6:1 on the code ink; this lifts it past 4.5:1.
const CODE_COMMENT = '#8a9a9a';
const CODE_THEME = {
  ...themes.nightOwl,
  styles: themes.nightOwl.styles.map((style) =>
    style.types.includes('comment')
      ? { ...style, style: { ...style.style, color: CODE_COMMENT } }
      : style
  ),
};

type PreProps = {
  children?: React.ReactNode;
};

const Pre: React.FC<PreProps> = ({ children }) => {
  const firstChild = Children.toArray(children)[0] as ReactElement<unknown>;

  if (!React.isValidElement(firstChild)) {
    return null;
  }

  const firstChildProps = firstChild.props as {
    className?: string;
    children?: React.ReactNode;
  };

  const classNames = firstChildProps.className!;
  const matches = /language-(?<lang>.*)/.exec(classNames);
  const language = matches?.groups?.lang ?? '';

  const source = firstChildProps?.children as string;
  // Trimmed for the clipboard only. `Highlight` needs the trailing newline the
  // renderer below discards - trimming it here eats a real line of code.
  const copyableSource = String(source ?? '').replace(/\n+$/, '');

  return (
    <div
      className="group relative -mx-4 my-8 max-w-[100vw] sm:mx-0 sm:max-w-full"
      style={{ background: CODE_INK }}
    >
      {/* Zero-height so the button overlays the block without adding to its
          height, and transparent to clicks so it can't hijack text selection. */}
      <div className="pointer-events-none sticky top-2 z-10 flex h-0 justify-end pr-2 pt-2">
        <CopyCodeButton
          code={copyableSource}
          language={language}
          className="pointer-events-auto"
        />
      </div>
      <Highlight theme={CODE_THEME} code={source} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={className}
            style={{ ...style, background: 'transparent', overflowX: 'auto' }}
          >
            {tokens.map((line, i) => {
              // The last token line is MDX's trailing newline, not code.
              if (i === tokens.length - 1) return null;
              return (
                <div style={{ display: 'table-row' }} key={`code-line-${i}`}>
                  <span
                    style={{
                      color: CODE_GUTTER,
                      paddingRight: '1.5ch',
                      userSelect: 'none',
                      display: 'table-cell',
                    }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ display: 'table-cell' }}>
                    <div {...getLineProps({ line })}>
                      {line.map((token, lineKey) => (
                        <span key={lineKey} {...getTokenProps({ token })} />
                      ))}
                    </div>
                  </span>
                </div>
              );
            })}
          </pre>
        )}
      </Highlight>
    </div>
  );
};

const OrderedList: React.FC<HTMLAttributes<HTMLOListElement>> = ({
  children,
  ...rest
}) => (
  <ol
    {...rest}
    className="list-decimal marker:text-pink-400 [&_li]:my-1 [&_li_p]:my-0"
  >
    {children}
  </ol>
);

const UnorderedList: React.FC<HTMLAttributes<HTMLUListElement>> = ({
  children,
  ...rest
}) => (
  <ul
    {...rest}
    className="list-disc marker:text-pink-400 [&_li]:my-1 [&_li_p]:my-0"
  >
    {children}
  </ul>
);

const ListItemComponent: React.FC<HTMLAttributes<HTMLLIElement>> = ({
  children,
  ...rest
}) => (
  <li className="font-serif text-xl" {...rest}>
    {children}
  </li>
);

const HorizontalRule = () => {
  return (
    <div aria-hidden className="mx-auto mb-10 mt-12 flex w-1/2 flex-col gap-1">
      <div className="bg-pink-fill h-0.5" />
      <div className="bg-blue-fill ml-2 h-0.5" />
    </div>
  );
};

const Strikethrough: React.FC<HTMLAttributes<HTMLElement>> = ({
  children,
  ...props
}) => {
  return (
    <del className="line-through" {...props}>
      {children}
    </del>
  );
};

const Button: React.FC<HTMLProps<HTMLButtonElement>> = ({
  className,
  children,
  type,
  ...props
}) => {
  return (
    <button
      className={clsxm(
        'bg-pink-fill text-on-fill hover:bg-blue-fill px-4 py-2 font-futura font-bold',
        className
      )}
      type={
        (type as ButtonHTMLAttributes<HTMLButtonElement>['type']) ?? 'button'
      }
      {...props}
    >
      {children}
    </button>
  );
};

export const customComponents = {
  Aside,
  blockquote: Blockquote,
  PullQuote,
  FAQ,
  FAQItem,
  Button,
  Colophon,
  Highlight: TextHighlight,
  Image,
  Link,
  code: InlineCode,
  a: CustomLink,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  hr: HorizontalRule,
  li: ListItemComponent,
  p: P,
  pre: Pre,
  Script,
  SponsoredSection,
  ul: UnorderedList,
  ol: OrderedList,
  del: Strikethrough,
  s: Strikethrough,
};

/*
  NOTE: due to a quirk in the mdx strategy we're using currently, we are unable to `import` components within mdx files.
        To support that, they need to be added here. I'm keeping them in a separate object to track for later use, on the off chance this gets fixed one day.
        I also recommend continuing to add `import` lines to individual mdx files to reduce work later - they don't seem to break anything right now

  for more context, https://github.com/hashicorp/next-mdx-remote#import--export
*/
const oneOffComponentsUsedInPosts = {
  CenteredTextDemo, // used in dont-center-paragraph-text.mdx
  OrtonEffectImage, // used in orton-effect-css-react.mdx
  TextPrettyDemo, // used in text-pretty-for-visual-balance.mdx
};

export const components: MDXComponents = {
  ...customComponents,
  ...oneOffComponentsUsedInPosts,
  Threads,
  Tweet,
  YouTube,
  Vimeo,
};

const MDXProviderWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <MDXProvider components={components}>{children}</MDXProvider>;

export default MDXProviderWrapper;
