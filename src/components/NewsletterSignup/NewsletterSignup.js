import React from 'react';
import PropTypes from 'prop-types';

import { Box, Flex, Heading, Stack, Text, useTheme } from '@chakra-ui/react';

import { Headshot } from '../Headshot';
import { SubscriptionForm } from '../SubscriptionForm';
import SponsorCTA from '../SponsorCTA/SponsorCTA';
import useConvertKitStats from '../../hooks/useConvertKitStats';
import config from '../../config';

const NewsletterSignup = ({ tags }) => {
  const theme = useTheme();

  const { stats } = useConvertKitStats();
  return (
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
        <Stack as="section" maxWidth="calc(100vw - 2rem)" margin="2rem 0 0 0">
          <Flex direction="row" justifyContent="center" marginBottom="0.5rem">
            <Headshot />
          </Flex>
          <Heading
            as="h2"
            fontSize="1.375rem"
            marginBottom="1rem"
            color={theme.colors.black}
          >
            Subscribe to Tiny Improvements
            {stats && `, along with ${stats.subscriberCount} other builders`}
          </Heading>

          <Text>{config.newsletter.shortDescription}</Text>
          <SubscriptionForm tags={tags} />
          <Text as="p" marginBottom="0.5rem" color="#757575" fontSize="small">
            Typically once a week, straight from me to you.{' '}
            <span role="img" aria-label="kissy face">
              😘
            </span>{' '}
            Unsubscribe anytime.
          </Text>
          <br />
          <SponsorCTA />
        </Stack>
      </Flex>
    </Flex>
  );
};

NewsletterSignup.propTypes = {
  tags: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.shape({}), PropTypes.string])
  ),
};

export default NewsletterSignup;
