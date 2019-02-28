import React from 'react'
import PropTypes from 'prop-types'

import classes from '../styles/tag.module.css'

const Tag = ({ children }) => (
  <span className={classes.container}>{children}</span>
)

Tag.propTypes = {
  children: PropTypes.node,
}

export default Tag
