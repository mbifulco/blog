import { join } from 'path';

import { ContentTypes } from '../data/content-types';
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

export const getExternalReferenceBySlug = async (slug: string) => {
  const reference = await getContentBySlug(
    slug,
    externalReferencesDirectory,
    ContentTypes.Article
  );
  return reference as Article;
};

export const getAllExternalReferences = async () => {
  let articles = (await getAllContentFromDirectory(
    externalReferencesDirectory,
    ContentTypes.Article
  )) as Article[];

  // filter out articles that don't have a slug
  articles = articles?.filter((article) => article.frontmatter?.slug);

  return articles;
};
