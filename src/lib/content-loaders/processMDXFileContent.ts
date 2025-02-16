import fs from 'fs';
import { compile } from '@mdx-js/mdx';
import matter from 'gray-matter';

import type { MarkdownDocument } from '../../data/content-types';
import { getHeadings, serialize } from '../../utils/mdx';
import { parseTag } from '../tags';

/**
 * Processes an MDX file and returns a structured MarkdownDocument
 * @param fullPath - The complete file system path to the MDX file
 * @param realSlug - The slug for the content (filename without .mdx extension)
 * @param type - The type of content (e.g., 'post', 'newsletter')
 * @returns Promise<MarkdownDocument> - Processed content with frontmatter, source, and metadata
 * @throws Error if MDX compilation fails or file cannot be read
 */
export const processMDXFileContent = async (
  fullPath: string,
  realSlug: string,
  type: string
): Promise<MarkdownDocument> => {
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const { date, tags } = data;
  const articleDate = new Date(date as string);

  if (isNaN(articleDate.getTime())) {
    console.warn(`processContent: Invalid date for ${realSlug}: ${date}`);
  }

  // Validate MDX syntax before serializing
  try {
    await compile(content);
  } catch (error: unknown) {
    console.error(`MDX syntax error in ${fullPath}:`, error);
    throw new Error(
      `MDX syntax error in ${fullPath}: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  const mdxSource = await serialize(content);
  const headings = getHeadings(content);
  const tagsArray = (tags ?? []) as string[];

  return {
    slug: realSlug,
    frontmatter: {
      ...data,
      date: articleDate.toUTCString(),
      tags: tagsArray?.map((tag: string) => parseTag(tag)) || [],
      type,
      title: data.title,
      slug: realSlug,
    },
    content,
    tableOfContents: headings,
    source: mdxSource,
  };
};
