import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { compareDesc } from 'date-fns';

import type { MarkdownDocument } from '@data/content-types';
import { parseTag } from './utils';

/**
 * Loads and processes all MDX files from a specified directory
 * Simplified version that only extracts frontmatter for tag operations
 *
 * @param directory - The file system path to the content directory
 * @param type - The type of content being processed (e.g., 'post', 'newsletter')
 * @returns Promise<MarkdownDocument[]> - Array of processed content items with frontmatter
 */
export const loadContentFromDirectory = async (
  directory: fs.PathLike,
  type: string
): Promise<MarkdownDocument[]> => {
  try {
    if (!fs.existsSync(directory)) {
      console.error(`Directory not found: ${directory}`);
      return [];
    }

    const slugs = fs.readdirSync(directory);
    const articles = await Promise.all(
      slugs.map(async (slug) => {
        try {
          const realSlug = slug.replace(/\.mdx$/, '');
          const fullPath = join(directory.toString(), `${realSlug}.mdx`);

          // Simple version of processing MDX content just to extract frontmatter
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const { data } = matter(fileContents);

          const tagsArray = (data.tags ?? []) as string[];

          return {
            slug: realSlug,
            frontmatter: {
              ...data,
              tags: tagsArray?.map((tag: string) => parseTag(tag)) || [],
              type,
              slug: realSlug,
            },
          } as MarkdownDocument;
        } catch (error) {
          console.error(`Error processing ${slug}:`, error);
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
        return 1;
      }
      if (isNaN(dateB.getTime())) {
        return -1;
      }

      return compareDesc(dateA, dateB);
    });

    return validArticles;
  } catch (error) {
    console.error(`Error loading ${type}:`, error);
    return [];
  }
};
