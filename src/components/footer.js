import React from 'react';

import { Box, Stack } from '@chakra-ui/core';

import { SocialLinks } from '.';

const Footer = () => (
  <Box as="footer" position="relative" fontSize="small">
    <Stack zIndex={10} position="absolute">
      <span>© 2020 Mike Bifulco</span>
      <SocialLinks />
      <div className="credit">
        <span>
          Built with{' '}
          <a
            href="https://www.gatsbyjs.org"
            target="_blank"
            rel="noreferrer noopener"
          >
            Gatsby
          </a>
          .
        </span>{' '}
        <span>
          CMS by{' '}
          <a
            href="https://www.takeshape.io"
            target="_blank"
            rel="noreferrer noopener"
          >
            Takeshape
          </a>
          .
        </span>{' '}
        <span>
          Source code on{' '}
          <a
            href="https://github.com/mbifulco/blog"
            target="_blank"
            rel="noreferrer noopener"
          >
            GitHub
          </a>
          .
        </span>
        <br />
        <span>
          Starter created by the brilliant{' '}
          <a
            href="https://radoslawkoziel.pl"
            target="_blank"
            rel="noreferrer noopener"
          >
            panr
          </a>
          .
        </span>{' '}
      </div>
    </Stack>
  </Box>
);

export default Footer;
