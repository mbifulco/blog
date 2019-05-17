import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { getImageUrl } from 'takeshape-routing'

import SEO from '../components/seo'
import Layout from '../components/layout'
import Post from '../components/post'

const TakeShapePostTemplate = ({ data, pageContext, location }) => {
  const { featureImage, title, excerpt, id } = data.takeshape.post
  const { next, previous } = pageContext

  return (
    <Layout>
      <SEO
        title={title}
        description={excerpt}
        image={getImageUrl(featureImage.path)}
        ogType="article"
        location={location}
      />
      <Post
        key={id}
        post={data.takeshape.post}
        previous={previous}
        next={next}
      />
    </Layout>
  )
}

export default TakeShapePostTemplate

TakeShapePostTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.shape({
    next: PropTypes.object,
    previous: PropTypes.object,
  }),
  location: PropTypes.shape({}),
}

export const pageQuery = graphql`
  query($id: ID!) {
    takeshape {
      post: getPost(_id: $id) {
        tags {
          name
        }
        featureImage {
          path
          description
        }
        title
        path
        excerpt
        body
        bodyHtml
        _createdAt
        _updatedAt
        _enabled
        _enabledAt
        searchSummary
      }
    }
  }
`
