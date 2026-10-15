import React from 'react';

import Fancy from './NewsletterBannerFancy';

type NewsletterSignupProps = React.ComponentProps<typeof Fancy>;

export const NewsletterSignup: React.FC<NewsletterSignupProps> = (props) => {
  return <Fancy {...props} />;
};

export default NewsletterSignup;
