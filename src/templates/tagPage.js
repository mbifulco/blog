import React from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'pluralize';
import Link from 'next/link';

import Tag from '../components/tag';
import Post from '../components/post';
import { DefaultLayout as Layout } from '../components/Layouts';
import * as classes from '../styles/post.module.scss';

const Tags = ({ tag, total, posts }) => {

  const tagHeader = (
    <span>
      <Tag>{tag}:</Tag> {total} {Pluralize('post', total)}
    </span>
  );

  return (
    <Layout>
      <div className={classes.post}>
        <div className={classes.postContent}>
          <h1>{tagHeader}</h1>

          {posts.map((post) => {
            const { _id: id } = post;

            return <Post post={post} key={id} summary />;
          })}

          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <Link href="/tags"><a>All tags</a></Link>
        </div>
      </div>
    </Layout>
  );
};

Tags.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object()),
  tag: PropTypes.string,
  total: PropTypes.number,
};

export default Tags;
