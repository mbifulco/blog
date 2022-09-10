import React from 'react';

import {
  Box,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  useTheme,
} from '@chakra-ui/react';

import { Image, PostFeed, SEO } from '../../components';
import { DefaultLayout as Layout } from '../../components/Layouts';
import { NewsletterSignup } from '../../components/NewsletterSignup';
import NewsletterItem from '../../components/NewsletterFeed/NewsletterItem';

import { getAllNewsletters } from '../../lib/newsletters';
import { SubscriptionForm } from '../../components/SubscriptionForm';

export async function getStaticProps() {
  const newsletters = await getAllNewsletters();

  return {
    props: {
      newsletters,
    },
  };
}

const NewsletterPage = ({ newsletters }) => {
  const theme = useTheme();
  return (
    <Layout>
      <SEO
        title="Subscribe to Tiny Improvements: articles software dev, design, and climate"
        image={
          'https://res.cloudinary.com/mikebifulco-com/image/upload/v1662476730/newsletters/cover.png'
        }
      />

      <Stack>
        <Box as="header">
          <Heading as="h1">Tiny Improvements</Heading>
          <Text
            as="span"
            padding="0.25ch 1.5ch"
            borderRadius={'40px'}
            className="tagline"
            fontSize={'sm'}
            textTransform="uppercase"
            color={theme.colors.white}
            background={theme.colors.pink[500]}
          >
            The newsletter
          </Text>
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
    </Layout>
  );
};

export default NewsletterPage;
