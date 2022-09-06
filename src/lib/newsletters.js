import { join } from 'path';

import {
  getAllContentFromDirectory,
  getContentBySlug,
} from './contentTypeLoader';

// directory reference to `src/content/external-references`
const newslettersDirectory = join(process.cwd(), 'src', 'data', 'newsletters');

const NEWSLETTERS_CONTENT_TYPE = 'newsletter';

export const getNewsletterBySlug = async (slug) => {
  const reference = await getContentBySlug(
    slug,
    newslettersDirectory,
    NEWSLETTERS_CONTENT_TYPE
  );
  return reference;
};

export const getAllNewsletters = async () => {
  return await getAllContentFromDirectory(
    newslettersDirectory,
    NEWSLETTERS_CONTENT_TYPE
  );
};

export const getAllNewslettersByTag = async (tag) => {
  const refs = await getAllNewsletters();

  return refs.filter((article) => [...article.frontmatter?.tags].includes(tag));
};
