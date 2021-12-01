import { getAllPosts } from './blog';
import { getAllExternalReferences } from './external-references';

export const parseTag = (tag) => {
  return tag.split(' ').join('-').toLocaleLowerCase();
};

export const getAllTags = async () => {
  const blogPostTags = new Set();
  const articleTags = new Set();

  const allPosts = await getAllPosts();
  const allExternalReferences = await getAllExternalReferences();

  allPosts.forEach((post) => {
    post?.frontmatter?.tags?.forEach((tag) => blogPostTags.add(parseTag(tag)));
  });

  allExternalReferences.forEach((externalReference) => {
    externalReference?.frontmatter?.tags.forEach((tag) =>
      articleTags.add(parseTag(tag))
    );
  });

  return {
    allTags: new Set([...blogPostTags, ...articleTags]),
    postTags: blogPostTags,
    externalReferenceTags: articleTags,
  };
};
