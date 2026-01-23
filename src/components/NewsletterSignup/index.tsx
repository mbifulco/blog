'use client';

import React, { useEffect, useState } from 'react';
import { useFeatureFlagVariantKey, usePostHog } from 'posthog-js/react';

import Fancy from './NewsletterBannerFancy';
import Simple from './NewsletterBannerSimple';
import Detailed from './NewsletterBannerDetailed';
import Hero from './NewsletterHero';

type FooterBannerVariant = 'control' | 'simple' | 'detailed' | 'hero';

const BANNER_COMPONENTS: Record<FooterBannerVariant, React.ComponentType> = {
  control: Fancy,
  simple: Simple,
  detailed: Detailed,
  hero: Hero,
};

export const NewsletterSignup: React.FC = () => {
  const posthog = usePostHog();
  const variantKey = useFeatureFlagVariantKey('newsletter_footer_banner_test');
  const [isClient, setIsClient] = useState(false);
  const [hasTrackedExposure, setHasTrackedExposure] = useState(false);

  // Handle SSR/hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Track experiment exposure once variant is loaded
  useEffect(() => {
    if (isClient && variantKey && !hasTrackedExposure) {
      posthog?.capture('newsletter_footer_banner_viewed', {
        variant: variantKey,
        $feature_flag: 'newsletter_footer_banner_test',
        $feature_flag_response: variantKey,
      });
      setHasTrackedExposure(true);
    }
  }, [isClient, variantKey, hasTrackedExposure, posthog]);

  // Determine which variant to show
  // Default to control for SSR and until feature flag loads
  const variant = (isClient && variantKey ? variantKey : 'control') as FooterBannerVariant;
  const BannerComponent = BANNER_COMPONENTS[variant] || Fancy;

  return <BannerComponent />;
};

export default NewsletterSignup;
