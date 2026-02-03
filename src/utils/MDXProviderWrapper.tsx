import React, { Children } from 'react';
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  HTMLProps,
  ReactElement,
} from 'react';
import Link from '@components/Link';
import Script from 'next/script';
import { MDXProvider } from '@mdx-js/react';
import type { MDXComponents } from 'mdx/types';
import { Highlight, themes } from 'prism-react-renderer';

import { PullQuote } from '@components/PullQuote';
import clsxm from '@utils/clsxm';
// one off component imports
import { CenteredTextDemo } from '../components/demos/CenteredTextDemo';
import { OrtonEffectImage } from '../components/demos/OrtonEffectImage';
import type { HeadingProps } from '../components/Heading';
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
            "hover:before:relative hover:before:-ml-[1.2ch] hover:before:inline hover:before:border-b-0 hover:before:pr-[0.2ch] hover:before:text-pink-700 hover:before:no-underline hover:before:content-['#']",
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
  <p className="text-xl" {...props} />
);

const Blockquote: React.FC<HTMLAttributes<HTMLQuoteElement>> = ({
  children,
}) => {
  return (
    <blockquote className="border-l-4 border-pink-400 bg-gray-100 p-3 text-balance">
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
      className="mt-12 mb-6 flex flex-row gap-2 font-bold text-pink-400"
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
        'my-8 -ml-8 border-l-8 border-solid px-8 py-4',
        type === 'default' && 'border-pink-400 bg-pink-50 text-pink-900',
        type === 'info' && 'border-yellow-400 bg-yellow-50 text-yellow-900',
        type === 'note' && 'border-green-400 bg-green-50 text-green-900',
        type === 'error' && 'border-red-400 bg-red-50 text-red-900',
        type === 'warning' && 'border-red-400 bg-red-50 text-red-900'
      )}
      {...props}
    />
  );
};

const TextHighlight = ({ key: _, ...rest }: HTMLProps<HTMLElement>) => (
  <mark
    className={clsxm(
      'xs inline rounded-sm bg-pink-600 px-[0.5ch] leading-tight text-white',
      rest.className
    )}
    {...rest}
  />
);

const InlineCode: React.FC<HTMLAttributes<HTMLSpanElement>> = ({
  ...props
}) => {
  return (
    <span
      {...props}
      className="inline-block max-w-full rounded-xs bg-slate-500 px-[0.5ch] py-[0.1ch] align-text-bottom font-mono text-sm whitespace-pre text-white"
    />
  );
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

  return (
    <div
      className="-mx-2 max-w-[calc(100vw_-_36px)] rounded-sm md:mx-0"
      style={{
        background: themes.nightOwl.plain.backgroundColor,
      }}
    >
      <Highlight
        theme={themes.nightOwl}
        code={firstChildProps?.children as string}
        language={matches?.groups?.lang ?? ''}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={{ ...style, overflowX: 'auto' }}>
            {tokens.map((line, i) => {
              // TODO: why is this needed though?
              if (i === tokens.length - 1) return null;
              return (
                <div style={{ display: 'table-row' }} key={`code-line-${i}`}>
                  <span
                    style={{
                      opacity: 0.5,
                      paddingRight: '1ch',
                      display: 'table-cell',
                    }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ display: 'table-cell' }}>
                    <div {...getLineProps({ line, key: i })}>
                      {line.map((token, lineKey) => (
                        <span
                          key={lineKey}
                          {...getTokenProps({ token, key: lineKey })}
                        />
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
  <li {...rest}>
    {children}
  </li>
);

const HorizontalRule = () => {
  return (
    <div className="mx-auto mt-12 mb-8 w-[50%] max-w-[50%] rounded-sm border-b-[5px] border-solid border-pink-400" />
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
        'rounded-xs bg-pink-400 px-4 py-2 text-white shadow-md hover:bg-pink-500',
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
