import { getAllPosts } from './blog';
import { getAllNewsletters } from './newsletters';

export const parseTag = (tag: string) => {
  return tag.split(' ').join('-').toLocaleLowerCase();
};

export const getAllTags = async () => {
  try {
    // Safely fetch content with fallbacks
    const posts = await getAllPosts().catch(() => []);
    const newsletters = await getAllNewsletters().catch(() => []);

    const allTags = new Set<string>();
    const allContent = [...posts, ...newsletters];

    // More defensive processing of content
    allContent.forEach((content) => {
      const tags = content?.frontmatter?.tags;
      if (!tags) return;

      if (!Array.isArray(tags)) return;

      tags.forEach((tag) => {
        if (typeof tag === 'string') {
          const parsedTag = parseTag(tag);
          if (parsedTag) {
            allTags.add(parsedTag);
          }
        }
      });
    });

    // Convert to array and sort
    const uniqueTags = Array.from(allTags).filter(Boolean).sort();

    return uniqueTags;
  } catch (error) {
    console.error('Error in getAllTags:', error);
    return [];
  }
};
