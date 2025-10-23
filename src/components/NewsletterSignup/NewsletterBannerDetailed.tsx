import React from 'react';
import { Code, CornerRightDown, Rocket, Zap } from 'lucide-react';
import { usePostHog } from 'posthog-js/react';

import { Avatar } from '@components/Avatar';
import { Badge } from '@components/Badge';
import { Headshot } from '@components/Headshot';
import { SubscriptionForm } from '@components/SubscriptionForm';
import SubscriberCount from './SubscriberCount';

const NewsletterBannerDetailed = () => {
  const posthog = usePostHog();

  // Get the title index directly from PostHog feature flag during render
  const testVariant = posthog?.getFeatureFlag('newsletter-title-test');
  const titleIndex = parseInt(testVariant as string) || 0;

  // calculate the number of days until the next Tuesday
  const daysUntilNextTuesday = (2 - new Date().getDay() + 7) % 7;

  let daysText;

  switch (daysUntilNextTuesday) {
    case 0:
      daysText = 'today';
      break;
    case 1:
      daysText = 'tomorrow';
      break;
    default:
      daysText = `in ${daysUntilNextTuesday} days`;
  }

  const titleOptions = [
    {
      title: 'Tiny Improvements for Product Builders',
      tagline: 'Weekly insights on design, dev, and startup growth',
      buttonText: 'Start Improving',
    },
    {
      title: "The Product Builder's Toolkit",
      tagline: 'Actionable tips for developers and founders',
      buttonText: 'Get the Tools',
    },
    {
      title: 'From Code to Launch',
      tagline: 'Navigate the journey from dev to founder',
      buttonText: 'Begin My Journey',
    },
    {
      title: 'Frontend to Founder',
      tagline: 'Weekly lessons in product development and startup life',
      buttonText: 'Level Up My Career',
    },
    {
      title: "The Tech Founder's Compass",
      tagline: 'Guiding devs through product and startup challenges',
      buttonText: 'Find My Direction',
    },
  ];

  return (
    <div className="mx-auto max-w-4xl p-6 md:p-8">
      <div className="rounded-lg border p-6 text-gray-800 shadow-lg md:p-8">
        <div className="flex flex-col items-center gap-8 md:flex-row">
          <div className="w-full md:w-2/3">
            <h2 className="mb-2 text-3xl font-extrabold tracking-tight text-gray-800 md:text-4xl">
              {titleOptions[titleIndex].title}
            </h2>
            <p className="mb-0 text-xl text-gray-600">
              {titleOptions[titleIndex].tagline}
            </p>
            <div className="mb-6 flex items-center space-x-4">
              <Avatar variant="lg">
                <Headshot />
              </Avatar>
              <div>
                <p className="font-semibold text-gray-800">Mike Bifulco</p>
                <p className="text-sm text-gray-600">
                  CTO Craftwork (S23), Ex-Google/Stripe/Microsoft
                </p>
              </div>
            </div>
            <p className="mb-2 text-gray-500">
              Join{' '}
              <span className="font-bold text-pink-600">
                <SubscriberCount />
              </span>{' '}
              developers, founders, and product builders getting smarter every
              week.
            </p>
            <div className="mb-6 flex flex-wrap gap-2">
              <Badge
                variant="secondary"
                className="bg-pink-100 text-xs text-pink-800"
              >
                <Code className="mr-1 h-3 w-3" /> Front-End Dev
              </Badge>
              <Badge
                variant="secondary"
                className="bg-purple-100 text-xs text-purple-800"
              >
                <Zap className="mr-1 h-3 w-3" /> Design Principles
              </Badge>
              <Badge
                variant="secondary"
                className="bg-green-100 text-xs text-green-800"
              >
                <Rocket className="mr-1 h-3 w-3" /> Founder Tips
              </Badge>
            </div>
          </div>
          <div className="w-full md:w-1/3">
            <div className="">
              <h3 className="mb-2 text-gray-800">
                Next issue drops <span className="font-bold">{daysText}!</span>
                <CornerRightDown className="mt-2 mr-2 inline-block h-4 w-4" />
              </h3>
              <SubscriptionForm
                source="newsletter-cta-v5"
                buttonText={titleOptions[titleIndex].buttonText}
              />
              <p className="mt-2 text-xs text-gray-500">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterBannerDetailed;
