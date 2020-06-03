import React from 'react';
import PropTypes from 'prop-types';

import SEO from '../components/seo';
import Layout from '../components/layout';
import MentionsSummary from '../components/mentionsSummary';
import { NewsletterSignup } from '../components/NewsletterSignup';
import TagsSummary from '../components/tagsSummary';
import WebmentionMetadata from '../components/webmentionMetadata';

import style from '../styles/post.module.css';

const SinglePage = ({ children, pageContext, location }) => {
  const { mentions } = pageContext;
  const {
    author,
    coverImageUrl,
    excerpt,
    publishedAt,
    title,
    tags,
  } = pageContext.frontmatter;

  return (
    <Layout>
      <SEO
        canonical={location.href}
        title={title}
        description={excerpt}
        image={coverImageUrl && coverImageUrl}
        ogType="article"
        location={location}
      />

      <div className={style.post}>
        <div className={style.postContent}>
          <h1 className={style.title}>{title}</h1>
          <TagsSummary tags={tags} />
          <WebmentionMetadata
            location={location}
            coverImageUrl={coverImageUrl}
            summary={excerpt && excerpt}
            author={author && author}
            publishedAt={publishedAt && publishedAt}
          />
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
      author: PropTypes.string,
      coverImageUrl: PropTypes.string,
      excerpt: PropTypes.string,
      publishedAt: PropTypes.string,
      title: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string),
    }),
    mentions: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  location: PropTypes.shape({
    href: PropTypes.string,
  }),
};

export default SinglePage;
