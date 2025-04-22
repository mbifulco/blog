import { join } from 'path';

import { ContentTypes } from '@data/content-types';
import type { MarkdownDocument } from '@data/content-types';
import { loadContentFromDirectory } from './loadContentFromDirectory';
import { TagRegistry } from './TagRegistry';

/**
 * Helper function to extract tags from a content item
 */
const extractTags = (content: MarkdownDocument): string[] => {
  if (!content) return [];

  const tags = content?.frontmatter?.tags;
  if (!tags) return [];

  if (!Array.isArray(tags)) return [];

  return tags;
};

/**
 * Builds a tag registry containing all tags across content types
 *
 * @returns Promise<TagRegistry> - A populated tag registry
 */
export const getTagRegistryForAllContent = async (): Promise<TagRegistry> => {
  const tagRegistry = new TagRegistry();

  // Get all posts and extract tags
  try {
    const postsDir = join(process.cwd(), 'src', 'data', 'posts');
    const posts = await loadContentFromDirectory(postsDir, 'post');

    posts.forEach((post) => {
      const postTags = extractTags(post);
      if (!postTags) return;

      postTags.forEach((tag) =>
        tagRegistry.addTag(tag, post.slug, ContentTypes.Post)
      );
    });
  } catch (error) {
    console.error('Error in getAllTags for posts:', error);
  }

  // Get all newsletters and extract tags
  try {
    const newslettersDir = join(process.cwd(), 'src', 'data', 'newsletters');
    const newsletters = await loadContentFromDirectory(
      newslettersDir,
      'newsletter'
    );

    newsletters.forEach((newsletter) => {
      const newsletterTags = extractTags(newsletter);
      if (!newsletterTags) return;

      newsletterTags.forEach((tag) =>
        tagRegistry.addTag(tag, newsletter.slug, ContentTypes.Newsletter)
      );
    });
  } catch (error) {
    console.error('Error in getAllTags for newsletters:', error);
  }

  // Get all external reference articles and extract tags
  try {
    const articlesDir = join(
      process.cwd(),
      'src',
      'data',
      'external-references'
    );
    const articles = await loadContentFromDirectory(articlesDir, 'article');

    articles.forEach((article) => {
      const articleTags = extractTags(article);
      if (!articleTags) return;

      articleTags.forEach((tag) =>
        tagRegistry.addTag(tag, article.slug, ContentTypes.Article)
      );
    });
  } catch (error) {
    console.error(
      'Error in getAllTags for external reference articles:',
      error
    );
  }

  return tagRegistry;
};
