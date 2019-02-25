import React from 'react'

import { GitHubIcon, TwitterIcon, TwitchIcon } from './icons'

import classes from '../styles/footer.module.css'

const Footer = () => (
  <footer>
    <div>
      <span className="footerCopyrights">© 2019 Mike Bifulco</span>
      <span className="footerCopyrights">
        <a
          className={classes.gitHubLink}
          href="https://github.com/mbifulco"
          target="_blank"
          rel="noreferrer noopener"
        >
          <GitHubIcon />
        </a>{' '}
        <a
          className={classes.twitterLink}
          href="https://twitter.com/irreverentmike"
          target="_blank"
          rel="noreferrer noopener"
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
        Built with <a href="https://www.gatsbyjs.org">Gatsby</a>.
      </span>{' '}
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
      </span>
    </div>
  </footer>
)

export default Footer
