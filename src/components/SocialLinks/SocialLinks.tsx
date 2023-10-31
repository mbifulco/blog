/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

import Link from 'next/link';
import { FaYoutube } from 'react-icons/fa';

import { GitHubIcon, TwitterIcon, TwitchIcon, RssIcon } from '../icons';
import MastodonIcon from '../icons/MastodonIcon';

const SocialLinks = () => (
  <div className="flex flex-row gap-8 items-center">
    <Link
      className="hover:text-pink-600 m-1 h-4 w-4"
      target="_blank"
      rel="noopener noreferrer me"
      aria-label="@irreverentmike on Mastodon"
      href="https://hachyderm.io/@irreverentmike"
    >
      <MastodonIcon />
    </Link>

    <Link
      className="hover:text-pink-600 m-1 h-4 w-4"
      href="https://twitter.com/irreverentmike"
      target="_blank"
      rel="noreferrer noopener me"
      aria-label="@irreverentmike on twitter"
    >
      <TwitterIcon />
    </Link>
    <Link
      className="hover:text-pink-600 m-1 h-4 w-4"
      href="https://github.com/mbifulco"
      target="_blank"
      rel="noreferrer noopener me"
      aria-label="@mbifulco on github"
    >
      <GitHubIcon />
    </Link>
    <Link
      className="hover:text-pink-600 m-1 h-4 w-4"
      href="https://www.twitch.tv/irreverentmike"
      target="_blank"
      rel="noreferrer noopener"
      aria-label="@irreverentmike on twitch"
    >
      <TwitchIcon />
    </Link>
    <Link
      className="hover:text-pink-600 m-1 h-4 w-4"
      href="https://www.youtube.com/c/MikeBifulco"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="MikeBifulco on youtube"
    >
      <span className="text-sm">
        <FaYoutube />
      </span>
    </Link>
    <Link
      className="hover:text-pink-600 m-1 h-4 w-4"
      href="/rss.xml"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="RSS feed for this site"
    >
      <RssIcon />
    </Link>
  </div>
);

export default SocialLinks;
