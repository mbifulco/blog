import { join } from 'path';

import type { Newsletter } from '../data/content-types';
import {
  getAllContentFromDirectory,
  getContentBySlug,
} from './contentTypeLoader';

// directory reference to `src/content/external-references`
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
  const newsletters = (await getAllContentFromDirectory(
    newslettersDirectory,
    NEWSLETTERS_CONTENT_TYPE
  )) as Newsletter[];

  return newsletters;
};

export const getAllNewslettersByTag = async (tag: string) => {
  const refs = await getAllNewsletters();

  return refs.filter((article) => [...article.frontmatter.tags].includes(tag));
};
