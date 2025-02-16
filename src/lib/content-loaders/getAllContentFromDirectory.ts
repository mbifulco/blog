import fs from 'fs';
import { join } from 'path/posix';
import { compareDesc } from 'date-fns';

import { processMDXFileContent } from './processMDXFileContent';

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
          return await processMDXFileContent(fullPath, realSlug, type);
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
