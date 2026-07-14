'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';

import NewsletterModal from '@components/NewsletterSignup/NewsletterModal';
import {
  POSTHOG_API_HOST,
  POSTHOG_CLIENT_PROXY_HOST,
  POSTHOG_UI_HOST,
} from '@lib/posthog/hosts';

// Initialize PostHog for App Router
if (typeof window !== 'undefined') {
  if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host:
        process.env.NODE_ENV === 'production'
          ? POSTHOG_CLIENT_PROXY_HOST
          : POSTHOG_API_HOST,
      ui_host: POSTHOG_UI_HOST,
      // Enable debug mode in development
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug();
      },
      capture_pageview: false, // Disable automatic pageview capture, we'll capture manually
      capture_pageleave: true,
    });
  }
}

export function PostHogPageview() {
  useEffect(() => {
    posthog.capture('$pageview');
  }, []);

  return null;
}

export default function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PHProvider client={posthog}>
      {children}
      <NewsletterModal />
    </PHProvider>
  );
}
