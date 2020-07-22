import React from 'react';

import { Heading } from '@chakra-ui/core';

import { DefaultLayout as Layout } from '../../components/Layouts';
import { NewsletterSignup } from '../../components/NewsletterSignup';

const NewsletterPage = () => {
  return (
    <Layout>
      <Heading as="h1" marginBottom="2rem">
        Join the newsletter
      </Heading>
      <NewsletterSignup />
    </Layout>
  );
};

export default NewsletterPage;
