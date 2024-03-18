import type { MarkdownDocument, Newsletter } from '../data/content-types';
import { getAllPosts } from './blog';
import { getAllExternalReferences } from './external-references';
import { getAllNewsletters } from './newsletters';

export const parseTag = (tag: string) => {
  return tag.split(' ').join('-').toLocaleLowerCase();
};

export const getAllTags = async () => {
  const blogPostTags = new Set<string>();
  const articleTags = new Set<string>();
  const newsletterTags = new Set<string>();

  const allPosts = await getAllPosts();
  const allExternalReferences = await getAllExternalReferences();
  const allNewsletters = await getAllNewsletters();

  allPosts.forEach((post) => {
    post?.frontmatter?.tags?.forEach((tag) => blogPostTags.add(parseTag(tag)));
  });

  allExternalReferences.forEach((externalReference: MarkdownDocument) => {
    externalReference?.frontmatter?.tags?.forEach((tag) =>
      articleTags.add(parseTag(tag))
    );
  });

  allNewsletters.forEach((newsletter: Newsletter) => {
    newsletter?.frontmatter?.tags.forEach((tag) =>
      newsletterTags.add(parseTag(tag))
    );
  });

  const allTags = new Set([...blogPostTags, ...articleTags, ...newsletterTags]);

  const uniqueTags = Array.from(allTags).sort();

  return {
    allTags: uniqueTags,
    postTags: blogPostTags,
    externalReferenceTags: articleTags,
    newsletterTags: newsletterTags,
  };
};
