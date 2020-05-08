import React from 'react';
import PropTypes from 'prop-types';

import { Headshot } from '../Headshot';
import classes from './NewsletterSignup.module.css';
import { SubscriptionForm } from '../SubscriptionForm';
import { PageDivider } from '../PageDivider';

const NewsletterSignup = ({ tags, hideStripe }) => {
  return (
    <>
      {!hideStripe && <PageDivider />}
      <div className={classes.container}>
        <div className={classes.content} id="newsletter">
          <Headshot className={classes.avatar} />
          <h3>Get content for developers, designers, and entrepreneurs</h3>
          <p>
            Subscribe to get my updates delivered to your inbox. Typically 1-2
            emails a month, straight from me to you.{' '}
            <span role="img" aria-label="kissy face">
              😘
            </span>{' '}
            Unsubscribe anytime.
          </p>
          <SubscriptionForm tags={tags} />
        </div>
      </div>
    </>
  );
};

NewsletterSignup.propTypes = {
  hideStripe: PropTypes.bool,
};

NewsletterSignup.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.shape({})),
};

export default NewsletterSignup;
