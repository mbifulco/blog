import {
  Box,
  Heading,
  Link,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
  theme,
} from '@chakra-ui/react';

import NewsletterItem from '../../components/NewsletterFeed/NewsletterItem';
import { NewsletterSignup } from '../../components/NewsletterSignup';
import SEO from '../../components/seo';
import { Subtitle } from '../../components/Subtitle';
import { SubscriptionForm } from '../../components/SubscriptionForm';

import { getAllNewsletters } from '../../lib/newsletters';
import config from '../../config';
import SponsorCTA from '../../components/SponsorCTA/SponsorCTA';
import useConvertKitStats from '../../hooks/useConvertKitStats';

export async function getStaticProps() {
  const newsletters = await getAllNewsletters();

  return {
    props: {
      newsletters,
    },
  };
}

const NewsletterPage = ({ newsletters }) => {
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
          <Heading as="h1">Tiny Improvements</Heading>
          <Subtitle>The Newsletter</Subtitle>
        </Box>
        <Text fontSize={'xl'}>{config.newsletter.shortDescription}</Text>
        <Text fontSize={'xl'}>
          Join{' '}
          <span style={{ fontWeight: 'bold' }}>
            {stats ? stats.subscriberCount : 'the'} other product builders
          </span>{' '}
          and get it delivered straight to your inbox by filling out this happy
          lil&apos; form:
        </Text>
      </Stack>
      <SubscriptionForm />

      <SponsorCTA />

      <Stack direction={'column'} spacing={'4'}>
        <Heading as="h2" size="md" margin={0} padding={0}>
          💌 Read the latest dispatch
        </Heading>
        <NewsletterItem newsletter={latestNewsletter} />
        <Spacer />

        <Heading as="h2" size="md" margin={0} padding={0}>
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
