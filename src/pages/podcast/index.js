import NextLink from 'next/link';
import { Box, Heading, Link, Stack, Text } from '@chakra-ui/react';

import { NewsletterSignup, SEO, Subtitle } from '../../components';

const PodcastPage = () => {
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
          <Subtitle>🎙️ The Podcast</Subtitle>
        </Box>
        <Text fontSize={'xl'}>
          Occasionally, {"I'll"} write something I like <em>so much</em> that I
          record it as a podcast. Think of them short-form audio essays,
          published under the same title as my sweet{' '}
          <Link color="pink.400" as={NextLink} href="/newsletter">
            newsletter
          </Link>
          .
        </Text>
      </Stack>

      <Stack direction={'column'} spacing={'0'}>
        <iframe
          width="100%"
          height="390"
          frameBorder="no"
          scrolling="no"
          seamless
          src="https://share.transistor.fm/e/tiny-improvements/playlist"
        ></iframe>
      </Stack>

      <NewsletterSignup />
    </>
  );
};

export default PodcastPage;
