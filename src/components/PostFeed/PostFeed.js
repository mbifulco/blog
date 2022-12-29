import React from 'react';
import PropTypes from 'prop-types';

import { NewsletterSignup } from '../NewsletterSignup';
import Post from '../post';

const PostFeed = ({ posts }) => (
  <>
    {posts.map((post, idx) => {
      const postEl = <Post post={post} key={post.slug} summary />;

      if (idx === 1) {
        return (
          <div key="newsletter-wrapper">
            {idx === 1 && <NewsletterSignup key="newsletter" />}
            {postEl}
          </div>
        );
      }

      return postEl;
    })}
  </>
);

PostFeed.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape({})),
};

export default PostFeed;
