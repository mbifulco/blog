import React from 'react';

import { getAllPostsByTag } from '../../lib/blog';
import { DefaultLayout } from '../../components/Layouts';
import { SEO } from '../../components';
import { Heading, Text, useTheme } from '@chakra-ui/react';
import { getAllTags } from '../../lib/tags';
import { Box } from '@chakra-ui/react';
import { getAllExternalReferencesByTag } from '../../lib/external-references';
import { Post, ExternalWorkItem } from '../../components';

export async function getStaticProps({ params }) {
  const { tag } = params;

  const articles = await getAllExternalReferencesByTag(tag);

  return {
    props: {
      tag,
      posts: getAllPostsByTag(tag),
      articles,
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

const TagPage = ({ tag, posts, articles }) => {
  const theme = useTheme();

  let all = [...posts, ...articles].sort((a, b) => {
    return new Date(b.frontmatter.date) - new Date(a.frontmatter.date);
  });

  return (
    <DefaultLayout>
      <SEO title={`#${tag}: ${posts.length} Articles`} />
      <Heading as="h1">
        <Text as="span" color={theme.colors.gray[400]}>
          #
        </Text>
        <Text as="span">{tag}</Text>
        <Text as="span">: {all.length} posts tagged</Text>
      </Heading>
      <Box>
        {all.map((content) => {
          switch (content.frontmatter.type) {
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
      </Box>
    </DefaultLayout>
  );
};

export default TagPage;
