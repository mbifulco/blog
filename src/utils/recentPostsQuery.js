import { graphql, useStaticQuery } from 'gatsby';
import { sortBy, union } from 'lodash';
import moment from 'moment';

export const useRecentPosts = () => {
  const { mdxPosts, takeshape } = useStaticQuery(
    graphql`
      {
        mdxPosts: allMdx(
          filter: {
            frontmatter: { type: { in: "post" }, published: { eq: true } }
          }
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
    `
  );

  const { posts } = takeshape;

  const takeshapePostElements = posts.items.map((post) => {
    const { _id: id } = post;

    return {
      type: 'takeshape',
      date: moment(post._enabledAt),
      post,
      id,
    };
  });

  const mdxPostElements = mdxPosts.nodes.map((post) => {
    return {
      type: 'mdx',
      date: moment(post.frontmatter.date),
      post,
      id: post.id,
    };
  });

  const allPostsInOrder = sortBy(
    union(takeshapePostElements, mdxPostElements),
    (a) => -a.date.valueOf()
  );

  return allPostsInOrder;
};
