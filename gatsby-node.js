const { paginate } = require('gatsby-awesome-pagination')
const path = require('path')
const { forEach, kebabCase } = require('lodash')

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  // import each of the page types to be rendered on the site
  const tagPageTemplate = path.resolve('./src/templates/tagPage.js')
  const indexTemplate = path.resolve(`./src/templates/index.js`)
  const postTemplate = path.resolve('./src/templates/post.js')

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
  `).then(result => {
    const { takeshape } = result.data
    const { posts, siteMetadata, tags } = takeshape

    if (result.errors) {
      return Promise.reject(result.errors)
    }

    posts.items.forEach((takeShapePost, idx) => {
      createPage({
        path: takeShapePost.path,
        component: postTemplate,
        context: {
          id: takeShapePost._id,
          type: 'takeshapePost',
          next: idx === posts.items.length - 1 ? null : posts.items[idx + 1],
          previous: idx === 0 ? null : posts.items[idx - 1],
        },
      })
    })

    paginate({
      createPage,
      items: posts.items,
      component: indexTemplate,
      itemsPerPage: siteMetadata.postsPerPage,
      pathPrefix: '/',
    })

    // tag pages
    forEach(tags.items, tag => {
      createPage({
        path: `/tags/${kebabCase(tag.name)}`,
        component: tagPageTemplate,
        context: {
          tag: tag.name,
          tagId: tag._id,
        },
      })
    })

    return posts.items
  })
}
