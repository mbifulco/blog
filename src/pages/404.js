import React from 'react';
import PropTypes from 'prop-types';

import Layout from '../components/layout';
import SEO from '../components/seo';

const NotFoundPage = ({ location }) => (
  <Layout>
    <SEO title="404: Not found" location={location} />
    <h1>Hey, shit, sorry, this -- isn't a page.</h1>
    <p>If you're expecting something to be here, tweet at me angrily.</p>
  </Layout>
);

NotFoundPage.propTypes = {
  location: PropTypes.shape({}),
};

export default NotFoundPage;
