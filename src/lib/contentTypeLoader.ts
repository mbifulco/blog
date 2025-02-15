import fs from 'fs';
import { join } from 'path';
import { compareDesc } from 'date-fns';
import matter from 'gray-matter';

import type { MarkdownDocument } from '../data/content-types';
import { getHeadings, serialize } from '../utils/mdx';
import { parseTag } from './tags';

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

    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const { data, content } = matter(fileContents);

    const { date, tags } = data;
    const articleDate = new Date(date as string);

    if (isNaN(articleDate.getTime())) {
      console.warn(`getContentBySlug: Invalid date for ${realSlug}: ${date}`);
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
  } catch (error) {
    console.error(`getContentBySlug: Error processing ${slug}:`, error);
    throw error;
  }
};

export async function getAllContentFromDirectory(
  directory: fs.PathLike,
  type: string
) {
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
          return await getContentBySlug(slug, directory, type);
        } catch (error) {
          console.error(
            `getAllContentFromDirectory: Error processing ${slug}:`,
            error
          );
          return null;
        }
      })
    );

    // Filter out null entries from failed processing
    const validArticles = articles.filter(
      (article): article is MarkdownDocument => {
        if (!article) {
          console.warn('getAllContentFromDirectory: Filtered out null article');
          return false;
        }
        return true;
      }
    );

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

    /// filter out drafts for production
    if (process.env.NODE_ENV === 'production') {
      const publishedArticles = validArticles.filter(
        (article) => article.frontmatter?.published !== false
      );
      return publishedArticles;
    }

    return validArticles;
  } catch (error) {
    console.error(`getAllContentFromDirectory: Error loading ${type}:`, error);
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
