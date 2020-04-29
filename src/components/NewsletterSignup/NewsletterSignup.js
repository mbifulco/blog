import React from 'react'
import PropTypes from 'prop-types'
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
    />
  )
}

NewsletterSignup.propTypes = {
  children: PropTypes.node,
}

export default NewsletterSignup
