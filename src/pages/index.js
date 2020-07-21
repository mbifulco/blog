import React from 'react';

import { Link as InternalLink } from 'gatsby';

import { Box, Link, Stack, Text, useTheme } from '@chakra-ui/core';

import { Image, NewsletterSignup, SEO } from '../components';

const HomePage = () => {
  const theme = useTheme();
  return (
    <>
      <SEO title="Home" />
      <Box
        minWidth="100vw"
        minHeight="100vh"
        borderColor={theme.colors.pink[400]}
        borderWidth="1.25rem"
        borderStyle="solid"
        padding="3rem"
      >
        <Stack>
          <Stack maxHeight="40rem" overflowY="hidden" alignItems="flex-start">
            <Text fontSize="6xl">Mike Bifulco</Text>
            <Stack direction="row">
              <Link as={InternalLink} to="/posts">
                Blog
              </Link>
              <Link as={InternalLink} to="/about">
                About
              </Link>
              <Link as={InternalLink} to="/newsletter">
                Newsletter
              </Link>
            </Stack>
            <Image
              publicId="bike-in-woods"
              objectFit="contain"
              objectPosition="bottom"
            />
          </Stack>

          <Stack maxWidth={['100%']}>
            <Link href="https://github.com/mbifulco">@mbifulco</Link>
            <Link href="https://twitter.com/irreverentmike">
              @irreverentmike
            </Link>
            <Link href="https://instagram.com/irreverentmike">
              @irreverentmike
            </Link>
            <Link href="https://linkedin.com/in/mbifulco">/in/mbifulco</Link>

            <NewsletterSignup hideStripe />
          </Stack>
        </Stack>
      </Box>
    </>
  );
};

export default HomePage;
