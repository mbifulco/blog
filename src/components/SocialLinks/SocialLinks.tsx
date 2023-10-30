/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';

import { Link, Stack } from '@chakra-ui/react';
import { FaYoutube } from 'react-icons/fa';

import { GitHubIcon, TwitterIcon, TwitchIcon, RssIcon } from '../icons';
import MastodonIcon from '../icons/MastodonIcon';

const iconSize = '2.25rem';
const touchMargin = '0.5rem';

const SocialLinks = () => (
  <div className="flex flex-row gap-8 items-center">
    <Link
      color="#2b90d9"
      target="_blank"
      rel="noopener noreferrer me"
      aria-label="@irreverentmike on Mastodon"
      href="https://hachyderm.io/@irreverentmike"
      fontSize={'inherit'}
    >
      <MastodonIcon size={'1em'} />
    </Link>
    <Link
      color="#1da1f2"
      href="https://twitter.com/irreverentmike"
      target="_blank"
      rel="noreferrer noopener me"
      aria-label="@irreverentmike on twitter"
      margin={touchMargin}
      display="none"
    >
      <TwitterIcon size={'1em'} />
    </Link>
    <Link
      color="#6e5494"
      href="https://github.com/mbifulco"
      target="_blank"
      rel="noreferrer noopener me"
      aria-label="@mbifulco on github"
      margin={touchMargin}
    >
      <GitHubIcon size={'1em'} />
    </Link>
    <Link
      color="#6441a5"
      href="https://www.twitch.tv/irreverentmike"
      target="_blank"
      rel="noreferrer noopener"
      aria-label="@irreverentmike on twitch"
      margin={touchMargin}
    >
      <TwitchIcon size={'1em'} />
    </Link>
    <Link
      color="#FF0000"
      href="https://www.youtube.com/c/MikeBifulco"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="MikeBifulco on youtube"
      margin={touchMargin}
    >
      <span className="text-sm">
        <FaYoutube />
      </span>
    </Link>
    <Link
      color="#f78421"
      href="/rss.xml"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="RSS feed for this site"
      margin={touchMargin}
    >
      <RssIcon size={'1em'} />
    </Link>
  </div>
);

export default SocialLinks;
