import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import moment from 'moment';

import { Box } from '@chakra-ui/core';

import union from 'lodash/union';
import sortBy from 'lodash/sortBy';

import SEO from '../components/seo';
import Post from '../components/post';

import { DefaultLayout } from '../components/Layouts';
import { NewsletterSignup } from '../components/NewsletterSignup';

const PostsPage = (props) => {
  const { data, location } = props;

  const { takeshape, mdxPosts } = data;
  const { posts } = takeshape;

  const takeshapePostElements = posts.items.map((post) => {
    const { _id: id } = post;
    const postElement = <Post post={post} key={id} summary />;

    return {
      date: moment(post._enabledAt),
      post: postElement,
      id,
    };
  });

  const mdxPostElements = mdxPosts.nodes.map((post) => {
    const postElement = (
      <Post
        post={{
          ...post,
          ...post.frontmatter,
        }}
        key={post.id}
        summary
      />
    );

    return {
      date: moment(post.frontmatter.date),
      post: postElement,
      id: post.id,
    };
  });

  const allPostsInOrder = sortBy(
    union(takeshapePostElements, mdxPostElements),
    (a) => -a.date.valueOf()
  );

  return (
    <>
      <SEO location={location} />
      <DefaultLayout>
        {allPostsInOrder.map((postElement, idx) => {
          const { post } = postElement;

          if (idx === 0) {
            return (
              <div key="firstpost">
                {post}

                <Box display="flex" justifyContent="center">
                  <NewsletterSignup />
                </Box>
              </div>
            );
          }

          return post;
        })}
      </DefaultLayout>
    </>
  );
};

PostsPage.propTypes = {
  data: PropTypes.object.isRequired,
  location: PropTypes.shape({}),
  pageContext: PropTypes.shape({
    nextPagePath: PropTypes.string,
    previousPagePath: PropTypes.string,
  }),
};

export const postsQuery = graphql`
  {
    mdxPosts: allMdx(
      filter: { frontmatter: { type: { in: "post" }, published: { eq: true } } }
    ) {
      nodes {
        id
        frontmatter {
          date
          published
          tags
          title
          type
          path
        }
        excerpt(truncate: true)
        timeToRead
      }
    }
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

export default PostsPage;
