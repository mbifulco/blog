import React from 'react';

import { Post } from '..';
import { useRecentPosts } from '../../utils/recentPostsQuery';

const PostFeed = () => {
  const recentPosts = useRecentPosts();

  return recentPosts.map((entry) => {
    switch (entry.type) {
      case 'takeshape': {
        return <Post post={entry.post} key={entry.id} summary />;
      }
      case 'mdx': {
        return (
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
        return null;
    }
  });
};

export default PostFeed;
