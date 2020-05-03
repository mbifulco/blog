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
        <Tag key={`tag-${id}`} url={`/tags/${tag.name}`}>
          {tag.name}
        </Tag>
      ))}
    </div>
  );
};

TagsSummary.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.object),
};

export default TagsSummary;
