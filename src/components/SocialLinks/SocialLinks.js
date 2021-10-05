/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';

import { Link, Stack } from '@chakra-ui/react';

import { GitHubIcon, TwitterIcon, TwitchIcon, RssIcon } from '../icons';

const iconSize = "2.25rem";
const touchMargin = "0.5rem";

const SocialLinks = ({
  color,
  direction = 'row',
  spacing = 3,
  alignItems = 'center',
  ...rest
}) => (
  <Stack
    marginBottom="1rem"
    marginTop="1rem"
    height="2rem"
    direction={direction}
    spacing={spacing}
    alignItems={alignItems}
    {...rest}
  >
    <Link
      color={color || '#1da1f2'}
      href="https://twitter.com/irreverentmike"
      target="_blank"
      rel="noreferrer noopener me"
      aria-label="@irreverentmike on twitter"
      margin={touchMargin}
    >
      <TwitterIcon size={iconSize} />
    </Link>
    <Link
      color={color || '#6e5494'}
      href="https://github.com/mbifulco"
      target="_blank"
      rel="noreferrer noopener me"
      aria-label="@mbifulco on github"
      margin={touchMargin}
    >
      <GitHubIcon size={iconSize} />
    </Link>
    <Link
      color={color || '#6441a5'}
      href="https://twitch.tv/irreverentmike"
      target="_blank"
      rel="noreferrer noopener"
      aria-label="@irreverentmike on twitch"
      margin={touchMargin}
    >
      <TwitchIcon size={iconSize} />
    </Link>
    <Link
      color={color || '#f78421'}
      href="/rss.xml"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="RSS feed for this site"
      margin={touchMargin}
    >
      <RssIcon size={iconSize} />
    </Link>
  </Stack>
);

SocialLinks.propTypes = {
  alignItems: PropTypes.string,
  color: PropTypes.string,
  direction: PropTypes.oneOf(['row', 'column']),
  spacing: PropTypes.number,
};

export default SocialLinks;
