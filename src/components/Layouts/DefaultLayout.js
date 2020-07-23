import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link as InternalLink } from 'gatsby';

import { useLocation } from '@reach/router';

import {
  Box,
  Link,
  Stack,
  Text,
  useColorMode,
  useTheme,
} from '@chakra-ui/core';

import { Footer, SEO, SocialLinks } from '..';
import MDXProviderWrapper from '../../utils/MDXProviderWrapper';

import '../../styles/variables.css';
import '../../styles/prism.css';
import './DefaultLayout.css';

const DefaultLayout = ({ children }) => {
  const theme = useTheme();
  const { colorMode } = useColorMode();

  const titleColors = {
    light: 'gray.800',
    dark: 'pink.400',
  };

  const location = useLocation();

  const [isHomePage, setIsHomePage] = useState(location.pathname === '/');

  useEffect(() => {
    setIsHomePage(location.pathname === '/');
  }, [location.pathname]);

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
            <InternalLink
              style={{
                textDecoration: 'none',
              }}
              to="/"
            >
              <Text
                transition="all 5s ease"
                fontSize={isHomePage ? '6xl' : 'lg'}
                lineHeight="1"
                fontWeight="700"
                margin="0"
                padding="0"
                color={titleColors[colorMode]}
              >
                Mike Bifulco
              </Text>
            </InternalLink>

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
              {isHomePage && (
                <SocialLinks
                  color={theme.colors.gray[600]}
                  spacing={2}
                  marginLeft="2"
                />
              )}
            </Stack>
          </Stack>

          <Box>{children}</Box>

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
