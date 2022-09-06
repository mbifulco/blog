import React from 'react';

import Link from 'next/link';

import { Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react';

import { Image, PostFeed, SEO } from '../../components';
import { DefaultLayout as Layout } from '../../components/Layouts';
import { NewsletterSignup } from '../../components/NewsletterSignup';
import NewsletterItem from '../../components/NewsletterFeed/NewsletterItem';

import { getAllNewsletters } from '../../lib/newsletters';

export async function getStaticProps() {
  const newsletters = await getAllNewsletters();

  return {
    props: {
      newsletters,
    },
  };
}

const NewsletterPage = ({ newsletters }) => (
  <Layout>
    <SEO
      title="Subscribe to Tiny Improvements: articles software dev, design, and climate"
      image={
        'https://res.cloudinary.com/mikebifulco-com/image/upload/v1662476730/newsletters/tiny-improvements-header_cg3qzg.png'
      }
    />
    <Heading as="h1" marginBottom="2rem">
      Subscribe to Tiny Improvements
    </Heading>

    <Text>
      An occasional newsletter by me, for you. You&apos;ll get my thoughts on
      design and development, building products and companies, and philosophy
      for living a life you love in an ever-changing world.
    </Text>
    <NewsletterSignup />

    <Stack direction={'column'} spacing={'0'}>
      <Heading as="h2" size="md" margin={0} padding={0}>
        Read past disptaches
      </Heading>
      <SimpleGrid minChildWidth="300px" spacing="20px" marginTop={0}>
        {newsletters.map((newsletter) => {
          const { slug } = newsletter?.frontmatter;
          return <NewsletterItem newsletter={newsletter} key={slug} />;
        })}
      </SimpleGrid>
    </Stack>

    <NewsletterSignup />
  </Layout>
);

export default NewsletterPage;
