import React from 'react';

import { Link as InternalLink } from 'gatsby';

import { Box, Link, Stack, Text, useTheme } from '@chakra-ui/core';

import {
  Footer,
  Image,
  NewsletterSignup,
  SEO,
  SocialLinks,
} from '../components';

const HomePage = () => {
  const theme = useTheme();
  return (
    <>
      <SEO title="Home" />
      <Box
        minWidth="calc(100vw - 3rem)"
        minHeight="100vh"
        borderColor={theme.colors.pink[400]}
        borderWidth="1.25rem"
        borderStyle="solid"
        padding="2rem 3rem"
      >
        <Stack>
          <Stack overflowY="hidden" alignItems="flex-start">
            <Text
              as="h1"
              fontSize="6xl"
              lineHeight="5rem"
              margin="0"
              padding="0"
            >
              Mike Bifulco
            </Text>
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
              <SocialLinks
                color={theme.colors.gray[600]}
                spacing={2}
                marginLeft="2"
              />
            </Stack>
            <Image
              publicId="mike-headshot-square"
              objectFit="contain"
              objectPosition="bottom"
              maxHeight="40vh"
            />
          </Stack>

          <Stack maxWidth={['100%']}>
            <NewsletterSignup hideStripe />
          </Stack>

          <Footer />
        </Stack>
      </Box>
    </>
  );
};

export default HomePage;
