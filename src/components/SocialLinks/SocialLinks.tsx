import React from 'react';
import Link from '@components/Link';
import posthog from 'posthog-js';

import {
  BlueskyIcon,
  GitHubIcon,
  MastodonIcon,
  PatreonIcon,
  RssIcon,
  ThreadsIcon,
  TwitchIcon,
  TwitterIcon,
  YouTubeIcon,
} from '../icons';

const handleSocialLinkClick = (platform: string, url: string) => {
  posthog.capture('social_link_clicked', {
    platform,
    url,
  });
};

const SocialLinks = () => (
  <div className="flex flex-row items-center gap-6">
    <Link
      className="m-1 h-4 w-4 transition-all duration-200 hover:scale-125 hover:text-pink-600"
      href="https://patreon.com/tinyimprovements"
      target="_blank"
      rel="noopener noreferrer me"
      aria-label="Tiny Improvements on Patreon"
      onClick={() => handleSocialLinkClick('patreon', 'https://patreon.com/tinyimprovements')}
    >
      <PatreonIcon />
    </Link>
    <Link
      className="m-1 h-4 w-4 transition-all duration-200 hover:scale-125 hover:text-pink-600"
      href="https://bsky.app/profile/mikebifulco.com"
      target="_blank"
      rel="noopener noreferrer me"
      aria-label="@mikebifulco.com on Bluesky"
      onClick={() => handleSocialLinkClick('bluesky', 'https://bsky.app/profile/mikebifulco.com')}
    >
      <BlueskyIcon />
    </Link>
    <Link
      className="m-1 h-4 w-4 transition-all duration-200 hover:scale-125 hover:text-pink-600"
      href="https://threads.net/@irreverentmike"
      target="_blank"
      rel="noreferrer noopener me"
      aria-label="@irreverentmike on threads"
      onClick={() => handleSocialLinkClick('threads', 'https://threads.net/@irreverentmike')}
    >
      <ThreadsIcon />
    </Link>

    <Link
      className="hover:text-red m-1 h-4 w-4 transition-all duration-200 hover:scale-125"
      href="https://www.youtube.com/c/MikeBifulco"
      target="_blank"
      rel="noopener noreferrer me"
      aria-label="MikeBifulco on youtube"
      onClick={() => handleSocialLinkClick('youtube', 'https://www.youtube.com/c/MikeBifulco')}
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
      onClick={() => handleSocialLinkClick('github', 'https://github.com/mbifulco')}
    >
      <GitHubIcon />
    </Link>

    <Link
      className="m-1 h-4 w-4 transition-all duration-200 hover:scale-125 hover:text-pink-600"
      target="_blank"
      rel="noopener noreferrer me"
      aria-label="@irreverentmike on Mastodon"
      href="https://hachyderm.io/@irreverentmike"
      onClick={() => handleSocialLinkClick('mastodon', 'https://hachyderm.io/@irreverentmike')}
    >
      <MastodonIcon />
    </Link>

    <Link
      className="m-1 hidden h-4 w-4 transition-all duration-200 hover:scale-125 hover:text-pink-600"
      href="https://twitter.com/irreverentmike"
      target="_blank"
      rel="noreferrer noopener me"
      aria-label="@irreverentmike on twitter"
      onClick={() => handleSocialLinkClick('twitter', 'https://twitter.com/irreverentmike')}
    >
      <TwitterIcon />
    </Link>

    <Link
      className="m-1 hidden h-4 w-4 transition-all duration-200 hover:scale-125 hover:text-pink-600"
      href="https://www.twitch.tv/irreverentmike"
      target="_blank"
      rel="noreferrer noopener"
      aria-label="@irreverentmike on twitch"
      onClick={() => handleSocialLinkClick('twitch', 'https://www.twitch.tv/irreverentmike')}
    >
      <TwitchIcon />
    </Link>

    <Link
      className="m-1 h-4 w-4 transition-all duration-200 hover:scale-125 hover:text-pink-600"
      href="/rss.xml"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="RSS feed for this site"
      onClick={() => handleSocialLinkClick('rss', '/rss.xml')}
    >
      <RssIcon />
    </Link>
  </div>
);

export default SocialLinks;
