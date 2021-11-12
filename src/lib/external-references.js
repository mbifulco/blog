import { join } from 'path';

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

export const getExternalReferenceBySlug = async (slug) => {
  const reference = await getContentBySlug(
    slug,
    externalReferencesDirectory,
    EXTERNAL_REFERENCES_CONTENT_TYPE
  );
  return reference;
};

export const getAllExternalReferences = async () => {
  return await getAllContentFromDirectory(
    externalReferencesDirectory,
    EXTERNAL_REFERENCES_CONTENT_TYPE
  );
};

export const getAllExternalReferencesByTag = async (tag) => {
  const refs = await getAllExternalReferences();

  return refs.filter((article) => [...article.frontmatter?.tags].includes(tag));
};
