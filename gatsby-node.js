const { paginate } = require('gatsby-awesome-pagination')
const path = require('path')
const { forEach, kebabCase } = require('lodash')

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  // import each of the page types to be rendered on the site
  const indexTemplate = path.resolve('./src/templates/index.js')
  const postTemplate = path.resolve('./src/templates/post.js')
  const singlePageTemplate = path.resolve('./src/templates/singlePage.js')
  const tagPageTemplate = path.resolve('./src/templates/tagPage.js')

  return graphql(`
    {
      takeshape {
        about: getAbout {
          _id
          bodyHtml
          title: _contentTypeName
          path: _contentTypeName
        }
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
    const { takeshape } = result.data
    const { posts, siteMetadata, tags } = takeshape

    if (result.errors) {
      return Promise.reject(result.errors)
    }

    const pages = [takeshape.about]
    forEach(pages, (page) => {
      createPage({
        path: page.path,
        component: singlePageTemplate,
        context: {
          id: page._id,
          type: 'staticPage',
          bodyHtml: page.bodyHtml,
          title: page.title,
        },
      })
    })

    posts.items.forEach((takeShapePost, idx) => {
      createPage({
        path: takeShapePost.path,
        component: postTemplate,
        context: {
          id: takeShapePost._id,
          type: 'post',
          next: idx === posts.items.length - 1 ? null : posts.items[idx + 1],
          previous: idx === 0 ? null : posts.items[idx - 1],
          permalink: `https://mike.biful.co/${takeShapePost.path}/`,
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
    forEach(tags.items, (tag) => {
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
