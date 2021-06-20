import React from 'react';

import { DefaultLayout } from '../components/Layouts';
import SEO from '../components/seo';

const NotFoundPage = () => (
  <DefaultLayout>
    <SEO title="404: Not found" />
    <h1>Hey, shit, sorry, this -- isn't a page.</h1>
    <p>If you're expecting something to be here, tweet at me angrily.</p>
  </DefaultLayout>
);


export default NotFoundPage;
