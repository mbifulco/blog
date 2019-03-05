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
  data: PropTypes.shape({}),
}

export default Tags

// export const pageQuery = graphql`
//   query($tag: String) {

//   }
// `
