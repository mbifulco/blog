import React from 'react';

import { Heading } from '@chakra-ui/core';

import { DefaultLayout as Layout } from '../../components/Layouts';
import { NewsletterSignup } from '../../components/NewsletterSignup';

import classes from './NewsletterPage.module.css';

const NewsletterPage = () => {
  return (
    <Layout>
      <div className={classes.container}>
        <Heading as="h1">Join the newsletter</Heading>
      </div>
      <NewsletterSignup />
    </Layout>
  );
};

export default NewsletterPage;
