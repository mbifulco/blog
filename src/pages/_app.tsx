import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import * as Fathom from 'fathom-client';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

import { env } from '@utils/env';
import { AnalyticsProvider } from '../utils/analytics';

import '../styles/globals.css';
import '../components/CarbonAd/CarbonAd.css';

import { trpc } from '@utils/trpc';
import DefaultLayout from '../components/Layouts/DefaultLayout';

// Check that PostHog is client-side (used to handle Next.js SSR)
if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: 'https://mikebifulco.com/ingest',
    ui_host: 'https://app.posthog.com',
    // Enable debug mode in development
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug();
    },
  });
}

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    Fathom.load(env.NEXT_PUBLIC_FATHOM_ID, {
      includedDomains: ['mikebifulco.com', 'www.mikebifulco.com'],
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

  return (
    <PostHogProvider client={posthog}>
      <AnalyticsProvider>
        <DefaultLayout>
          <Component {...pageProps} />
        </DefaultLayout>
      </AnalyticsProvider>
    </PostHogProvider>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default trpc.withTRPC(MyApp);
