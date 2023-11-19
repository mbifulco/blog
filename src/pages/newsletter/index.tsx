import type { GetStaticProps } from 'next';
import { Box, SimpleGrid, Spacer, Stack, Text } from '@chakra-ui/react';

import { Heading } from '@components/Heading';
import NewsletterItem from '../../components/NewsletterFeed/NewsletterItem';
import { NewsletterSignup } from '../../components/NewsletterSignup';
import SEO from '../../components/seo';
import SponsorCTA from '../../components/SponsorCTA/SponsorCTA';
import { SubscriptionForm } from '../../components/SubscriptionForm';
import { Subtitle } from '../../components/Subtitle';
import config from '../../config';
import type { Newsletter } from '../../data/content-types';
import useConvertKitStats from '../../hooks/useConvertKitStats';
import { getAllNewsletters } from '../../lib/newsletters';

export const getStaticProps: GetStaticProps<NewsletterPageProps> = async () => {
  const newsletters = await getAllNewsletters();

  return {
    props: {
      newsletters,
    },
  };
};

type NewsletterPageProps = {
  newsletters: Newsletter[];
};

const NewsletterPage: React.FC<NewsletterPageProps> = ({ newsletters }) => {
  const { stats } = useConvertKitStats();

  const [latestNewsletter, ...pastNewsletters] = newsletters;

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
          <Heading as="h1">
            <span role="img" aria-label="heart envelope emoji">
              💌
            </span>{' '}
            Tiny Improvements
          </Heading>
          <Subtitle>{config.newsletter.tagline}</Subtitle>
        </Box>
        <Text fontSize={'xl'}>{config.newsletter.shortDescription}</Text>
        <Text fontSize={'xl'}>
          Join{' '}
          <span style={{ fontWeight: 'bold' }}>
            {stats?.subscriberCount ?? 'the'} other product builders
          </span>{' '}
          and get it delivered straight to your inbox by filling out this happy
          lil&apos; form:
        </Text>
      </Stack>
      <SubscriptionForm />

      <SponsorCTA />

      <Stack direction={'column'} spacing={'4'}>
        <Heading as="h2">💌 Read the latest dispatch</Heading>
        <NewsletterItem newsletter={latestNewsletter} />
        <Spacer />

        <Heading as="h2" className="m-0 p-0">
          Read past disptaches
        </Heading>
        <SimpleGrid minChildWidth="300px" spacing="20px" marginTop={0}>
          {pastNewsletters.map((newsletter) => {
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
