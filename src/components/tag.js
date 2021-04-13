import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';

import * as classes from '../styles/tag.module.css';

const Tag = ({ children, url }) => {
  let tag = <span className={classes.container}>{children}</span>;

  if (url) {
    tag = (
      <Link to={url} className={classes.link}>
        {tag}
      </Link>
    );
  }
  return tag;
};

Tag.propTypes = {
  children: PropTypes.node,
  url: PropTypes.string,
};

export default Tag;
