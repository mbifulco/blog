import React from 'react';

import { GitHubIcon, TwitterIcon, TwitchIcon, RssIcon } from './icons';

import classes from '../styles/footer.module.css';

const Footer = () => (
  <footer className={classes.container}>
    <div className={classes.content}>
      <div className={classes.meta}>
        <span className="footerCopyrights">© 2020 Mike Bifulco</span>
        <span className="footerCopyrights">
          <a
            className={classes.rssLink}
            href="/rss.xml"
            target="blank"
            rel="noopener noreferrer"
          >
            <RssIcon />
          </a>{' '}
          <a
            className={classes.gitHubLink}
            href="https://github.com/mbifulco"
            target="_blank"
            rel="noreferrer noopener me"
          >
            <GitHubIcon />
          </a>{' '}
          <a
            className={classes.twitterLink}
            href="https://twitter.com/irreverentmike"
            target="_blank"
            rel="noreferrer noopener me"
          >
            <TwitterIcon />
          </a>{' '}
          <a
            className={classes.twitchLink}
            href="https://twitch.tv/irreverentmike"
            target="_blank"
            rel="noreferrer noopener"
          >
            <TwitchIcon />
          </a>
        </span>
      </div>
      <div className="credit">
        <span>
          Built with{' '}
          <a
            href="https://www.gatsbyjs.org"
            target="_blank"
            rel="noreferrer noopener"
          >
            Gatsby
          </a>
          .
        </span>{' '}
        <span>
          CMS by{' '}
          <a
            href="https://www.takeshape.io"
            target="_blank"
            rel="noreferrer noopener"
          >
            Takeshape
          </a>
          .
        </span>{' '}
        <span>
          Source code on{' '}
          <a
            href="https://github.com/mbifulco/blog"
            target="_blank"
            rel="noreferrer noopener"
          >
            GitHub
          </a>
          .
        </span>
        <br />
        <span>
          Starter created by the brilliant{' '}
          <a
            href="https://radoslawkoziel.pl"
            target="_blank"
            rel="noreferrer noopener"
          >
            panr
          </a>
          .
        </span>{' '}
      </div>
    </div>
  </footer>
);

export default Footer;
