import type { RootContent } from 'mdast';

/**
 * An attribute on an MDX JSX element. `value` is null for boolean shorthand
 * attributes (`<Image priority />`) and an object for expression attributes
 * (`<Image width={640} />`), which we reduce to their raw source text.
 */
export type JsxAttribute = {
  type: 'mdxJsxAttribute' | 'mdxJsxExpressionAttribute';
  name?: string | null;
  value?: string | { value?: string } | null;
};

/**
 * An MDX JSX element node produced by remark-mdx. `name` is null for
 * fragments (`<>...</>`).
 */
export type JsxNode = {
  type: 'mdxJsxFlowElement' | 'mdxJsxTextElement';
  name: string | null;
  attributes: JsxAttribute[];
  children: RootContent[];
};

/**
 * Turns a JSX element into zero or more mdast nodes. Handlers are pure: they
 * receive flattened attributes and already-transformed children.
 */
export type JsxHandler = (
  attrs: Record<string, string>,
  children: RootContent[]
) => RootContent[];

/** A link to another document on the site, for the "Related reading" list. */
export type MarkdownRelatedLink = {
  title: string;
  url: string;
};

export type MarkdownExportOptions = {
  canonicalUrl: string;
  /** Other posts and newsletters worth following from this one. */
  relatedLinks?: MarkdownRelatedLink[];
  /** The series this document belongs to, when it is part of one. */
  series?: {
    name: string;
    url: string;
    entries: MarkdownRelatedLink[];
  };
};
