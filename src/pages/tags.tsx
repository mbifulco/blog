// Components
import type { NextPage } from 'next';
import { Heading, SimpleGrid, Text, useTheme } from '@chakra-ui/react';

import { getAllTags } from '../lib/tags';

import Tag from '../components/tag';
import { NewsletterSignup } from '../components/NewsletterSignup';
import SEO from '../components/seo';
import { GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps = async () => {
  const tags = await getAllTags();
  return {
    props: {
      tags: Array.from(tags.allTags).sort(),
    },
  };
};

type TagsPageProps = {
  tags: string[];
};

const TagsPage: NextPage<TagsPageProps> = ({ tags }) => {
  const theme = useTheme();

  return (
    <>
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
          <Tag key={`tag-cloud-${tag}`} url={`/tags/${tag}/`}>
            {tag}
          </Tag>
        ))}
      </SimpleGrid>
      <NewsletterSignup />
    </>
  );
};

export default TagsPage;
