import React from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <h1>Hey, shit, sorry, this -- isn't a page.</h1>
    <p>If you're expecting something to be here, tweet at me angrily.</p>
  </Layout>
)

export default NotFoundPage
