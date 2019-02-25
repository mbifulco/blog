import React from 'react'

const Footer = () => (
  <footer>
    <div>
      <span className="footerCopyrights">
        © 2019 Mike Bifulco
      </span>
      <span className="footerCopyrights">
        <a href="https://github.com/mbifulco">GitHub</a>
        {' '}
        <a href="https://twitter.com/irreverentmike">Twitter</a>
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
