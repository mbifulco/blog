import type { Root, RootContent } from 'mdast';
import type { JsxAttribute, JsxNode } from './types';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';

import { componentHandlers, droppedComponents } from './component-handlers';

const JSX_NODE_TYPES = new Set(['mdxJsxFlowElement', 'mdxJsxTextElement']);

/**
 * MDX-only nodes that carry no prose: import/export statements and
 * curly-brace expressions, which in this content are JSX comments.
 */
const MDX_META_NODE_TYPES = new Set([
  'mdxjsEsm',
  'mdxFlowExpression',
  'mdxTextExpression',
]);

/**
 * Flattens JSX attributes to a plain string map. Expression attributes
 * (`width={640}`) reduce to their raw source text; boolean shorthand
 * attributes (`priority`) become an empty string.
 */
const flattenAttributes = (
  attributes: JsxAttribute[]
): Record<string, string> => {
  const attrs: Record<string, string> = {};

  for (const attribute of attributes) {
    if (attribute.type !== 'mdxJsxAttribute' || !attribute.name) continue;

    const { value } = attribute;

    if (value == null) {
      attrs[attribute.name] = '';
    } else if (typeof value === 'string') {
      attrs[attribute.name] = value;
    } else if (typeof value.value === 'string') {
      attrs[attribute.name] = value.value.replace(/^['"]|['"]$/g, '');
    }
  }

  return attrs;
};

const isJsxNode = (node: RootContent): node is RootContent & JsxNode =>
  JSX_NODE_TYPES.has(node.type);

/**
 * Depth-first rewrite of a node list. Children are transformed before their
 * parent so handlers always receive finished Markdown.
 */
const transformNodes = (nodes: RootContent[]): RootContent[] => {
  const output: RootContent[] = [];

  for (const node of nodes) {
    if (MDX_META_NODE_TYPES.has(node.type)) continue;

    if (isJsxNode(node)) {
      const name = node.name ?? '';

      if (droppedComponents.has(name)) continue;

      const children = transformNodes(node.children ?? []);
      const handler = componentHandlers[name];

      // Unknown components degrade to their contents rather than vanishing.
      output.push(
        ...(handler
          ? handler(flattenAttributes(node.attributes ?? []), children)
          : children)
      );
      continue;
    }

    const container = node as RootContent & { children?: RootContent[] };

    if (Array.isArray(container.children)) {
      output.push({
        ...container,
        children: transformNodes(container.children),
      } as RootContent);
      continue;
    }

    output.push(node);
  }

  return output;
};

const MAX_HEADING_DEPTH = 6;

const eachHeading = (
  nodes: RootContent[],
  visit: (heading: RootContent & { depth: number }) => void
): void => {
  for (const node of nodes) {
    if (node.type === 'heading') visit(node);

    const container = node as RootContent & { children?: RootContent[] };
    if (Array.isArray(container.children)) {
      eachHeading(container.children, visit);
    }
  }
};

/**
 * Pushes headings down so the shallowest one sits at `minDepth`, preserving the
 * document's internal hierarchy.
 *
 * A fixed offset is not enough: post bodies are inconsistent about their top
 * level, and a body that opens at h1 would land on the same level as the entry
 * headings of the file it is embedded in. Depths saturate at h6 rather than
 * overflowing into invalid markdown.
 */
const enforceMinHeadingDepth = (nodes: RootContent[], minDepth: number) => {
  let shallowest = MAX_HEADING_DEPTH;
  eachHeading(nodes, (heading) => {
    shallowest = Math.min(shallowest, heading.depth);
  });

  const offset = minDepth - shallowest;
  if (offset <= 0) return;

  eachHeading(nodes, (heading) => {
    heading.depth = Math.min(heading.depth + offset, MAX_HEADING_DEPTH);
  });
};

const remarkJsxToMarkdown =
  ({ minHeadingDepth = 0 }: { minHeadingDepth?: number } = {}) =>
  (tree: Root) => {
    tree.children = transformNodes(tree.children);
    if (minHeadingDepth > 1) {
      enforceMinHeadingDepth(tree.children, minHeadingDepth);
    }
  };

const buildProcessor = (minHeadingDepth: number) =>
  unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkGfm)
    .use(remarkJsxToMarkdown, { minHeadingDepth })
    .use(remarkStringify, {
      bullet: '-',
      emphasis: '*',
      strong: '*',
      fences: true,
      rule: '-',
    });

// Processors are stateless and reusable, so build one per distinct offset
// rather than per document.
const processors = new Map<number, ReturnType<typeof buildProcessor>>();

const processorFor = (minHeadingDepth: number) => {
  const cached = processors.get(minHeadingDepth);
  if (cached) return cached;

  const processor = buildProcessor(minHeadingDepth);
  processors.set(minHeadingDepth, processor);
  return processor;
};

export type MdxToMarkdownOptions = {
  /**
   * Shallowest heading level the output may use. Headings shift down as a
   * group to honour it, for embedding a document inside a larger file.
   */
  minHeadingDepth?: number;
};

/**
 * Converts an MDX document body (frontmatter already removed) into plain
 * Markdown with every custom component resolved.
 */
export const mdxToMarkdown = async (
  mdxBody: string,
  { minHeadingDepth = 0 }: MdxToMarkdownOptions = {}
): Promise<string> => {
  const file = await processorFor(minHeadingDepth).process(mdxBody);
  return String(file);
};
