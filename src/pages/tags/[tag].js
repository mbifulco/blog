import React from 'react';
import { Heading, Text, useTheme } from '@chakra-ui/react';

import { getAllPostsByTag } from '../../lib/blog';
import { getAllTags } from '../../lib/tags';
import { Stack } from '@chakra-ui/react';
import { getAllExternalReferencesByTag } from '../../lib/external-references';
import { getAllNewslettersByTag } from '../../lib/newsletters';

import NewsletterItem from '../../components/NewsletterFeed/NewsletterItem';
import SEO from '../../components/seo';
import { BlogPost as Post } from '../../components/Post';
import { ExternalWorkItem } from '../../components/ExternalWork';

export async function getStaticProps({ params }) {
  const { tag } = params;

  const posts = await getAllPostsByTag(tag);
  const articles = await getAllExternalReferencesByTag(tag);
  const newsletters = await getAllNewslettersByTag(tag);

  return {
    props: {
      tag,
      posts,
      articles,
      newsletters,
    },
  };
}

export async function getStaticPaths() {
  const tags = await getAllTags();

  const { allTags } = tags;

  const paths = [];

  for (let tag of allTags) {
    paths.push({
      params: {
        tag,
      },
    });
  }

  return {
    paths,
    fallback: false,
  };
}

const TagPage = ({ tag, posts, articles, newsletters }) => {
  const theme = useTheme();

  let all = [...posts, ...articles, ...newsletters].sort((a, b) => {
    return new Date(b.frontmatter.date) - new Date(a.frontmatter.date);
  });

  return (
    <>
      <SEO
        title={`#${tag}: ${all.length} posts, articles, and videos`}
        description={`Posts, articles, and videos tagged with ${tag} for designers and developers building great things on the web.`}
      />
      <Heading as="h1">
        <Text as="span" color={theme.colors.gray[400]}>
          #
        </Text>
        <Text as="span">{tag}</Text>
        <Text as="span">: {all.length} posts tagged</Text>
      </Heading>
      <Stack spacing={8}>
        {all.map((content) => {
          switch (content.frontmatter.type) {
            case 'newsletter': {
              return (
                <NewsletterItem
                  key={`newsletter-${content.frontmatter.path}`}
                  newsletter={content}
                />
              );
            }
            case 'post':
              return (
                <Post
                  post={content}
                  key={`post-${content.frontmatter.path}`}
                  summary
                />
              );
            case 'article':
              return (
                <ExternalWorkItem
                  article={content}
                  key={`article-${content.frontmatter.title}`}
                />
              );
            default:
              break;
          }
        })}
      </Stack>
    </>
  );
};

export default TagPage;
