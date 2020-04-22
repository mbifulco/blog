import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { getImageUrl } from 'takeshape-routing'

import SEO from '../components/seo'
import Layout from '../components/layout'
import Post from '../components/post'

const TakeShapePostTemplate = ({ data, pageContext, location }) => {
  const {
    canonical,
    featureImage,
    title,
    excerpt,
    id,
    summary,
    _enabledAt: publishedAt,
  } = data.takeshape.post
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
            <a className="u-url p-name" href={location.href}>
              The author
            </a>
          </footer>
          <time
            className={'dt-published'}
            itemprop="datepublished"
            datetime={publishedAt}
          >
            {new Date(publishedAt).toISOString().replace('Z', '') + '+01:00'}
          </time>
        </article>
      </div>
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
  location: PropTypes.shape({
    href: PropTypes.string,
  }),
}

export const pageQuery = graphql`
  query($id: ID!) {
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
  }
`
