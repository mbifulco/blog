import React from 'react'

const Footer = () => (
  <footer>
    <div>
      <span className="footerCopyrights">
        © 2019 Mike Bifulco
      </span>
      <span className="footerCopyrights">
        <a
          href="https://github.com/mbifulco"
          target="_blank"
          rel="noreferrer noopener"
        >
          GitHub
        </a>
        {' '}
        <a
          href="https://twitter.com/irreverentmike"
          target="_blank"
          rel="noreferrer noopener"
        >
          Twitter
        </a>
        {' '}
        <a
          href="https://twitch.tv/irreverentmike"
          target="_blank"
          rel="noreferrer noopener"
        >
          Twitch
        </a>
      </span>
    </div>
    <div className="credit">
      <span>
        Built with <a href="https://www.gatsbyjs.org">Gatsby</a>.
      </span>
      {' '}
      <span>
        Starter created by the brilliant{' '}
        <a href="https://radoslawkoziel.pl" target="_blank" rel="noreferrer noopener">panr</a>.
      </span>
    </div>
  </footer>
)

export default Footer
