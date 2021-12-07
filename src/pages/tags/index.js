import React from 'react';
import PropTypes from 'prop-types';

// Components
import Link from 'next/link';
import { Heading, SimpleGrid, Text, useTheme } from '@chakra-ui/react';

import { getAllTags } from '../../lib/tags';

import { Tag, NewsletterSignup, SEO } from '../../components';
import { DefaultLayout as Layout } from '../../components/Layouts';

export const getStaticProps = async () => {
  const tags = await getAllTags();
  return {
    props: {
      tags: Array.from(tags.allTags).sort(),
    },
  };
};

const TagsPage = ({ tags }) => {
  const theme = useTheme();

  return (
    <Layout>
      <SEO title="Browse all tags used on articles" />
      <Heading as="h1">
        All{' '}
        <Text as="span" color={theme.colors.gray[400]}>
          #
        </Text>
        tags used on articles across the site
      </Heading>
      <SimpleGrid minChildWidth="15ch" spacingY="1ch" fontSize="large">
        {tags?.map((tag) => (
          <Tag url={`/tags/${tag.name || tag}/`} key={`tag-${tag.name || tag}`}>
            {tag.name || tag}
          </Tag>
        ))}
      </SimpleGrid>
      <NewsletterSignup />
    </Layout>
  );
};

TagsPage.propTypes = {
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      items: PropTypes.shape({}),
    })
  ),
};

export default TagsPage;
