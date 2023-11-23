import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { ChakraProvider } from '@chakra-ui/react';
import * as Fathom from 'fathom-client';

import { env } from '@utils/env.mjs';
import { AnalyticsProvider } from '../utils/analytics';

import '../styles/globals.css';
import '../components/CarbonAd/CarbonAd.css';

import DefaultLayout from '../components/Layouts/DefaultLayout';

// import App from 'next/app'

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
    }
    // Record a pageview when route changes
    router.events.on('routeChangeComplete', onRouteChangeComplete);

    // Unassign event listener
    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete);
    };
  });

  return (
    <AnalyticsProvider>
      <ChakraProvider>
        <DefaultLayout>
          <Component {...pageProps} />
        </DefaultLayout>
      </ChakraProvider>
    </AnalyticsProvider>
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

export default MyApp;
