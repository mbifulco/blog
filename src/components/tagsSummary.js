import React from 'react';
import PropTypes from 'prop-types';

import { map } from 'lodash';

import Tag from './tag';

import classes from '../styles/tagsSummary.module.css';

const TagsSummary = ({ tags }) => {
  if (!tags || tags.length <= 0) return null;

  return (
    <div className={classes.container}>
      {map(tags, (tag, id) => (
        <Tag
          key={`tag-${id || tag.name || tag}`}
          url={`/tags/${tag.name || tag}`}
        >
          {tag.name || tag}
        </Tag>
      ))}
    </div>
  );
};

TagsSummary.propTypes = {
  tags: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.shape({}), PropTypes.string])
  ),
};

export default TagsSummary;
