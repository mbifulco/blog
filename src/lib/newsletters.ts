import { join } from 'path';

import { ContentTypes } from '../data/content-types';
import type { MarkdownDocument, Newsletter } from '../data/content-types';
import { getAllContentFromDirectory } from './content-loaders/getAllContentFromDirectory';
import { getContentBySlug } from './content-loaders/getContentBySlug';
import type  { PaginationOptions, PaginatedResult } from '../utils/pagination';
import { paginate } from '../utils/pagination';

// directory reference to `src/content/newsletters`
export const newslettersDirectory = join(
  process.cwd(),
  'src',
  'data',
  'newsletters'
);

// Helper function to safely process raw content into newsletters
export const processNewslettersContent = (
  rawContent: MarkdownDocument[]
): Newsletter[] => {
  if (!rawContent) {
    console.warn('processNewslettersContent: content is null or undefined');
    return [];
  }

  if (!Array.isArray(rawContent)) {
    console.warn(
      `processNewslettersContent: content is not an array, got ${typeof rawContent}`
    );
    return [];
  }

  // filter out newsletters that don't have a slug
  return rawContent.filter((newsletter) => {
    if (!newsletter) {
      console.warn(
        'processNewslettersContent: found null/undefined newsletter entry'
      );
      return false;
    }

    if (!newsletter.frontmatter?.slug) {
      console.warn(
        'processNewslettersContent: found newsletter without slug:',
        JSON.stringify(newsletter.frontmatter, null, 2)
      );
      return false;
    }

    return true;
  }) as Newsletter[];
};

export const getNewsletterBySlug = async (slug: string) => {
  const reference = await getContentBySlug(
    slug,
    newslettersDirectory,
    ContentTypes.Newsletter
  );
  return reference as Newsletter;
};

export const getAllNewsletters = async () => {
  try {
    const rawContent = await getAllContentFromDirectory(
      newslettersDirectory,
      ContentTypes.Newsletter
    );
    return processNewslettersContent(rawContent);
  } catch (error) {
    console.error('Error in getAllNewsletters:', error);
    // Re-throw the error to be handled by the page's error boundary
    throw error;
  }
};

export const getPaginatedNewsletters = async (options: PaginationOptions = {}): Promise<PaginatedResult<Newsletter>> => {
  const allNewsletters = await getAllNewsletters();
  return paginate(allNewsletters, options);
};
