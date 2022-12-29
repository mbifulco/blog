import React from 'react';

import { Box, Link, SimpleGrid, Stack, Text, useTheme } from '@chakra-ui/react';

import { SocialLinks } from './SocialLinks';
import RelatedContentLinksByTag from './RelatedContent/RelatedContentLinksByTag';
import config from '../config';

import SponsorCTA from './SponsorCTA/SponsorCTA';

const Footer = () => {
  const theme = useTheme();

  const pink = theme.colors.pink[600]; // use dark pink for accessibility on small text
  return (
    <Box as="footer" position="relative" fontSize="small" paddingTop="2rem">
      <SimpleGrid minChildWidth={'200px'} spacing="4">
        <Stack zIndex={10}>
          <span>© 2019-{new Date().getFullYear()} Mike Bifulco</span>

          <SponsorCTA />
          <Box margin="0 1.5rem">
            <SocialLinks />
          </Box>
        </Stack>
        <Stack>
          <Text as="i" id="disclaimer">
            Disclaimer:{' '}
            <span role="img" aria-label="wave">
              👋🏽
            </span>{' '}
            Hi there. I work as a {config.employer.role} at{' '}
            {config.employer.name}. These are my opinions, and not necessarily
            the views of my employer.
          </Text>

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
        </Stack>
      </SimpleGrid>

      <RelatedContentLinksByTag />
    </Box>
  );
};

export default Footer;
