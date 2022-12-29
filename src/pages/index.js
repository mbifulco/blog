import React from 'react';
import PropTypes from 'prop-types';

import { Box, Link, Text, useTheme } from '@chakra-ui/react';

import { Image } from '../components/Image';
import { PostFeed } from '../components/PostFeed';
import SEO from '../components/SEO';
import { Subtitle } from '../components/Subtitle';
import WebmentionMetadata from '../components/webmentionMetadata';

import { getAllPosts } from '../lib/blog';
import { generateRSSFeed } from '../utils/rss';
import { getCloudinaryImageUrl } from '../utils/images';
import config from '../config';
import { getAllNewsletters } from '../lib/newsletters';

export async function getStaticProps() {
  const posts = await getAllPosts();
  const newsletters = await getAllNewsletters();

  generateRSSFeed(posts, newsletters);

  return {
    props: {
      posts,
    },
  };
}

const headshotPublicId = 'mike-headshot-square';
const headshotPublicUrl = getCloudinaryImageUrl(headshotPublicId);

const HomePage = ({ posts }) => {
  const theme = useTheme();
  const pink = theme.colors.pink[400];

  return (
    <>
      <SEO
        title="Latest articles on design, development, and the world around me"
        image={headshotPublicUrl}
      />
      <Box
        display={{ md: 'flex' }}
        margin="1rem 0 2rem 0"
        spacing={4}
        alignItems="flex-start"
      >
        <Box marginRight={[0, 0, '1rem']}>
          <Image
            alt="My headshot"
            publicId={headshotPublicId}
            objectFit="contain"
            objectPosition="bottom"
            height="250"
            width="250"
          />
        </Box>
        <Box maxWidth="50ch">
          <Text
            as="h2"
            fontSize="4xl"
            margin="0"
            lineHeight="1"
            marginBottom="0.5rem"
            fontWeight={'bold'}
          >
            Oh, hello
          </Text>
          <Text fontSize="xl" fontWeight="normal" margin="0">
            {"I'm"} a startup founder, a designer, and a maker. I share my
            writing on this site, but you can also find me on{' '}
            <Link color={pink} href="https://hachyderm.io/@irreverentmike">
              Mastodon
            </Link>{' '}
            and{' '}
            <Link color={pink} href="https://github.com/mbifulco">
              GitHub
            </Link>
            .
          </Text>
          <Text
            fontSize="xl"
            fontWeight="normal"
            fontStyle="italic"
            margin="0"
            marginTop="1rem"
          >
            I work as a {config.employer.role} at{' '}
            <Link
              href={config.employer.url}
              target="_blank"
              rel="noopener noreferrer"
              color={pink}
            >
              {config.employer.name}
            </Link>{' '}
            &mdash; however, the things I post here are my own, and {"don't "}
            necessarily reflect the views or opinions of {config.employer.name}.
          </Text>
        </Box>
      </Box>

      <Box>
        <Subtitle>
          <Link href="/podcast">🎙️ The Podcast</Link>
        </Subtitle>
        <Box padding="1rem 0">
          <iframe
            width="100%"
            height="180"
            frameBorder="no"
            scrolling="no"
            seamless
            src="https://share.transistor.fm/e/tiny-improvements/latest"
          />
        </Box>
      </Box>

      <Box>
        <Subtitle>LATEST POSTS</Subtitle>
        <PostFeed posts={posts} />
      </Box>
      <WebmentionMetadata
        summary="mikebifulco.com - articles on design, development, and making the world a better place."
        title="Home - mikebifulco.com"
      />
    </>
  );
};

HomePage.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape({})),
};

export default HomePage;
