import React from 'react';
import PropTypes from 'prop-types';

// Components
import Link from 'next/link';
import { Heading, SimpleGrid, Text, useTheme } from '@chakra-ui/react';

import { getAllTags } from '../lib/tags';

import { Tag, NewsletterSignup } from '../components';
import { DefaultLayout as Layout } from '../components/Layouts';

import { SEO } from '../components';

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
          <Link href={`/tags/${tag}/`} key={`tag-${tag}`}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a>
              <Tag>{tag}</Tag>
            </a>
          </Link>
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
