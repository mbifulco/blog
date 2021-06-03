import React from 'react';

import { NewsletterSignup, Post } from '..';

const PostFeed = ({ posts }) => {
  return (
    <>
      {posts.map((post, idx) => {
        let postEl = <Post post={post} key={post.slug} summary />;

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
};

export default PostFeed;
