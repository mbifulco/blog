/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';

import { useRouter } from 'next/router';

import {
  Box,
  Link,
  Stack,
  Text,
  useColorMode,
  useTheme,
} from '@chakra-ui/react';

import Footer from '../footer';

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
            alignItems={isHomePage ? 'flex-start' : ['flext-start', 'center']}
            shouldWrapChildren
            direction={isHomePage ? 'column' : ['column', 'row']}
            justifyContent={
              isHomePage ? 'flex-start' : ['flex-start', 'space-between']
            }
            paddingBottom={isHomePage ? '0' : '1.5rem'}
          >
            <Stack
              direction={['column', 'column', 'row']}
              alignItems={['flex-start', 'flex-start', 'center']}
              fontSize={isHomePage ? ['lg', 'lg', 'xl', '3xl'] : 'lg'}
              color={[
                titleColors[colorMode],
                titleColors[colorMode],
                undefined,
              ]}
            >
              <NextLink
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
                >
                  Mike Bifulco
                </Text>
              </NextLink>
            </Stack>

            <Stack direction={['row']}>
              <Link as={NextLink} href="/">
                Blog
              </Link>
              <Link as={NextLink} href="/podcast">
                Podcast
              </Link>
              <Link as={NextLink} href="/about">
                About
              </Link>
              <Link
                background="pink.400"
                padding="0 1ch"
                color="whiteAlpha.900"
                borderRadius={'3px'}
                as={NextLink}
                href="/newsletter"
              >
                💌 Tiny Improvements
              </Link>
            </Stack>
          </Stack>

          <Stack spacing={8}>{children}</Stack>

          <Footer />
        </Stack>
      </Box>
    </MDXProviderWrapper>
  );
};

export default DefaultLayout;
