import React from 'react';

import Layout from '../../components/layout';
import { NewsletterSignup } from '../../components/NewsletterSignup';

import classes from './NewsletterPage.module.css';

const NewsletterPage = () => {
  return (
    <Layout>
      <div className={classes.container}>
        <h1>Join the newsletter</h1>
      </div>
      <NewsletterSignup />
    </Layout>
  );
};

export default NewsletterPage;
