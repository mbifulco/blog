import React from 'react';
import { PostHogFeature } from 'posthog-js/react';

import Detailed from './NewsletterBannerDetailed';
import Fancy from './NewsletterBannerFancy';
import Simple from './NewsletterBannerSimple';

const NEWSLETTER_EXPERIMENT_NAME = 'newsletter-banner-treatments';
const NewsletterExperiementVariants = {
  Control: 'control',
  Simple: 'simple',
  Hero: 'hero',
} as const;

export const NewsletterSignup: React.FC = () => {
  return (
    <>
      <PostHogFeature
        flag={NEWSLETTER_EXPERIMENT_NAME}
        match={NewsletterExperiementVariants.Control}
        fallback={null}
      >
        <Fancy />
      </PostHogFeature>
      <PostHogFeature
        flag={NEWSLETTER_EXPERIMENT_NAME}
        match={NewsletterExperiementVariants.Simple}
        fallback={null}
      >
        <Simple />
      </PostHogFeature>
      <PostHogFeature
        flag={NEWSLETTER_EXPERIMENT_NAME}
        match={NewsletterExperiementVariants.Hero}
        fallback={null}
      >
        <Detailed />
      </PostHogFeature>
    </>
  );
};

export default NewsletterSignup;
