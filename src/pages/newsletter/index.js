import React from 'react';

import { Heading } from '@chakra-ui/react';

import { SEO } from '../../components';
import { DefaultLayout as Layout } from '../../components/Layouts';
import { NewsletterSignup } from '../../components/NewsletterSignup';

const NewsletterPage = () => (
  <Layout>
    <SEO title="Join the newsletter: articles software dev, design, and climate" />
    <Heading as="h1" marginBottom="2rem">
      Join the newsletter
    </Heading>
    <NewsletterSignup />
  </Layout>
);

export default NewsletterPage;
