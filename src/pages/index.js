import React from 'react';
import { Box, Link, Text, useTheme } from '@chakra-ui/react';

import { DefaultLayout } from '../components/Layouts';
import { Image, PostFeed } from '../components';

const HomePage = () => {
  const theme = useTheme();
  const pink = theme.colors.pink[400];
  return (
    <DefaultLayout>
      <Box
        display={{ md: 'flex' }}
        margin="1rem 0 2rem 0"
        spacing={4}
        alignItems="flex-start"
      >
        <Image
          publicId="mike-headshot-square"
          objectFit="contain"
          objectPosition="bottom"
          height="250px"
          marginRight={[0, 0, '1rem']}
        />
        <Box maxWidth="50ch">
          <Text
            as="h2"
            fontSize="4xl"
            margin="0"
            lineHeight="1"
            marginBottom="0.5rem"
          >
            Oh, hello
          </Text>
          <Text fontSize="xl" fontWeight="normal" margin="0">
            I'm a technologist, a designer, and a creator of things. I started
            this as a place to put together my thoughts on things that I think
            deserve a bigger stage than my{' '}
            <Link color={pink} href="https://twitter.com/irreverentmike">
              twitter
            </Link>{' '}
            or{' '}
            <Link color={pink} href="https://github.com/mbifulco">
              GitHub
            </Link>
            .
          </Text>
          <Text fontSize="xl" fontWeight="normal" fontStyle="italic" margin="0">
            I work at Google -- but the things I post here are my own, and don't
            necessarily reflect Google's views or opinions.
          </Text>
        </Box>
      </Box>

      <Box>
        <Text color={pink} fontWeight={400}>
          LATEST POSTS
        </Text>
        <PostFeed />
      </Box>
    </DefaultLayout>
  );
};

export default HomePage;
