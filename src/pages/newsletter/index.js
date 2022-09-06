import React from 'react';

import Link from 'next/link';

import { Heading, Text } from '@chakra-ui/react';

import { SEO } from '../../components';
import { DefaultLayout as Layout } from '../../components/Layouts';
import { NewsletterSignup } from '../../components/NewsletterSignup';

import { getAllNewsletters } from '../../lib/newsletters';

export async function getStaticProps() {
  const newsletters = await getAllNewsletters();

  return {
    props: {
      newsletters,
    },
  };
}

const NewsletterPage = ({ newsletters }) => (
  <Layout>
    <SEO title="Subscribe to Tiny Improvements: articles software dev, design, and climate" />
    <Heading as="h1" marginBottom="2rem">
      Subscribe to Tiny Improvements
    </Heading>
    <Text>
      An occasional newsletter by me, for you. You&apos;ll get my thoughts on
      design and development, building products and companies, and philosophy
      for living a life you love in an ever-changing world.
    </Text>

    {newsletters.map((newsletter) => {
      const { slug, title } = newsletter?.frontmatter;
      return (
        <Heading as="h2" key={slug}>
          <Link href={`/newsletter/${slug}`}>{title}</Link>
        </Heading>
      );
    })}

    <NewsletterSignup />
  </Layout>
);

export default NewsletterPage;
