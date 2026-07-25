import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';

import { componentHandlers, droppedComponents } from './component-handlers';

const CONTENT_DIRECTORIES = [
  path.join(process.cwd(), 'src', 'data', 'posts'),
  path.join(process.cwd(), 'src', 'data', 'newsletters'),
];

/**
 * Components rendered by the site but intentionally not exported, beyond the
 * ones the transform drops by name.
 */
const KNOWN_UNHANDLED = new Set<string>([]);

const readContentFiles = () =>
  CONTENT_DIRECTORIES.flatMap((directory) =>
    fs
      .readdirSync(directory)
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => ({
        file: path.join(directory, file),
        source: fs.readFileSync(path.join(directory, file), 'utf8'),
      }))
  );

/**
 * Strips fenced code blocks and inline code spans so JSX shown as example
 * code is not mistaken for a component in use. This mirrors how the real MDX
 * parser sees the file: code is `code`/`inlineCode`, never a JSX element.
 */
const withoutCode = (source: string) =>
  source.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');

const collectComponentNames = (source: string) => {
  const names = new Set<string>();
  const pattern = /<([A-Z][A-Za-z0-9]*)/g;

  let match = pattern.exec(source);
  while (match) {
    names.add(match[1]);
    match = pattern.exec(source);
  }

  return names;
};

describe('markdown export component coverage', () => {
  it('finds content to check', () => {
    expect(readContentFiles().length).toBeGreaterThan(50);
  });

  it('handles or explicitly drops every component used in content', () => {
    const unhandled = new Map<string, string[]>();

    for (const { file, source } of readContentFiles()) {
      for (const name of collectComponentNames(withoutCode(source))) {
        const covered =
          name in componentHandlers ||
          droppedComponents.has(name) ||
          KNOWN_UNHANDLED.has(name);

        if (covered) continue;

        unhandled.set(name, [
          ...(unhandled.get(name) ?? []),
          path.basename(file),
        ]);
      }
    }

    expect(
      Object.fromEntries(unhandled),
      'Add each component to componentHandlers or droppedComponents in src/lib/markdown-export/component-handlers.ts'
    ).toEqual({});
  });
});
