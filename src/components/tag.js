import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import * as classes from '../styles/tag.module.scss';

const Tag = ({ children, url }) => {
  let tag = <span className={classes.container}>{children}</span>;

  if (url) {
    tag = (
      <Link href={url} className={classes.link}>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a>{tag}</a>
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
