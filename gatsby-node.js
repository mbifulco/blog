const { paginate } = require('gatsby-awesome-pagination');
const path = require('path');
const { forEach, kebabCase } = require('lodash');

exports.sourceNodes = ({ actions }) => {
  actions.createTypes(`
    type ConvertkitTagYaml implements Node @dontInfer {
      id: ID!
      name: String!
    }
  `);
};

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;

  // import each of the page types to be rendered on the site
  const indexTemplate = path.resolve('./src/templates/index.js');
  const postTemplate = path.resolve('./src/templates/post.js');
  const tagPageTemplate = path.resolve('./src/templates/tagPage.js');

  return graphql(`
    {
      takeshape {
        tags: getTagList {
          items {
            _id
            name
          }
        }
        posts: getPostList(sort: [{ field: "_enabledAt", order: "DESC" }]) {
          items {
            _id
            _enabledAt
            path
            title
          }
        }
        siteMetadata: getSiteSettings {
          siteTitle
          postsPerPage
        }
      }
    }
  `).then((result) => {
    const { takeshape } = result.data;
    const { posts, siteMetadata, tags } = takeshape;

    if (result.errors) {
      return Promise.reject(result.errors);
    }

    posts.items.forEach((takeShapePost, idx) => {
      createPage({
        path: takeShapePost.path,
        component: postTemplate,
        context: {
          id: takeShapePost._id,
          type: 'post',
          next: idx === posts.items.length - 1 ? null : posts.items[idx + 1],
          previous: idx === 0 ? null : posts.items[idx - 1],
          permalink: `https://mikebifulco.com/${takeShapePost.path}/`,
        },
      });
    });

    paginate({
      createPage,
      items: posts.items,
      component: indexTemplate,
      itemsPerPage: siteMetadata.postsPerPage,
      pathPrefix: '/',
    });

    // tag pages
    forEach(tags.items, (tag) => {
      createPage({
        path: `/tags/${kebabCase(tag.name)}`,
        component: tagPageTemplate,
        context: {
          tag: tag.name,
          tagId: tag._id,
        },
      });
    });

    return posts.items;
  });
};
