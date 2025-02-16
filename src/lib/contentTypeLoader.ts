import fs from 'fs';
import { join } from 'path';
import { compile } from '@mdx-js/mdx';
import { compareDesc } from 'date-fns';
import matter from 'gray-matter';

import type { MarkdownDocument } from '../data/content-types';
import { getHeadings, serialize } from '../utils/mdx';
import { parseTag } from './tags';

/**
 * Processes an MDX file and returns a structured MarkdownDocument
 * @param fullPath - The complete file system path to the MDX file
 * @param realSlug - The slug for the content (filename without .mdx extension)
 * @param type - The type of content (e.g., 'post', 'newsletter')
 * @returns Promise<MarkdownDocument> - Processed content with frontmatter, source, and metadata
 * @throws Error if MDX compilation fails or file cannot be read
 */
const processContent = async (
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

/**
 * Retrieves and processes all MDX files from a specified directory
 * @param directory - The file system path to the content directory
 * @param type - The type of content being processed (e.g., 'post', 'newsletter')
 * @returns Promise<MarkdownDocument[]> - Array of processed content items, sorted by date
 * @throws Error if directory doesn't exist or content processing fails
 */
export const getAllContentFromDirectory = async (
  directory: fs.PathLike,
  type: string
) => {
  try {
    if (!fs.existsSync(directory)) {
      console.error(
        `getAllContentFromDirectory: Directory not found: ${directory}`
      );
      throw new Error(`Directory not found: ${directory}`);
    }

    const slugs = fs.readdirSync(directory);
    const articles = await Promise.all(
      slugs.map(async (slug) => {
        try {
          const realSlug = slug.replace(/\.mdx$/, '');
          const fullPath = join(directory.toString(), `${realSlug}.mdx`);
          return await processContent(fullPath, realSlug, type);
        } catch (error) {
          console.error(
            `getAllContentFromDirectory: Error processing ${slug}:`,
            error
          );
          return null;
        }
      })
    );

    // filter out null entries from failed processing
    const validArticles = articles.filter((article) => article !== null);

    // sort posts by date, newest first
    validArticles.sort((a, b) => {
      const dateA = new Date(a?.frontmatter?.date);
      const dateB = new Date(b?.frontmatter?.date);

      if (isNaN(dateA.getTime())) {
        console.warn(`Invalid date for article: ${a?.frontmatter?.slug}`);
        return 1;
      }
      if (isNaN(dateB.getTime())) {
        console.warn(`Invalid date for article: ${b?.frontmatter?.slug}`);
        return -1;
      }

      return compareDesc(dateA, dateB);
    });

    // filter out drafts for production
    if (process.env.NODE_ENV === 'production') {
      return validArticles.filter(
        (article) => article.frontmatter?.published !== false
      );
    }

    return validArticles;
  } catch (error) {
    console.error(`getAllContentFromDirectory: Error loading ${type}:`, error);
    throw error;
  }
};

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
  type: string
): Promise<MarkdownDocument> => {
  try {
    const realSlug = slug.replace(/\.mdx$/, '');
    const fullPath = join(directory.toString(), `${realSlug}.mdx`);

    if (!fs.existsSync(fullPath)) {
      console.error(`getContentBySlug: File not found at path: ${fullPath}`);
      throw new Error(`File not found: ${fullPath}`);
    }

    return await processContent(fullPath, realSlug, type);
  } catch (error) {
    console.error(`getContentBySlug: Error processing ${slug}:`, error);
    throw error;
  }
};

/**
 * Safely reads a directory and returns its contents
 * @param dirPath - The file system path to read
 * @returns Promise<string[]> - Array of filenames in the directory
 * @description Uses dynamic import for fs/promises to ensure proper initialization.
 * Returns empty array if directory cannot be read.
 */
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
