import React from 'react';

import { Stack } from '@chakra-ui/react';

import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';

import SEO from '../../components/seo';
import { NewsletterSignup } from '../../components/NewsletterSignup';

import mdxOptions from '../../utils/mdxOptions';
import { components } from '../../utils/MDXProviderWrapper';

// fetch my bio from github and return it as mdx in getserversideprops
export async function getStaticProps() {
  const res = await fetch(
    'https://raw.githubusercontent.com/mbifulco/mbifulco/main/README.md'
  );
  const content = await res.text();
  const mdxSource = await serialize(content, mdxOptions);

  return {
    props: {
      mdxSource,
    },
  };
}

const AboutPage = ({ mdxSource }) => (
  <>
    <SEO
      title="About Mike Bifulco - founder, developer advocate, designer, writer"
      description="Mike Bifulco is a serial entrepreneur, author, and software developer, and former Stripe, Google, and Microsoft employee, working to build great products."
    />
    <Stack>
      <MDXRemote {...mdxSource} components={components} />
    </Stack>
    <NewsletterSignup />
  </>
);

export default AboutPage;
