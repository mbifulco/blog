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

export type MarkdownExportOptions = {
  canonicalUrl: string;
};
