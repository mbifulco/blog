import React from 'react';

import { Box, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react';

import {
  NewsletterItem,
  NewsletterSignup,
  SEO,
  Subtitle,
  SubscriptionForm,
} from '../../components';

import { getAllNewsletters } from '../../lib/newsletters';

export async function getStaticProps() {
  const newsletters = await getAllNewsletters();

  return {
    props: {
      newsletters,
    },
  };
}

const NewsletterPage = ({ newsletters }) => {
  return (
    <>
      <SEO
        title="Subscribe to Tiny Improvements: articles software dev, design, and climate"
        image={
          'https://res.cloudinary.com/mikebifulco-com/image/upload/v1662476730/newsletters/cover.png'
        }
      />

      <Stack>
        <Box as="header">
          <Heading as="h1">Tiny Improvements</Heading>
          <Subtitle>The Newsletter</Subtitle>
        </Box>
        <Text fontSize={'xl'}>
          An occasional newsletter by me, for you. You&apos;ll get my thoughts
          on designing &amp; building great products, and philosophy for living
          a life you love in an ever-changing world.
        </Text>
        <Text fontSize={'xl'}>
          Get it delivered straight to your inbox by filling out this happy
          lil&apos; form:
        </Text>
      </Stack>
      <SubscriptionForm />

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
    </>
  );
};

export default NewsletterPage;
