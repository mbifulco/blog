import React from 'react';
import PropTypes from 'prop-types';

import { Box, Heading, Stack, Text, useTheme } from '@chakra-ui/react';

import { ExternalWorkItem } from '../components/ExternalWork';
import SEO from '../components/seo';

import { getAllExternalReferences } from '../lib/external-references';

export async function getStaticProps() {
  const articles = await getAllExternalReferences();

  return {
    props: {
      articles,
    },
  };
}

const WorkPage = ({ articles }) => {
  const theme = useTheme();
  return (
    <>
      <SEO title="My work from around the web" canonical="/work" />
      <Stack>
        <Heading as="h1">Some samples of my work online</Heading>
        <Box>
          <Text maxWidth="75ch" marginBottom="2rem">
            This page contains articles, videos, and other references to my work
            over the years. {"I'm"} extremely lucky to be able to say that the
            nature of some of my work is that it is recorded for the public to
            see, and that {"I've"} made news headlines from time to time (for
            good reasons!) &mdash; {"there's"} quite a bit of my work that{' '}
            {"isn't"} represented here, too. {"I'm"} always happy to talk shop.{' '}
            <a href="mailto:hello@mikebifulco.com">drop me a line</a> if{' '}
            {"you'd"} like to know more!
          </Text>
        </Box>
        <Stack spacing="2rem">
          {articles.map((article) => (
            <ExternalWorkItem article={article} border key={article.slug} />
          ))}
        </Stack>
      </Stack>
    </>
  );
};

WorkPage.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.shape({})),
};

export default WorkPage;
