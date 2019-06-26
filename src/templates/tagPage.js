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
  const { takeshape } = data
  const { total, items: posts } = takeshape.tags.posts

  const tagHeader = (
    <span>
      <Tag>{tag}:</Tag> {total} {Pluralize('post', total)}
    </span>
  )

  return (
    <Layout>
      <div className={classes.post}>
        <div className={classes.postContent}>
          <h1 className={classes.title}>{tagHeader}</h1>

          {posts.map(post => {
            const { _id: id } = post

            return <Post post={post} key={id} summary />
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
    tagId: PropTypes.string,
  }),
  data: PropTypes.shape({}),
}

export default Tags

export const pageQuery = graphql`
  query($tagId: ID!) {
    takeshape {
      tags: getTag(_id: $tagId) {
        _id
        name
        posts: postSet {
          total
          items {
            _enabledAt
            _id
            excerpt
            featureImage {
              description
              path
            }
            path
            title
          }
        }
      }
    }
  }
`
