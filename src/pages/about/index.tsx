import type { NextPage } from 'next';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { MDXRemote } from 'next-mdx-remote';

import NewsletterSignup from '@/components/NewsletterSignup/NewsletterBannerFancy';
import SEO from '@/components/seo';
import { serialize } from '@/utils/mdx';
import { components } from '@/utils/MDXProviderWrapper';

// fetch my bio from github and return it as mdx in getserversideprops
export async function getStaticProps() {
  const res = await fetch(
    'https://raw.githubusercontent.com/mbifulco/mbifulco/main/README.md'
  );
  const content = await res.text();
  const mdxSource = await serialize(content);

  return {
    props: {
      mdxSource,
    },
    revalidate: 15 * 60, // 15 minutes
  };
}

type AboutPageProps = {
  mdxSource: MDXRemoteSerializeResult;
};

const AboutPage: NextPage<AboutPageProps> = ({ mdxSource }) => (
  <>
    <SEO
      title="About Mike Bifulco - founder, developer advocate, designer, writer"
      description="Mike Bifulco is a serial entrepreneur, author, and software developer, and former Stripe, Google, and Microsoft employee, working to build great products."
    />
    <main className="mx-auto max-w-4xl">
      <div className="flex flex-col">
        <MDXRemote {...mdxSource} components={components} />
      </div>
    </main>
    <NewsletterSignup />
  </>
);

export default AboutPage;
