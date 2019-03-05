import React from 'react'
import { OutboundLink } from 'gatsby-plugin-google-analytics'

import { GitHubIcon, TwitterIcon, TwitchIcon } from './icons'

import classes from '../styles/footer.module.css'

const Footer = () => (
  <footer>
    <div>
      <span className="footerCopyrights">© 2019 Mike Bifulco</span>
      <span className="footerCopyrights">
        <OutboundLink
          className={classes.gitHubLink}
          href="https://github.com/mbifulco"
          target="_blank"
          rel="noreferrer noopener"
        >
          <GitHubIcon />
        </OutboundLink>{' '}
        <OutboundLink
          className={classes.twitterLink}
          href="https://twitter.com/irreverentmike"
          target="_blank"
          rel="noreferrer noopener"
        >
          <TwitterIcon />
        </OutboundLink>{' '}
        <OutboundLink
          className={classes.twitchLink}
          href="https://twitch.tv/irreverentmike"
          target="_blank"
          rel="noreferrer noopener"
        >
          <TwitchIcon />
        </OutboundLink>
      </span>
    </div>
    <div className="credit">
      <span>
        Built with{' '}
        <OutboundLink
          href="https://www.gatsbyjs.org"
          target="_blank"
          rel="noreferrer noopener"
        >
          Gatsby
        </OutboundLink>
        .
      </span>{' '}
      <span>
        CMS by{' '}
        <OutboundLink
          href="https://takeshape.io"
          target="_blank"
          rel="noreferrer noopener"
        >
          Takeshape
        </OutboundLink>
        .
      </span>{' '}
      <span>
        Starter created by the brilliant{' '}
        <OutboundLink
          href="https://radoslawkoziel.pl"
          target="_blank"
          rel="noreferrer noopener"
        >
          panr
        </OutboundLink>
        .
      </span>
    </div>
  </footer>
)

export default Footer
