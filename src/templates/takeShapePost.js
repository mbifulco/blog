import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { getImageUrl } from 'takeshape-routing'

import SEO from '../components/seo'
import Layout from '../components/layout'
import Post from '../components/post'

const TakeShapePostTemplate = ({ data, pageContext, location }) => {
  const {
    featureImage,
    title,
    date,
    path,
    excerpt,
    tags,
    id,
    bodyHtml: html,
  } = data.takeshape.post
  const { next, previous } = pageContext

  return (
    <Layout>
      <SEO
        title={title}
        description={excerpt}
        // image={coverImage ? coverImage.childImageSharp.fluid.src : undefined}
        ogType="article"
        location={location}
      />
      <Post
        key={id}
        title={title}
        date={date}
        path={path}
        coverImageUrl={getImageUrl(featureImage.path)}
        coverImageAlt={featureImage.description}
        html={html}
        previousPost={previous}
        nextPost={next}
        tags={tags.map(tag => tag.name)}
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
