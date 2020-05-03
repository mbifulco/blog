import React from 'react';
import PropTypes from 'prop-types';

import SEO from '../components/seo';
import Layout from '../components/layout';
import style from '../styles/post.module.css';

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const SinglePage = ({ pageContext, location }) => {
  const { title, bodyHtml } = pageContext;

  const formattedTitle = capitalizeFirstLetter(title);
  return (
    <Layout>
      <SEO
        title={formattedTitle}
        // description={excerpt}
        // image={getImageUrl(featureImage.path)}
        ogType="article"
        location={location}
      />

      <div className={style.post}>
        <div className={style.postContent}>
          <h1 className={style.title}>{formattedTitle}</h1>

          {/* eslint-disable-next-line react/no-danger */}
          <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
        </div>
      </div>
    </Layout>
  );
};

SinglePage.propTypes = {
  pageContext: PropTypes.shape({
    bodyHtml: PropTypes.shape({}),
    title: PropTypes.string,
  }),
  location: PropTypes.shape({}),
};

export default SinglePage;
