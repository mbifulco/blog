import React from 'react';
import PropTypes from 'prop-types';

import { Box, useTheme } from '@chakra-ui/react';
import { serialize } from 'next-mdx-remote/serialize';

import { DefaultLayout } from '../components/Layouts';
import { ExternalWorkFeed, SEO } from '../components';

import { getAllExternalReferences } from '../lib/external-references';

export async function getStaticProps() {
  const articles = await Promise.all(
    getAllExternalReferences().map(async (article) => {
      const mdxSource = await serialize(article.content);
      return {
        ...article,
        source: mdxSource,
      };
    })
  );

  return {
    props: {
      articles,
    },
  };
}

const WorkPage = ({ articles }) => {
  const theme = useTheme();
  return (
    <DefaultLayout>
      <SEO title="My work from around the web" />
      <Box>
        <ExternalWorkFeed articles={articles} />
      </Box>
    </DefaultLayout>
  );
};

WorkPage.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.shape({})),
};

export default WorkPage;
