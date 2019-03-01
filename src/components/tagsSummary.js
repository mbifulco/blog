import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'

import { map } from 'lodash'

import Tag from './tag'

import classes from '../styles/tagsSummary.module.css'

const TagsSummary = ({ tags }) => {
  if (!tags || tags.length <= 0) return null

  return (
    <div>
      <header className={classes.header}>Tagged with</header>
      <small>
        {map(tags, tag => (
          <Tag url={`/tags/${tag}`}>{tag}</Tag>
        ))}
      </small>
    </div>
  )
}

TagsSummary.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
}

export default TagsSummary
