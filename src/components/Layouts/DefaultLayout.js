/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import InternalLink from 'next/link';

import { useRouter } from 'next/router';

import {
  Box,
  Link,
  Stack,
  Text,
  useColorMode,
  useTheme,
} from '@chakra-ui/react';

import { Footer, SEO, SocialLinks } from '..';
import MDXProviderWrapper from '../../utils/MDXProviderWrapper';

const DefaultLayout = ({ children }) => {
  const theme = useTheme();
  const { colorMode } = useColorMode();

  const titleColors = {
    light: 'gray.800',
    dark: 'pink.400',
  };

  const router = useRouter();
  const { pathname } = router;

  const [isHomePage, setIsHomePage] = useState(pathname === '/');

  useEffect(() => {
    setIsHomePage(pathname === '/');
  }, [pathname]);

  return (
    <MDXProviderWrapper>
      <SEO />
      <Box
        borderColor={theme.colors.pink[400]}
        borderWidth="1.25rem 0 0 0"
        borderStyle="solid"
        paddingTop={['1rem', '1rem', '2rem']}
        width="100%"
      >
        <Stack
          width={['100%', '100%', '50rem']}
          margin="0 auto"
          padding={['0 1rem', '0 1rem', '0 1rem', 0]}
        >
          <Stack
            overflowY="hidden"
            alignItems={isHomePage ? 'flex-start' : 'center'}
            shouldWrapChildren
            direction={isHomePage ? 'column' : 'row'}
            justifyContent={isHomePage ? 'flex-start' : 'space-between'}
            paddingBottom={isHomePage ? '0' : '1.5rem'}
          >
            <Stack direction="row" alignItems="center">
              <InternalLink
                style={{
                  textDecoration: 'none',
                }}
                href="/"
              >
                <Text
                  transition="all 5s ease"
                  fontSize={isHomePage ? '6xl' : 'lg'}
                  lineHeight="1"
                  fontWeight="700"
                  margin="0"
                  padding="0"
                  color={titleColors[colorMode]}
                  cursor="pointer"
                  as="a"
                >
                  Mike Bifulco
                </Text>
              </InternalLink>
              {isHomePage && (
                <SocialLinks
                  spacing={2}
                  marginLeft="2"
                />
              )}
            </Stack>

            <Stack direction="row">
              <Link as={InternalLink} href="/">
                <a>Blog</a>
              </Link>
              <Link as={InternalLink} href="/about">
                <a>About</a>
              </Link>
              <Link as={InternalLink} href="/newsletter">
                <a>Newsletter</a>
              </Link>
            </Stack>
          </Stack>

          <Stack spacing={8}>{children}</Stack>

          <Box minHeight="5rem" marginTop="1rem">
            <Footer />
          </Box>
        </Stack>
      </Box>
    </MDXProviderWrapper>
  );
};

DefaultLayout.propTypes = {
  children: PropTypes.node,
};

export default DefaultLayout;
