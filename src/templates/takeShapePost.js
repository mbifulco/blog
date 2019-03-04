import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'

import SEO from '../components/seo'
import Layout from '../components/layout'
import Post from '../components/post'

const TakeShapePostTemplate = ({ data, pageContext, location }) => {
  const {
    title,
    date,
    path,
    deck,
    tags,
    excerpt: autoExcerpt,
    id,
    bodyHtml: html,
  } = data.takeshape.post
  const { next, previous } = pageContext

  return (
    <Layout>
      <SEO
        title={title}
        description={deck || autoExcerpt}
        // image={coverImage ? coverImage.childImageSharp.fluid.src : undefined}
        ogType="article"
        location={location}
      />
      <Post
        key={id}
        title={title}
        date={date}
        path={path}
        // coverImage={coverImage}
        html={html}
        previousPost={previous}
        nextPost={next}
        tags={tags}
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
        title
        path
        deck
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
