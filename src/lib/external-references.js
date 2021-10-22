import { join } from 'path';
import { serialize } from 'next-mdx-remote/serialize';

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

export const getExternalReferenceBySlug = async (slug) => {
  const reference = await getContentBySlug(
    slug,
    externalReferencesDirectory,
    'article'
  );
  return reference;
};

export const getAllExternalReferences = async () => {
  return await getAllContentFromDirectory(
    externalReferencesDirectory,
    'article'
  );
};

export const getAllExternalReferencesByTag = async (tag) => {
  const refs = await getAllExternalReferences();

  return refs.filter(
    (article) => article?.frontmatter?.tags?.includes(tag) || []
  );
};
