// get metadata about post series
import { compareAsc } from 'date-fns';
import slugify from 'slugify';
import { BlogPost, Newsletter } from 'src/data/content-types';

import { getAllPosts } from './blog';
import { getAllNewsletters } from './newsletters';

const getAllSeries = async () => {
  const allPosts = await getAllPosts();
  const allNewsletters = await getAllNewsletters();

  const postsInAnySeries = allPosts.filter(
    (post) => post.frontmatter.series !== undefined
  );
  const newslettersInAnySeries = allNewsletters.filter(
    (newsletter) => newsletter.frontmatter.series !== undefined
  );

  let seriesNames = [...postsInAnySeries, ...newslettersInAnySeries]
    .map((item) => item.frontmatter.series)
    .filter((series) => series !== undefined);

  const uniqueSeries = [
    ...new Set(seriesNames.map((series) => getSlugForSeries(series))),
  ];

  const seriesMap = uniqueSeries.map((series) => {
    return {
      name: series,
      posts: postsInAnySeries
        .filter((post) => post.frontmatter.series === series)
        .sort((a, b) => {
          return compareAsc(
            new Date(b.frontmatter.date),
            new Date(a.frontmatter.date)
          );
        }),
      newsletters: newslettersInAnySeries
        .filter((newsletter) => newsletter.frontmatter.series === series)
        .sort((a, b) => {
          return compareAsc(
            new Date(b.frontmatter.date),
            new Date(a.frontmatter.date)
          );
        }),
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

/**
 * Get all posts for a series based on its long or slugified name
 */
export const getAllPostsForSeries = async (seriesName: string) => {
  const allSeries = await getAllSeries();
  return allSeries.find(
    (series) => getSlugForSeries(series.name) === getSlugForSeries(seriesName)
  );
};

export const getSlugForSeries = (seriesName: string) => {
  return slugify(seriesName);
};
