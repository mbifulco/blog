import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';

import SEO from '../components/seo';
import Layout from '../components/layout';
import Post from '../components/post';
import Navigation from '../components/navigation';

const Index = (props) => {
  const {
    data,
    location,
    pageContext: { nextPagePath, previousPagePath },
  } = props;

  const { takeshape } = data;
  const { posts } = takeshape;

  return (
    <>
      <SEO location={location} />
      <Layout>
        {posts.items.map((post) => {
          const { _id: id } = post;

          return <Post post={post} key={id} summary />;
        })}

        <Navigation
          previousPath={previousPagePath}
          previousLabel="Newer posts"
          nextPath={nextPagePath}
          nextLabel="Older posts"
        />
      </Layout>
    </>
  );
};

Index.propTypes = {
  data: PropTypes.object.isRequired,
  location: PropTypes.shape({}),
  pageContext: PropTypes.shape({
    nextPagePath: PropTypes.string,
    previousPagePath: PropTypes.string,
  }),
};

export const postsQuery = graphql`
  {
    takeshape {
      posts: getPostList(sort: [{ field: "_enabledAt", order: "DESC" }]) {
        items {
          body
          bodyHtml
          excerpt
          path
          title
          featureImage {
            path
            description
          }
          _id
          _version
          _contentTypeId
          _contentTypeName
          _createdAt
          _updatedAt
          _enabled
          _enabledAt
          searchSummary
        }
      }
    }
  }
`;

export default Index;
