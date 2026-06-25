import React from 'react';

/**
 * Recursively flattens a React node tree into plain text. Used to derive the
 * `acceptedAnswer.text` for FAQPage structured data from rich MDX answer
 * content (paragraphs, links, inline code, etc.) so authors don't have to
 * maintain a separate plain-text copy of each answer.
 */
export function reactNodeToText(node: React.ReactNode): string {
  let text = '';

  if (node === null || node === undefined || typeof node === 'boolean') {
    return text;
  }

  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (Array.isArray(node)) {
    // Join with a space so block-level children don't mash words together,
    // then fall through to the normalization below (collapse whitespace runs
    // and drop spaces before punctuation, e.g. "hello ." => "hello.").
    text = node.map(reactNodeToText).join(' ');
  } else if (React.isValidElement(node)) {
    const { children } = (node.props as { children?: React.ReactNode }) ?? {};
    text = reactNodeToText(children);
  }

  return text
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,;:!?])/g, '$1')
    .trim();
}
