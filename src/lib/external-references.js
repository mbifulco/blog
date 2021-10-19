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

export const getAllExternalReferencesBySlug = (slug) =>
  getContentBySlug(slug, externalReferencesDirectory);

export const getAllExternalReferences = () => {
  return getAllContentFromDirectory(externalReferencesDirectory).map(
    (article) => {
      return {
        ...article,
      };
    }
  );
};

export const getAllExternalReferencesByTag = (tag) =>
  getAllExternalReferences().filter(
    (article) => article?.frontmatter?.tags?.includes(tag) || []
  );
