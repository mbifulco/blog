import fs from 'fs';
import { join } from 'path';
import { compareDesc } from 'date-fns';
import matter from 'gray-matter';

import type { Frontmatter, MarkdownDocument } from '../data/content-types';
import { getHeadings, serialize } from '../utils/mdx';
import { parseTag } from './tags';

const parseFrontmatterDate = (date: Frontmatter['date']): string => {
  try {
    // Use new Date() for all cases since it handles all our input types
    // (Date objects, timestamps, and date strings)
    const parsedDate = new Date(date);

    // Validate that we got a valid date
    if (isNaN(parsedDate.getTime())) {
      throw new Error('Invalid date');
    }

    return parsedDate.toUTCString();
  } catch (error) {
    throw new Error(
      `Invalid date format in frontmatter: ${date} \n Error: ${error}`
    );
  }
};

export const getContentBySlug = async (
  slug: string,
  directory: fs.PathLike,
  type: string
): Promise<MarkdownDocument> => {
  if (!slug || !directory || !type) {
    throw new Error('Missing required parameters');
  }

  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = join(directory.toString(), `${realSlug}.mdx`);

  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const frontmatter = data as Frontmatter;

    const parsedDate = parseFrontmatterDate(frontmatter.date);
    const parsedTags = (frontmatter.tags ?? []).map(parseTag);

    const mdxSource = await serialize(content);
    const headings = getHeadings(content);

    return {
      slug: realSlug,
      frontmatter: {
        ...frontmatter,
        date: parsedDate,
        tags: parsedTags,
        type,
      },
      content,
      tableOfContents: headings,
      source: mdxSource,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error processing ${fullPath}: ${error.message}`);
    }
    throw error;
  }
};

export async function getAllContentFromDirectory(
  directory: fs.PathLike,
  type: string
) {
  if (!directory || !type) {
    throw new Error('Directory and type are required');
  }

  try {
    const slugs = await safeReadDirectory(directory.toString());
    const contentItems = await Promise.all(
      slugs.map((slug) => getContentBySlug(slug, directory, type))
    );

    // Sort content by date, newest first
    const sortedContent = contentItems.sort((a, b) =>
      compareDesc(
        new Date(a?.frontmatter?.date),
        new Date(b?.frontmatter?.date)
      )
    );

    // Filter out drafts in production
    if (process.env.NODE_ENV === 'production') {
      return sortedContent.filter(
        (item) => item.frontmatter?.published !== false
      );
    }

    return sortedContent;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error reading directory ${directory}: ${error.message}`);
    }
    throw error;
  }
}

export const safeReadDirectory = async (dirPath: string) => {
  try {
    // Ensure all imports are at the top and properly initialized
    const fs = await import('fs/promises');

    const files = await fs.readdir(dirPath);
    return files;
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
    return [];
  }
};
