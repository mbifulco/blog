const { createFilePath } = require('gatsby-source-filesystem');
const { paginate } = require('gatsby-awesome-pagination');
const path = require('path');
const { forEach, kebabCase } = require('lodash');

const createPagesFromMdx = async ({ actions, graphql, reporter }) => {
  // Destructure the createPage function from the actions object
  const { createPage } = actions;
  const result = await graphql(`
    query {
      allMdx {
        edges {
          node {
            id
            fields {
              slug
            }
          }
        }
      }
    }
  `);
  if (result.errors) {
    reporter.panicOnBuild('🚨  ERROR: Loading "createPages" query');
  }
  // Create blog post pages.
  const posts = result.data.allMdx.edges;
  // you'll call `createPage` for each result
  posts.forEach(({ node }) => {
    createPage({
      // This is the slug you created before
      // (or `node.frontmatter.slug`)
      path: node.fields.slug,
      // This component will wrap our MDX content
      component: path.resolve(`./src/templates/MdxPost.js`),
      // You can use the values in this context in
      // our page layout component
      context: { id: node.id, slug: node.fields.slug },
    });
  });
};

const createPagesFromTakeShape = ({ actions, graphql }) => {
  const { createPage } = actions;

  // import each of the page types to be rendered on the site
  const indexTemplate = path.resolve('./src/templates/index.js');
  const takeshapePostTemplate = path.resolve(
    './src/templates/TakeshapePost.js'
  );
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
        path: `posts/${takeShapePost.path}`,
        component: takeshapePostTemplate,
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
      pathPrefix: '/posts',
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

exports.sourceNodes = ({ actions }) => {
  actions.createTypes(`
    type ConvertkitTagYaml implements Node @dontInfer {
      id: ID!
      name: String!
    }
  `);
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  // you only want to operate on `Mdx` nodes. If you had content from a
  // remote CMS you could also check to see if the parent node was a
  // `File` node here
  if (node.internal.type === 'Mdx') {
    const value = createFilePath({ node, getNode });

    createNodeField({
      // Name of the field you are adding
      name: 'slug',
      // Individual MDX node
      node,
      // Generated value based on filepath with "blog" prefix. you
      // don't need a separating "/" before the value because
      // createFilePath returns a path with the leading "/".
      value,
    });
  }
};

exports.createPages = async ({ actions, graphql, reporter }) => {
  await createPagesFromTakeShape({ actions, graphql });
  await createPagesFromMdx({ actions, graphql, reporter });
};
