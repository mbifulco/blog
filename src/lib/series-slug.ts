import slugify from 'slugify';

/**
 * Slug used in /series/[slug] URLs for a series name from frontmatter.
 *
 * Kept free of content-loading imports so client code (e.g. structured data)
 * can build series URLs without pulling in the filesystem loaders.
 */
export const getSlugForSeries = (seriesName: string) => {
  return slugify(seriesName.toLowerCase());
};
