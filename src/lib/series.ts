// get metadata about post series
import { compareAsc } from 'date-fns';
import slugify from 'slugify';
import type { BlogPost, Newsletter } from 'src/data/content-types';

import { getAllPosts } from './blog';
import { getAllNewsletters } from './newsletters';

export const getAllSeries = async (): Promise<Series[]> => {
  const allPosts = await getAllPosts();
  const allNewsletters = await getAllNewsletters();

  const postsInAnySeries = allPosts.filter(
    (post) => post.frontmatter.series !== undefined
  );
  const newslettersInAnySeries = allNewsletters.filter(
    (newsletter) => newsletter.frontmatter.series !== undefined
  );

  const seriesNames = [...postsInAnySeries, ...newslettersInAnySeries]
    .map((item) => item.frontmatter.series)
    .filter((seriesName) => seriesName !== undefined);

  const uniqueSeries = [
    ...new Set(seriesNames.map((seriesName) => seriesName)),
  ];

  const seriesMap = uniqueSeries.map((seriesName) => {
    const slug = getSlugForSeries(seriesName);
    const posts = postsInAnySeries
      .filter(
        (post) =>
          post.frontmatter.series &&
          getSlugForSeries(post.frontmatter.series) === slug
      )
      .sort((a, b) => {
        return compareAsc(
          new Date(b.frontmatter.date),
          new Date(a.frontmatter.date)
        );
      });

    const newsletters = newslettersInAnySeries
      .filter(
        (newsletter) =>
          newsletter.frontmatter.series &&
          getSlugForSeries(newsletter.frontmatter.series) === slug
      )
      .sort((a, b) => {
        return compareAsc(
          new Date(b.frontmatter.date),
          new Date(a.frontmatter.date)
        );
      });

    return {
      name: seriesName,
      slug,
      posts: posts,
      newsletters: newsletters,
      length: posts.length + newsletters.length,
    };
  });

  return seriesMap;
};

/**
 * Check if a post is in a series by checking is the full string series name of a post
 * matches the slugified series name seen in URLs
 */
export const isInSpecificSeries = (
  post: BlogPost | Newsletter,
  seriesName: string
) => {
  if (
    post.frontmatter.series === undefined ||
    post.frontmatter.series === null ||
    post.frontmatter.series === ''
  ) {
    return false;
  }

  return getSlugForSeries(post.frontmatter.series) === seriesName;
};

export type Series = {
  name: string;
  slug: string;
  posts: BlogPost[];
  newsletters: Newsletter[];
  length: number;
};

/**
 * Get all posts for a series based on its long or slugified name
 */
export const getSeries = async (
  seriesName: string
): Promise<Series | undefined> => {
  const allSeries = await getAllSeries();

  const postsInSeries = allSeries.find(
    (series) => getSlugForSeries(series.name) === getSlugForSeries(seriesName)
  );

  console.log(
    `Found ${postsInSeries?.posts.length} posts in "${seriesName}" series`
  );

  return postsInSeries;
};

export const getSlugForSeries = (seriesName: string) => {
  return slugify(seriesName.toLowerCase());
};
