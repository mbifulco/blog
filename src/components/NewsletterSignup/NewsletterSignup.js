import React from 'react'

import classes from './NewsletterSignup.module.css'

const NewsletterSignup = () => {
  return (
    <iframe
      title="newsletter signup"
      src="https://irreverentmike.substack.com/embed"
      width={480}
      height={320}
      className={classes.iframe}
      frameBorder={0}
      scrolling="no"
      loading="lazy"
    />
  )
}

export default NewsletterSignup
