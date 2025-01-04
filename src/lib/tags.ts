import { getAllPosts } from './blog';
import { getAllNewsletters } from './newsletters';

export const parseTag = (tag: string) => {
  return tag.split(' ').join('-').toLocaleLowerCase();
};

export const getAllTags = async () => {
  const allTags = new Set<string>();
  const allContent = [...(await getAllPosts()), ...(await getAllNewsletters())];

  allContent.forEach((content) => {
    content?.frontmatter?.tags?.forEach((tag) => allTags.add(parseTag(tag)));
  });

  const uniqueTags = Array.from(allTags).sort();

  return uniqueTags;
};
