import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { getImageUrl } from 'takeshape-routing'

import SEO from '../components/seo'
import Layout from '../components/layout'
import Post from '../components/post'
import { NewsletterSignup } from '../components/NewsletterSignup'

const TakeShapePostTemplate = ({ data, pageContext, location }) => {
  const {
    author,
    canonical,
    featureImage,
    title,
    excerpt,
    id,
    summary,
    _enabledAt: publishedAt,
  } = data.takeshape.post
  const { mentions } = data
  const { next, previous } = pageContext

  const coverImageUrl = featureImage && getImageUrl(featureImage.path)

  return (
    <Layout>
      <SEO
        canonical={canonical}
        title={title}
        description={excerpt}
        image={getImageUrl(featureImage.path)}
        ogType="article"
        location={location}
      />
      <div
        style={{
          display: 'none',
        }}
      >
        <article className="h-card">
          <header>
            {coverImageUrl && (
              <img className="u-photo" src={coverImageUrl} alt="Hero" />
            )}
            <h1 className="p-name">{title}</h1>
          </header>
          <p className="p-summary e-content">{summary}</p>
          <footer>
            {author && (
              <a className="u-url p-name" href={location.href}>
                {author}
              </a>
            )}
          </footer>
          <time
            className="dt-published"
            itemProp="datepublished"
            dateTime={publishedAt}
          >
            {`${new Date(publishedAt).toISOString().replace('Z', '')}+01:00`}
          </time>
        </article>
      </div>
      <Post
        key={id}
        post={data.takeshape.post}
        previous={previous}
        next={next}
        mentions={mentions && mentions.nodes}
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
  location: PropTypes.shape({
    href: PropTypes.string,
  }),
}

export const pageQuery = graphql`
  query($id: ID!, $permalink: String!) {
    takeshape {
      post: getPost(_id: $id) {
        canonical
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
    mentions: allWebMentionEntry(filter: { wmTarget: { eq: $permalink } }) {
      nodes {
        wmTarget
        wmSource
        wmProperty
        wmId
        type
        url
        likeOf
        author {
          url
          type
          photo
          name
        }
        content {
          text
        }
      }
    }
  }
`
