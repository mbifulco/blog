import localFont from 'next/font/local';
import { Toaster } from 'sonner';

import FathomAnalytics from '@components/Analytics/Fathom';
import { env } from '@utils/env';
import PostHogProvider from './posthog-provider';
import TRPCProvider from './trpc-provider';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TRPCProvider>
          <PostHogProvider>
            <div className={fontVariables}>
              <FathomAnalytics siteId={env.NEXT_PUBLIC_FATHOM_ID} />
              {children}
              <Toaster
                richColors
                closeButton
                position="top-right"
                toastOptions={{
                  style: {
                    background: 'white',
                    border: '1px solid #e5e5e5',
                    color: '#333',
                  },
                }}
              />
            </div>
          </PostHogProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
