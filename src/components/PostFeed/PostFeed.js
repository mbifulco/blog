import React from 'react';

import { NewsletterSignup, Post } from '..';
import { useRecentPosts } from '../../utils/recentPostsQuery';

const PostFeed = () => {
  const recentPosts = useRecentPosts();

  return recentPosts.map((entry, idx) => {
    let postEl = null;
    switch (entry.type) {
      case 'takeshape': {
        postEl = <Post post={entry.post} key={entry.id} summary />;
      }
      case 'mdx': {
        postEl = (
          <Post
            post={{
              ...entry.post,
              ...entry.post.frontmatter,
            }}
            key={entry.id}
            summary
          />
        );
      }
      default:
        break;
    }

    return (
      <>
        {idx === 1 && <NewsletterSignup />}
        {postEl}
      </>
    );
  });
};

export default PostFeed;
