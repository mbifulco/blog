/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';

import { Link, Stack } from '@chakra-ui/core';

import { GitHubIcon, TwitterIcon, TwitchIcon, RssIcon } from '../icons';

const SocialLinks = ({ color, direction = 'row', spacing = 3, ...rest }) => (
  <Stack direction={direction} spacing={spacing} {...rest}>
    <Link
      color={color || '#6e5494'}
      href="https://github.com/mbifulco"
      target="_blank"
      rel="noreferrer noopener me"
    >
      <GitHubIcon />
    </Link>
    <Link
      color={color || '#1da1f2'}
      href="https://twitter.com/irreverentmike"
      target="_blank"
      rel="noreferrer noopener me"
    >
      <TwitterIcon />
    </Link>
    <Link
      color={color || '#6441a5'}
      href="https://twitch.tv/irreverentmike"
      target="_blank"
      rel="noreferrer noopener"
    >
      <TwitchIcon />
    </Link>
    <Link
      color={color || '#f78421'}
      href="/rss.xml"
      target="_blank"
      rel="noopener noreferrer"
    >
      <RssIcon />
    </Link>
  </Stack>
);

SocialLinks.propTypes = {
  color: PropTypes.string,
  direction: PropTypes.oneOf(['row', 'column']),
  spacing: PropTypes.number,
};

export default SocialLinks;
