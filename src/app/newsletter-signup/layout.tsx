import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Newsletter Signup - Mike Bifulco',
  description: 'Subscribe to Tiny Improvements - weekly newsletter for startup founders, indiehackers, and product builders',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Newsletter Signup - Mike Bifulco',
    description: 'Subscribe to Tiny Improvements - weekly newsletter for startup founders, indiehackers, and product builders',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Newsletter Signup - Mike Bifulco',
    description: 'Subscribe to Tiny Improvements - weekly newsletter for startup founders, indiehackers, and product builders',
  },
};

// This layout excludes the default site layout (header/footer)
// The page will render without any wrapping layout
export default function NewsletterSignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}