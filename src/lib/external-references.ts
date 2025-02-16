import { join } from 'path';

import type { Article } from '../data/content-types';
import { getAllContentFromDirectory } from './content-loaders/getAllContentFromDirectory';
import { getContentBySlug } from './content-loaders/getContentBySlug';

// directory reference to `src/content/external-references`
const externalReferencesDirectory = join(
  process.cwd(),
  'src',
  'data',
  'external-references'
);

const EXTERNAL_REFERENCES_CONTENT_TYPE = 'article';

export const getExternalReferenceBySlug = async (slug: string) => {
  const reference = await getContentBySlug(
    slug,
    externalReferencesDirectory,
    EXTERNAL_REFERENCES_CONTENT_TYPE
  );
  return reference;
};

export const getAllExternalReferences = async () => {
  let articles = (await getAllContentFromDirectory(
    externalReferencesDirectory,
    EXTERNAL_REFERENCES_CONTENT_TYPE
  )) as Article[];

  // filter out articles that don't have a slug
  articles = articles?.filter((article) => article.frontmatter?.slug);

  return articles;
};

export const getAllExternalReferencesByTag = async (tag: string) => {
  const refs = await getAllExternalReferences();

  return refs.filter((article) => {
    const tags = article.frontmatter?.tags ?? [];
    return tags.includes(tag);
  });
};
