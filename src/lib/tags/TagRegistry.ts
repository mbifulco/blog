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

  /**
   * Get the total content count for a tag
   *
   * @param tag - The tag to count
   * @returns number - Total number of content items with this tag
   */
  getTagContentCount(tag: string): number {
    const content = this.tags[tag];
    if (!content) return 0;
    return content.post.length + content.newsletter.length + content.article.length;
  }

  /**
   * Get top tags sorted by content count
   *
   * @param limit - Maximum number of tags to return (default: 10)
   * @returns Array of {tag, count} objects sorted by count descending
   */
  getTopTags(limit: number = 10): { tag: string; count: number }[] {
    const tagCounts = Object.keys(this.tags).map((tag) => ({
      tag,
      count: this.getTagContentCount(tag),
    }));

    return tagCounts
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }
}
