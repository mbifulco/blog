import React from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Link,
  SimpleGrid,
  Text,
  useBreakpointValue,
  useTheme,
} from '@chakra-ui/react';

import NextLink from 'next/link';

import { Image } from '../components/Image';
import { PostFeed } from '../components/PostFeed';
import SEO from '../components/seo';
import { Subtitle } from '../components/Subtitle';
import WebmentionMetadata from '../components/webmentionMetadata';

import { getAllPosts } from '../lib/blog';
import { generateRSSFeed } from '../utils/rss';
import { getCloudinaryImageUrl } from '../utils/images';
import config from '../config';
import { getAllNewsletters } from '../lib/newsletters';
import NewsletterItem from '../components/NewsletterFeed/NewsletterItem';

export async function getStaticProps() {
  const posts = await getAllPosts();
  const newsletters = await getAllNewsletters();

  generateRSSFeed(posts, newsletters);

  return {
    props: {
      posts,
      newsletter: newsletters[0],
    },
  };
}

const headshotPublicId = 'mike-headshot-square';
const headshotPublicUrl = getCloudinaryImageUrl(headshotPublicId);

const HomePage = ({ posts, newsletter }) => {
  const theme = useTheme();
  const pink = theme.colors.pink[400];

  // console.dir(posts);

  return (
    <>
      <SEO
        title="Latest articles on design, development, and the world around me"
        image={headshotPublicUrl}
      />
      <Box
        display={{ md: 'flex' }}
        margin="1rem 0 1rem 0"
        alignItems="flex-start"
      >
        <Box marginRight={[0, 0, '1rem']}>
          <Image
            alt="My headshot"
            publicId={headshotPublicId}
            className="object-contain object-bottom"
            height={250}
            width={250}
            loading="eager"
            priority
          />
        </Box>
        <Box maxWidth="50ch">
          <h2 className="text-4xl m-0 font-bold mb-2">Oh, hello</h2>
          <Text fontSize="xl" fontWeight="normal" margin="0">
            {"I'm"} a startup founder, a designer, and a maker. I share my
            writing on this site, but you can also find me on threads{' '}
            <NextLink
              href="https://threads.net/@irrevernemikt"
              target="_blank"
              rel="noopener noreferrer"
            >
              @irreverentmike
            </NextLink>{' '}
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

      <SimpleGrid columns={[1, 1, 1, 2]} spacing={4}>
        <Box>
          <Subtitle>
            <Link href="/newsletter">💌 Tiny Improvements newsletter</Link>
          </Subtitle>
          <Box padding="1rem 0">
            <NewsletterItem
              newsletter={newsletter}
              compact={useBreakpointValue([false, false, false, true])}
            />
          </Box>
        </Box>

        <Box>
          <Subtitle>
            <Link href="/podcast">🎙️ The Podcast</Link>
          </Subtitle>
          <Box padding="1rem 0 0 0">
            <iframe
              width="100%"
              height="390"
              seamless
              src="https://share.transistor.fm/e/tiny-improvements/playlist"
            />
          </Box>
        </Box>
      </SimpleGrid>

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
