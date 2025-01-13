import type { AppProps } from 'next/app';
import localFont from 'next/font/local';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

import FathomAnalytics from '@components/Analytics/Fathom';
import DefaultLayout from '@components/Layouts/DefaultLayout';
import { env } from '@utils/env';
import { trpc } from '@utils/trpc';

import '../styles/globals.css';
import '../components/CarbonAd/CarbonAd.css';

const quickdraw = localFont({
  src: '../../public/fonts/TAYQuickDraw.woff',
  variable: '--font-quickdraw',
});

const dumpling = localFont({
  src: '../../public/fonts/TAYDumpling.woff',
  variable: '--font-dumpling',
});

const fontVariables = [quickdraw.variable, dumpling.variable].join(' ');

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
  return (
    <PostHogProvider client={posthog}>
      <div className={fontVariables}>
        <DefaultLayout>
          <FathomAnalytics siteId={env.NEXT_PUBLIC_FATHOM_ID} />
          <Component {...pageProps} />
        </DefaultLayout>
      </div>
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
