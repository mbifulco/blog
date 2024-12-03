'use client';

import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useRouterType } from '@hooks/useRouterType';
import * as Fathom from 'fathom-client';
import posthog from 'posthog-js';

const FATHOM_DOMAINS = ['mikebifulco.com', 'www.mikebifulco.com'];

const FathomPagesRouter = ({ siteId }: { siteId: string }) => {
  const router = useRouter();

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    Fathom.load(siteId, {
      includedDomains: FATHOM_DOMAINS,
      url: 'https://cdn.usefathom.com/script.js',
    });
    function onRouteChangeComplete() {
      Fathom.trackPageview();
      posthog?.capture('$pageview');
    }
    // Record a pageview when route changes
    router.events.on('routeChangeComplete', onRouteChangeComplete);

    // Unassign event listener
    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete);
    };
  });

  return null;
};

export const TrackPageView = ({ siteId }: { siteId: string }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Load the Fathom script on mount
  useEffect(() => {
    Fathom.load(siteId, {
      auto: false,
    });
  }, []);

  // Record a pageview when route changes
  useEffect(() => {
    if (!pathname) return;

    Fathom.trackPageview({
      url: pathname + searchParams?.toString(),
      referrer: document.referrer,
    });
    posthog?.capture('$pageview', {
      pathname,
      searchParams: searchParams?.toString(),
    });
  }, [pathname, searchParams]);

  return null;
};

const FathomAppRouter = ({ siteId }: { siteId: string }) => {
  return (
    <Suspense fallback={null}>
      <TrackPageView siteId={siteId} />
    </Suspense>
  );
};

type FathomAnalyticsProps = {
  siteId: string;
};
export const FathomAnalytics = ({ siteId }: FathomAnalyticsProps) => {
  const routerType = useRouterType();
  if (routerType === 'pages') {
    return <FathomPagesRouter siteId={siteId} />;
  }
  return <FathomAppRouter siteId={siteId} />;
};

export default FathomAnalytics;
