import { join } from 'path';

import type { Article } from '../data/content-types';
import {
  getAllContentFromDirectory,
  getContentBySlug,
} from './contentTypeLoader';

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
  const articles = (await getAllContentFromDirectory(
    externalReferencesDirectory,
    EXTERNAL_REFERENCES_CONTENT_TYPE
  )) as Article[];

  return articles;
};

export const getAllExternalReferencesByTag = async (tag: string) => {
  const refs = await getAllExternalReferences();

  return refs.filter((article) => {
    const tags = article.frontmatter?.tags ?? [];
    return tags.includes(tag);
  });
};
