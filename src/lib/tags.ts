import { join } from 'path';

import { ContentTypes } from '@data/content-types';
import type { ContentType, MarkdownDocument } from '@data/content-types';

export const parseTag = (tag: string) => {
  return tag.split(' ').join('-').toLocaleLowerCase();
};

// Import moved here to avoid circular dependency
import { getAllContentFromDirectory } from './content-loaders/getAllContentFromDirectory';

export const getAllTags = async () => {
  const tagRegistry = await getTagRegistryForAllContent();
  // Convert to array and sort
  const uniqueTags = tagRegistry.getAllTags();

  return uniqueTags;
};

export const getContentForTag = async (tag: string) => {
  const tagRegistry = await getTagRegistryForAllContent();

  return tagRegistry.getContentForTag(tag);
};

const getTagRegistryForAllContent = async () => {
  const tagRegistry = new TagRegistry();

  // helper function to extract tags from a content item
  const extractTags = (content: MarkdownDocument) => {
    if (!content) return [];

    const tags = content?.frontmatter?.tags;
    if (!tags) return [];

    if (!Array.isArray(tags)) return [];

    return tags;
  };

  // Get all posts and extract tags
  try {
    const postsDir = join(process.cwd(), 'src', 'data', 'posts');
    const posts = await getAllContentFromDirectory(postsDir, 'post');

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
    const newsletters = await getAllContentFromDirectory(
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
    const articles = await getAllContentFromDirectory(articlesDir, 'article');

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

type TaggedContentSlugs = Record<ContentType, string[]>;

type TagRegistryStorage = {
  [tag: string]: TaggedContentSlugs;
};

/*

Tag library looks like this:
{
  "tag1": {
    "post": ["slug1", "slug2"],
    "newsletter": ["slug3", "slug4"]
  },
  "tag2": {
    "post": ["slug1", "slug2"],
    "newsletter": ["slug3", "slug4"]
  }
}
*/

class TagRegistry {
  // Map of tag name to content paths
  private tags: TagRegistryStorage = {};

  constructor() {
    this.tags = {};
  }

  addTag(tag: string, slug: string, contentType: ContentType) {
    // Initialize the array if it doesn't exist
    this.tags[tag] = this.tags[tag] || {
      post: [],
      article: [],
      newsletter: [],
    };

    // Add the slug to the tag
    this.tags[tag][contentType].push(slug);
  }

  // Return a list of content paths for a given tag
  getContentForTag(tag: string) {
    const content = this.tags[tag] || {
      post: [],
      article: [],
      newsletter: [],
    };

    return content;
  }

  // Return a list of all tags sorted alphabetically
  getAllTags() {
    return Object.keys(this.tags).sort();
  }
}
