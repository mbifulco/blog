import React from 'react';

import { Box, Grid, Link, Stack, Text, useTheme } from '@chakra-ui/core';

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
        <Grid
          gridTemplateAreas={`
            "topleft topright"
            "midleft midright"
        `}
        >
          <Stack gridArea="topleft">
            <Text fontSize="6xl">Mike Bifulco</Text>
            <Link href="https://github.com/mbifulco">@mbifulco</Link>
            <Link href="https://twitter.com/irreverentmike">
              @irreverentmike
            </Link>
            <Link href="https://instagram.com/irreverentmike">
              @irreverentmike
            </Link>
            <Link href="https://linkedin.com/in/mbifulco">/in/mbifulco</Link>
          </Stack>

          <Stack gridArea="topright">
            <Image
              publicId="bike-in-woods"
              maxHeight="30vh"
              objectFit="cover"
            />
          </Stack>

          <Box gridArea="midleft">
            <NewsletterSignup hideStripe />
          </Box>
        </Grid>
      </Box>
    </>
  );
};

export default HomePage;
