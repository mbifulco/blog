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
  try {
    console.log('Starting getAllNewsletters...');

    const newsletters = (await getAllContentFromDirectory(
      newslettersDirectory,
      NEWSLETTERS_CONTENT_TYPE
    )) as Newsletter[];

    console.log(`Retrieved ${newsletters?.length ?? 0} raw newsletters`);

    if (!newsletters) {
      console.warn('getAllNewsletters: newsletters is null or undefined');
      return [];
    }

    if (!Array.isArray(newsletters)) {
      console.warn(
        `getAllNewsletters: newsletters is not an array, got ${typeof newsletters}`
      );
      return [];
    }

    // filter out newsletters that don't have a slug
    const filteredNewsletters = newsletters.filter((newsletter) => {
      if (!newsletter) {
        console.warn(
          'getAllNewsletters: found null/undefined newsletter entry'
        );
        return false;
      }

      if (!newsletter.frontmatter?.slug) {
        console.warn(
          'getAllNewsletters: found newsletter without slug:',
          JSON.stringify(newsletter.frontmatter, null, 2)
        );
        return false;
      }

      return true;
    });

    console.log(`Returning ${filteredNewsletters.length} valid newsletters`);
    return filteredNewsletters;
  } catch (error) {
    console.error('Error in getAllNewsletters:', error);
    // Re-throw the error to be handled by the page's error boundary
    throw error;
  }
};

export const getAllNewslettersByTag = async (tag: string) => {
  const refs = await getAllNewsletters();

  return refs.filter((article) => {
    const tags = article.frontmatter?.tags ?? [];
    return tags.includes(tag);
  });
};
