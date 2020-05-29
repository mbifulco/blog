import React from 'react';
import PropTypes from 'prop-types';

import SEO from '../components/seo';
import Layout from '../components/layout';
import MentionsSummary from '../components/mentionsSummary';
import { NewsletterSignup } from '../components/NewsletterSignup';
import TagsSummary from '../components/tagsSummary';
import style from '../styles/post.module.css';

const capitalizeFirstLetter = (string) => {
  if (!string) return null;
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const SinglePage = ({ children, pageContext, location }) => {
  const { title, tags } = pageContext.frontmatter;
  const { mentions } = pageContext;

  const formattedTitle = capitalizeFirstLetter(title);
  return (
    <Layout>
      <SEO title={formattedTitle} ogType="article" location={location} />

      <div className={style.post}>
        <div className={style.postContent}>
          <h1 className={style.title}>{formattedTitle}</h1>
          <TagsSummary tags={tags} />
          {children}
          <MentionsSummary mentions={mentions} />
        </div>
      </div>
      <NewsletterSignup tags={tags} />
    </Layout>
  );
};

SinglePage.propTypes = {
  children: PropTypes.node,
  pageContext: PropTypes.shape({
    frontmatter: PropTypes.shape({
      title: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string),
    }),
  }),
  location: PropTypes.shape({}),
};

export default SinglePage;
