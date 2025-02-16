import fs from 'fs';
import { join } from 'path/posix';

import type { ContentType, MarkdownDocument } from '@data/content-types';
import { processMDXFileContent } from './processMDXFileContent';

/**
 * Retrieves and processes a single MDX file by its slug
 * @param slug - The slug (filename without .mdx) of the content to retrieve
 * @param directory - The file system path to the content directory
 * @param type - The type of content being processed (e.g., 'post', 'newsletter')
 * @returns Promise<MarkdownDocument> - Processed content with frontmatter, source, and metadata
 * @throws Error if file doesn't exist or content processing fails
 */

export const getContentBySlug = async (
  slug: string,
  directory: fs.PathLike,
  type: ContentType
): Promise<MarkdownDocument> => {
  try {
    const realSlug = slug.replace(/\.mdx$/, '');
    const fullPath = join(directory.toString(), `${realSlug}.mdx`);

    if (!fs.existsSync(fullPath)) {
      console.error(`getContentBySlug: File not found at path: ${fullPath}`);
      throw new Error(`File not found: ${fullPath}`);
    }

    return await processMDXFileContent(fullPath, realSlug, type);
  } catch (error) {
    console.error(`getContentBySlug: Error processing ${slug}:`, error);
    throw error;
  }
};
