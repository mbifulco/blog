import React from 'react';

import { SEO, PostFeed } from '../components';

import { DefaultLayout } from '../components/Layouts';

const PostsPage = () => {
  return (
    <DefaultLayout>
      <SEO title="All posts" />
      {/* <PostFeed /> */}
    </DefaultLayout>
  );
};

export default PostsPage;
