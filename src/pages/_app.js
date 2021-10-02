/* eslint-disable react/prop-types */
import { AnalyticsProvider } from '../utils/analytics';

const { ChakraProvider } = require('@chakra-ui/react');

// import App from 'next/app'

function MyApp({ Component, pageProps }) {
  return (
    <AnalyticsProvider>
      <ChakraProvider>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} />
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
