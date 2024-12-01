// app/providers.tsx
'use client';

import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouterType } from '@hooks/useRouterType';
import posthog, { PostHogConfig } from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

import { env } from '@utils/env';

const phConfig: Partial<PostHogConfig> = {
  api_host: 'https://mikebifulco.com/ingest',
  person_profiles: 'identified_only',
  capture_pageview: false, // Disable automatic pageview capture, as we capture manually
} as const;

export function PHProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, phConfig);
  }, []);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}

// New component to track page views
const PosthogPageView = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;

    const searchParamsString = searchParams?.toString() ?? '';
    const url = window.origin + pathname + searchParamsString;
    posthog.capture('$pageview', {
      $current_url: url,
    });
  }, [pathname, searchParams]);

  return null;
};

const PosthogAppRouter = () => {
  return (
    <Suspense fallback={null}>
      <PosthogPageView />
    </Suspense>
  );
};

/**
 * This component is used to integrate Posthog with Next.js,
 * and adjusts itself depending on the current route, regardless of
 * whether it's from the Pages or App Router.
 */
export const PosthogAnalytics = () => {
  const routerType = useRouterType();
  if (routerType === 'pages') {
    return <PosthogPagesRouter />;
  }
  return <PosthogAppRouter />;
};

export default PHProvider;
