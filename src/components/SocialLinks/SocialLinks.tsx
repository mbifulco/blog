import React from 'react';
import Link from 'next/link';

import {
  GitHubIcon,
  RssIcon,
  ThreadsIcon,
  TwitchIcon,
  TwitterIcon,
  YouTubeIcon,
} from '../icons';
import MastodonIcon from '../icons/MastodonIcon';

const SocialLinks = () => (
  <div className="flex flex-row items-center gap-6">
    <Link
      className="m-1 h-4 w-4 transition-all duration-200 hover:scale-125 hover:text-pink-600"
      href="https://threads.net/@irreverentmike"
      target="_blank"
      rel="noreferrer noopener me"
      aria-label="@irreverentmike on threads"
    >
      <ThreadsIcon />
    </Link>

    <Link
      className="hover:text-red m-1 h-4 w-4 transition-all duration-200 hover:scale-125"
      href="https://www.youtube.com/c/MikeBifulco"
      target="_blank"
      rel="noopener noreferrer me"
      aria-label="MikeBifulco on youtube"
    >
      <span className="text-sm">
        <YouTubeIcon />
      </span>
    </Link>

    <Link
      className="m-1 h-4 w-4 transition-all duration-200 hover:scale-125 hover:text-pink-600"
      href="https://github.com/mbifulco"
      target="_blank"
      rel="noreferrer noopener me"
      aria-label="@mbifulco on github"
    >
      <GitHubIcon />
    </Link>

    <Link
      className="m-1 h-4 w-4 transition-all duration-200 hover:scale-125 hover:text-pink-600"
      target="_blank"
      rel="noopener noreferrer me"
      aria-label="@irreverentmike on Mastodon"
      href="https://hachyderm.io/@irreverentmike"
    >
      <MastodonIcon />
    </Link>

    <Link
      className="m-1 hidden h-4 w-4 transition-all duration-200 hover:scale-125 hover:text-pink-600"
      href="https://twitter.com/irreverentmike"
      target="_blank"
      rel="noreferrer noopener me"
      aria-label="@irreverentmike on twitter"
    >
      <TwitterIcon />
    </Link>

    <Link
      className="m-1 hidden h-4 w-4 transition-all duration-200 hover:scale-125 hover:text-pink-600"
      href="https://www.twitch.tv/irreverentmike"
      target="_blank"
      rel="noreferrer noopener"
      aria-label="@irreverentmike on twitch"
    >
      <TwitchIcon />
    </Link>

    <Link
      className="m-1 h-4 w-4 transition-all duration-200 hover:scale-125 hover:text-pink-600"
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
