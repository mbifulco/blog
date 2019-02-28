import React from 'react'
import PropTypes from 'prop-types'

// Utilities
import { kebabCase } from 'lodash'

// Components
import { Helmet } from 'react-helmet'
import { Link, graphql } from 'gatsby'

import Tag from '../components/tag'
import Layout from '../components/layout'

import classes from '../styles/post.module.css'
import tagsClasses from '../styles/tagsIndex.module.css'

const TagsPage = ({
  data: {
    allMarkdownRemark: { group },
    site: {
      siteMetadata: { title },
    },
  },
}) => (
  <Layout>
    <Helmet title={title} />
    <div className={classes.post}>
      <div className={classes.postContent}>
        <h1>Tags</h1>
        <ul className={tagsClasses.list}>
          {group.map(tag => (
            <li key={tag.fieldValue} className={tagsClasses.listItem}>
              <Link to={`/tags/${kebabCase(tag.fieldValue)}/`}>
                <Tag>
                  {tag.fieldValue} ({tag.totalCount})
                </Tag>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </Layout>
)

TagsPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      group: PropTypes.arrayOf(
        PropTypes.shape({
          fieldValue: PropTypes.string.isRequired,
          totalCount: PropTypes.number.isRequired,
        }).isRequired
      ),
    }),
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }),
    }),
  }),
}

export default TagsPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      limit: 2000
      filter: { frontmatter: { published: { ne: false } } }
    ) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`
