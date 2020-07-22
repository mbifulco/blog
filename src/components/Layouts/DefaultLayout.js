import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link as InternalLink } from 'gatsby';

import { useLocation } from '@reach/router';

import { Box, Link, Stack, Text, useTheme } from '@chakra-ui/core';

import { Footer, SEO, SocialLinks } from '..';

const DefaultLayout = ({ children }) => {
  const theme = useTheme();

  const location = useLocation();

  const [isHomePage, setIsHomePage] = useState(location.pathname === '/');

  useEffect(() => {
    setIsHomePage(location.pathname === '/');
  }, [location.pathname]);

  return (
    <>
      <SEO />
      <Box
        borderColor={theme.colors.pink[400]}
        borderWidth="1.25rem 0 0 0"
        borderStyle="solid"
        paddingTop="2rem"
      >
        <Stack width={['100%', 1 / 2, '100ch']} margin="0 auto">
          <Stack
            overflowY="hidden"
            alignItems={isHomePage ? 'flex-start' : 'center'}
            shouldWrapChildren
            direction={isHomePage ? 'column' : 'row'}
            justifyContent={isHomePage ? 'flex-start' : 'space-between'}
          >
            <Text
              transition="all 5s ease"
              fontSize={isHomePage ? '6xl' : 'lg'}
              lineHeight="1"
              fontWeight="700"
              margin="0"
              padding="0"
            >
              <InternalLink
                style={{
                  color: theme.colors.gray[800],
                  textDecoration: 'none',
                }}
                to="/"
              >
                Mike Bifulco
              </InternalLink>
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
    </>
  );
};

DefaultLayout.propTypes = {
  children: PropTypes.node,
};

export default DefaultLayout;
