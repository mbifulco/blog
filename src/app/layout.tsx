import type { Metadata } from 'next';
import { Jost, Source_Serif_4 } from 'next/font/google';
import localFont from 'next/font/local';
import { Toaster } from 'sonner';

import FathomAnalytics from '@components/Analytics/Fathom';
import { env } from '@utils/env';
import config, { BASE_SITE_URL } from '@/config';
import PostHogProvider from './posthog-provider';
import TRPCProvider from './trpc-provider';

import '../styles/globals.css';
import '../components/CarbonAd/CarbonAd.css';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_SITE_URL),
  title: {
    default: config.title,
    template: `%s | ${config.title}`,
  },
  description: config.description,
  openGraph: {
    type: 'website',
    siteName: 'mikebifulco.com',
    url: BASE_SITE_URL,
    title: config.title,
    description: config.description,
  },
  twitter: {
    card: 'summary_large_image',
    site: config.social.twitter,
    creator: config.social.twitter,
  },
  alternates: {
    types: {
      'application/rss+xml': [
        { url: '/rss.xml', title: 'mikebifulco.com RSS feed' },
      ],
    },
  },
};

const quickdraw = localFont({
  src: '../../public/fonts/TAYQuickDraw.woff',
  variable: '--font-quickdraw',
});

const dumpling = localFont({
  src: '../../public/fonts/TAYDumpling.woff',
  variable: '--font-dumpling',
});

// Futura is a system font on Apple platforms; Jost stands in everywhere else.
const jost = Jost({ subsets: ['latin'], variable: '--font-jost' });

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-source-serif',
});

const fontVariables = [
  quickdraw.variable,
  dumpling.variable,
  jost.variable,
  sourceSerif.variable,
].join(' ');

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
            <div className={`${fontVariables} font-sans`}>
              <FathomAnalytics siteId={env.NEXT_PUBLIC_FATHOM_ID} />
              {children}
              <Toaster
                richColors
                closeButton
                position="top-right"
                toastOptions={{
                  style: {
                    background: 'var(--stock-raised)',
                    border: '2px solid var(--riso-blue)',
                    borderRadius: 0,
                    color: 'var(--ink)',
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
