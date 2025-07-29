import type { Metadata } from 'next';

import { cn } from '@utils/cn';

export const metadata: Metadata = {
  title: 'Newsletter Signup - Mike Bifulco',
  description:
    'Subscribe to Tiny Improvements - weekly newsletter for startup founders, indiehackers, and product builders',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Newsletter Signup - Mike Bifulco',
    description:
      'Subscribe to Tiny Improvements - weekly newsletter for startup founders, indiehackers, and product builders',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Newsletter Signup - Mike Bifulco',
    description:
      'Subscribe to Tiny Improvements - weekly newsletter for startup founders, indiehackers, and product builders',
  },
};

// This layout excludes the default site layout (header/footer)
// The page will render without any wrapping layout
export default function NewsletterSignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'min-h-screen bg-cover bg-center bg-no-repeat',
        'bg-[url(https://res.cloudinary.com/mikebifulco-com/image/upload/v1753792231/newsletters/washed-up-bg_inchla.webp)]'
      )}
    >
      {children}
    </div>
  );
}
