import React from 'react';

import { getAllPostsByTag } from '../../lib/blog';
import { DefaultLayout } from '../../components/Layouts';
import { SEO } from '../../components';
import { Heading, Text } from '@chakra-ui/layout';
import { getAllTags } from '../../lib/tags';
import { Box } from '@chakra-ui/react';
import { getAllExternalReferencesByTag } from '../../lib/external-references';

export async function getStaticProps({ params }) {
  const { tag } = params;

  return {
    props: {
      tag,
      posts: getAllPostsByTag(tag),
      articles: getAllExternalReferencesByTag(tag),
    },
  };
}

export async function getStaticPaths() {
  const tags = await getAllTags();

  console.log(tags);

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
  return (
    <DefaultLayout>
      <SEO title={`#${tag}: ${posts.length} Articles`} />
      <Heading as="h1">
        <Text as="span">#</Text>
        <Text as="span">{tag}</Text>
      </Heading>
      <Box>
        <Text>{posts.length} posts</Text>
        <Text>{articles.length} articles</Text>
      </Box>
    </DefaultLayout>
  );
};

export default TagPage;
