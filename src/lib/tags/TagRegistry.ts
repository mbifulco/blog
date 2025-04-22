import type { ContentType } from '@data/content-types';

type TaggedContentSlugs = Record<ContentType, string[]>;

type TagRegistryStorage = {
  [tag: string]: TaggedContentSlugs;
};

/**
 * Class for managing tag registrations and lookups
 */
export class TagRegistry {
  // Map of tag name to content paths
  private tags: TagRegistryStorage = {};

  constructor() {
    this.tags = {};
  }

  /**
   * Add a tag for a specific content item
   *
   * @param tag - The tag to register
   * @param slug - The content slug
   * @param contentType - The type of content (post, newsletter, article)
   */
  addTag(tag: string, slug: string, contentType: ContentType): void {
    // Initialize the array if it doesn't exist
    this.tags[tag] = this.tags[tag] || {
      post: [],
      article: [],
      newsletter: [],
    };

    // Add the slug to the tag
    this.tags[tag][contentType].push(slug);
  }

  /**
   * Get all content paths for a specific tag
   *
   * @param tag - The tag to look up
   * @returns TaggedContentSlugs - Object with content slugs by type
   */
  getContentForTag(tag: string): TaggedContentSlugs {
    const content = this.tags[tag] || {
      post: [],
      article: [],
      newsletter: [],
    };

    return content;
  }

  /**
   * Get all registered tags
   *
   * @returns string[] - Array of all tags, sorted alphabetically
   */
  getAllTags(): string[] {
    return Object.keys(this.tags).sort();
  }
}
