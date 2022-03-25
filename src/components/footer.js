import React from 'react';

import { Box, Link, Stack, Text, useTheme } from '@chakra-ui/react';

import { SocialLinks } from './SocialLinks';
import { RelatedContentLinksByTag } from '.';
import config from '../config';

const Footer = () => {
  const theme = useTheme();

  const pink = theme.colors.pink[600]; // use dark pink for accessibility on small text
  return (
    <Box as="footer" position="relative" fontSize="small">
      <Stack zIndex={10} position="absolute">
        <RelatedContentLinksByTag />
        <Box margin="0 1.5rem">
          <SocialLinks />
        </Box>
        <span>© 2019-{new Date().getFullYear()} Mike Bifulco</span>
        <div className="credit">
          <span>
            Built with{' '}
            <Link
              color={pink}
              href="https://nextjs.org/"
              target="_blank"
              rel="noreferrer noopener"
              name="Nextjs"
            >
              Next
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
          Hi there. I work as a {config.employer.role} at {config.employer.name}
          . Content on this site contains my own opinions, and does not
          necessarily reflect the views of my employer.
        </Text>
      </Stack>
    </Box>
  );
};

export default Footer;
