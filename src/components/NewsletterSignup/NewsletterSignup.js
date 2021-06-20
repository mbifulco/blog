import React from 'react';
import PropTypes from 'prop-types';

import { Box, Flex, Heading, Text } from '@chakra-ui/react';

import { Headshot } from '../Headshot';
import { SubscriptionForm } from '../SubscriptionForm';

const NewsletterSignup = ({ tags }) => (
  <Flex direction="row" justifyContent="center" marginBottom="1rem">
    <Flex
      border="1px solid #ddd"
      background="white"
      maxWidth="525px"
      padding="1rem 2rem"
      margin="0 auto"
      display="flex"
      justifyContent="center"
    >
      <Box maxWidth="calc(100vw - 2rem)" margin="2rem 0">
        <Flex direction="row" justifyContent="center" marginBottom="0.5rem">
          <Headshot />
        </Flex>
        <Heading as="h6" fontSize="1.375rem" marginBottom="1rem">
          Get content for developers, designers, and entrepreneurs
        </Heading>
        <Text as="p" marginBottom="0.5rem" color="#757575" fontSize="small">
          Subscribe to get my updates delivered to your inbox. Typically 1-2
          emails a month, straight from me to you.{' '}
          <span role="img" aria-label="kissy face">
            😘
          </span>{' '}
          Unsubscribe anytime.
        </Text>
        <SubscriptionForm tags={tags} />
      </Box>
    </Flex>
  </Flex>
);

NewsletterSignup.propTypes = {
  tags: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.shape({}), PropTypes.string])
  ),
};

export default NewsletterSignup;
