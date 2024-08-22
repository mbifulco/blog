import React from 'react';
import useNewsletterStats from '@hooks/useNewsletterStats';

import config from '../../config';
import { SubscriptionForm } from '../SubscriptionForm';

const SimpleNewsletterBanner: React.FC = () => {
  const { subscriberCount } = useNewsletterStats();
  return (
    <div className="mx-auto max-w-screen-xl py-8">
      <div className="items-center justify-between gap-16 rounded-lg bg-gray-700 p-8 text-white lg:flex lg:gap-24">
        <div className="w-full">
          <header>
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              💌 Tiny Improvements for Product Builders
            </h2>
            <p>
              Join{' '}
              <span className="text-xl font-extrabold text-pink-600">
                {subscriberCount ?? ''}
              </span>{' '}
              other product builders, indie hackers, and startup founders.
            </p>
          </header>
          <p className="font-light text-gray-400">
            {config.newsletter.shortDescription}
          </p>
        </div>
        <div className="mt-6 w-full lg:mt-0">
          <SubscriptionForm source="simple-newsletter-banner" />
        </div>
      </div>
    </div>
  );
};

export default SimpleNewsletterBanner;
