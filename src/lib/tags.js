import { getAllPosts } from './blog';
import { getAllExternalReferences } from './external-references';
import { getAllNewsletters } from './newsletters';

export const parseTag = (tag) => {
  return tag.split(' ').join('-').toLocaleLowerCase();
};

export const getAllTags = async () => {
  const blogPostTags = new Set();
  const articleTags = new Set();
  const newsletterTags = new Set();

  const allPosts = await getAllPosts();
  const allExternalReferences = await getAllExternalReferences();
  const allNewsletters = await getAllNewsletters();

  allPosts.forEach((post) => {
    post?.frontmatter?.tags?.forEach((tag) => blogPostTags.add(parseTag(tag)));
  });

  allExternalReferences.forEach((externalReference) => {
    externalReference?.frontmatter?.tags.forEach((tag) =>
      articleTags.add(parseTag(tag))
    );
  });

  allNewsletters.forEach((newsletter) => {
    newsletter?.frontmatter?.tags.forEach((tag) =>
      newsletterTags.add(parseTag(tag))
    );
  });

  return {
    allTags: new Set([...blogPostTags, ...articleTags, ...newsletterTags]),
    postTags: blogPostTags,
    externalReferenceTags: articleTags,
    newsletterTags: newsletterTags,
  };
};
