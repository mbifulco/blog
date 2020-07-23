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
        break;
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
        break;
      }
      default:
        break;
    }

    if (idx === 1) {
      return (
        <div key="double-whammy">
          {idx === 1 && <NewsletterSignup key="newsletter" />}
          {postEl}
        </div>
      );
    }

    return postEl;
  });
};

export default PostFeed;
