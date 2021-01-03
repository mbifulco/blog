import React from 'react';

import { Box, Link, Stack, Text, useTheme } from '@chakra-ui/react';

import { SocialLinks } from './SocialLinks';

const Footer = () => {
  const theme = useTheme();

  const pink = theme.colors.pink[400];
  return (
    <Box as="footer" position="relative" fontSize="small">
      <Stack zIndex={10} position="absolute">
        <span>© 2020 Mike Bifulco</span>
        <SocialLinks />
        <div className="credit">
          <span>
            Built with{' '}
            <Link
              color={pink}
              href="https://www.gatsbyjs.org"
              target="_blank"
              rel="noreferrer noopener"
            >
              Gatsby
            </Link>
            .
          </span>{' '}
          <span>
            CMS by{' '}
            <Link
              color={pink}
              href="https://www.takeshape.io"
              target="_blank"
              rel="noreferrer noopener"
            >
              Takeshape
            </Link>
            .
          </span>{' '}
          <span>
            Source code on{' '}
            <Link
              color={pink}
              href="https://github.com/mbifulco/blog"
              target="_blank"
              rel="noreferrer noopener"
            >
              GitHub
            </Link>
            .
          </span>
        </div>
        <Text as="i" mt="1rem" mb="4rem" id="disclaimer">
          Disclaimer:{' '}
          <span role="img" aria-label="wave">
            👋🏽
          </span>{' '}
          Hi there. I work as a Developer Advocate at Google. Content on this
          site contains my own opinions, and does not necessarily reflect the
          views of my employer.
        </Text>
      </Stack>
    </Box>
  );
};

export default Footer;
