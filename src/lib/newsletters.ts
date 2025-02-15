import { join } from 'path';

import type { Newsletter } from '../data/content-types';
import {
  getAllContentFromDirectory,
  getContentBySlug,
} from './contentTypeLoader';

// directory reference to `src/content/newsletters`
const newslettersDirectory = join(process.cwd(), 'src', 'data', 'newsletters');

const NEWSLETTERS_CONTENT_TYPE = 'newsletter';

export const getNewsletterBySlug = async (slug: string) => {
  const reference = await getContentBySlug(
    slug,
    newslettersDirectory,
    NEWSLETTERS_CONTENT_TYPE
  );
  return reference as Newsletter;
};

export const getAllNewsletters = async () => {
  let newsletters = (await getAllContentFromDirectory(
    newslettersDirectory,
    NEWSLETTERS_CONTENT_TYPE
  )) as Newsletter[];

  // filter out newsletters that don't have a slug
  newsletters = newsletters?.filter(
    (newsletter) => newsletter.frontmatter?.slug
  );

  return newsletters;
};

export const getAllNewslettersByTag = async (tag: string) => {
  try {
    // Use the safe directory reader
    const newsletters = await getAllNewsletters();
    return newsletters.filter((newsletter) =>
      newsletter.frontmatter.tags?.includes(tag)
    );
  } catch (error) {
    console.error('Error getting newsletters by tag:', error);
    return [];
  }
};
