import { getTagRegistryForAllContent } from './getTagRegistryForAllContent';
import { parseTag } from './utils';

/**
 * Get all unique tags across all content types
 *
 * @returns Promise<string[]> Array of all unique tags, sorted alphabetically
 */
export const getAllTags = async (): Promise<string[]> => {
  const tagRegistry = await getTagRegistryForAllContent();
  return tagRegistry.getAllTags();
};

/**
 * Get all content associated with a specific tag
 *
 * @param tag - The tag to look up
 * @returns Promise<Record<ContentType, string[]>> - Content slugs by type
 */
export const getContentForTag = async (tag: string) => {
  const tagRegistry = await getTagRegistryForAllContent();
  return tagRegistry.getContentForTag(tag);
};

// Re-export utility functions
export { parseTag };
