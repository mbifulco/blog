import React from 'react'
import PropTypes from 'prop-types'
import Pluralize from 'pluralize'

import { Link, graphql } from 'gatsby'

import Tag from '../components/tag'
import Post from '../components/post'
import Layout from '../components/layout'
import classes from '../styles/post.module.css'

const Tags = ({ pageContext, data }) => {
  const { tag } = pageContext
  const { edges, totalCount } = data.allMarkdownRemark

  const tagHeader = (
    <span>
      <Tag>{tag}:</Tag> {totalCount} {Pluralize('post', totalCount)}
    </span>
  )

  return (
    <Layout>
      <div className={classes.post}>
        <div className={classes.postContent}>
          <h1 className={classes.title}>{tagHeader}</h1>

          {edges.map(({ node }) => {
            const {
              id,
              excerpt: autoExcerpt,
              frontmatter: { title, date, path, author, coverImage, excerpt },
            } = node

            return (
              <Post
                key={id}
                title={title}
                date={date}
                path={path}
                author={author}
                coverImage={coverImage}
                excerpt={excerpt || autoExcerpt}
              />
            )
          })}

          <Link to="/tags">All tags</Link>
        </div>
      </div>
    </Layout>
  )
}

Tags.propTypes = {
  pageContext: PropTypes.shape({
    tag: PropTypes.string.isRequired,
  }),
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      totalCount: PropTypes.number.isRequired,
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              path: PropTypes.string.isRequired,
              title: PropTypes.string.isRequired,
            }),
          }),
        }).isRequired
      ),
    }),
  }),
}

export default Tags

export const pageQuery = graphql`
  query($tag: String) {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          id
          excerpt
          frontmatter {
            title
            date(formatString: "DD MMMM YYYY")
            path
            author
            excerpt
            coverImage {
              childImageSharp {
                fluid(maxWidth: 800) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
`
