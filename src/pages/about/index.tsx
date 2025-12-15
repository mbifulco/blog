import type { NextPage } from 'next';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { MDXRemote } from 'next-mdx-remote';
import { useRef } from 'react';
import posthog from 'posthog-js';

import NewsletterSignup from '@components/NewsletterSignup/NewsletterBannerFancy';
import SEO from '../../components/seo';
import { serialize } from '../../utils/mdx';
import { components } from '../../utils/MDXProviderWrapper';

// Treat GitHub as a CMS source using ISR
export async function getStaticProps() {
  try {
    // Fetch content from GitHub repository (acting as a CMS)
    const res = await fetch(
      'https://raw.githubusercontent.com/mbifulco/mbifulco/main/README.md',
      {
        headers: { 'Cache-Control': 'no-cache' },
        next: { revalidate: 15 * 60 }, // For Next.js 13+ cache control
      }
    );

    if (!res.ok) {
      throw new Error(
        `Failed to fetch content: ${res.status} ${res.statusText}`
      );
    }

    const content = await res.text();
    const mdxSource = await serialize(content);

    return {
      props: {
        mdxSource,
        lastFetched: new Date().toISOString(),
      },
      // Enable ISR with a 15-minute revalidation period
      revalidate: 15 * 60, // 15 minutes
    };
  } catch (error) {
    console.error('Error fetching content from GitHub:', error);

    // Return a fallback or last cached version
    return {
      props: {
        mdxSource: await serialize(
          '# Error loading content\nPlease check back later.'
        ),
        error: true,
      },
      revalidate: 60, // Try again more frequently when errors occur
    };
  }
}

type AboutPageProps = {
  mdxSource: MDXRemoteSerializeResult;
  lastFetched?: string;
  error?: boolean;
};

const AboutPage: NextPage<AboutPageProps> = ({ mdxSource, error }) => {
  const hasTrackedView = useRef(false);

  const handlePageViewed = () => {
    if (hasTrackedView.current) return;
    hasTrackedView.current = true;

    posthog.capture('about_page_viewed');
  };

  return (
    <>
      <SEO
        title="About Mike Bifulco - founder, developer advocate, designer, writer"
        description="Mike Bifulco is a serial entrepreneur, author, and software developer, and former Stripe, Google, and Microsoft employee, working to build great products."
      />
      <main className="mx-auto mb-8 max-w-4xl" onMouseEnter={handlePageViewed}>
      {error && (
        <div className="mb-6 border-l-4 border-yellow-400 bg-yellow-50 p-4">
          <p className="text-yellow-700">
            Content is temporarily unavailable. Showing cached version.
          </p>
        </div>
      )}
      <div className="prose prose-lg">
          <MDXRemote {...mdxSource} components={components} />
        </div>
      </main>

      <NewsletterSignup />
    </>
  );
};

export default AboutPage;
