const { paginate } = require('gatsby-awesome-pagination')
const path = require('path')
const { forEach, get, kebabCase, uniq } = require('lodash')

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  // import each of the page types to be rendered on the site
  const pageTemplate = path.resolve(`./src/templates/page.js`)
  const tagTemplate = path.resolve('./src/templates/tags.js')
  const indexTemplate = path.resolve(`./src/templates/index.js`)

  return graphql(`
    {
      allMarkdownRemark(
        filter: { frontmatter: { title: { ne: "Features placeholder" } } }
        sort: { fields: [frontmatter___date], order: DESC }
        limit: 1000
      ) {
        edges {
          node {
            frontmatter {
              path
              title
            }
            fileAbsolutePath
          }
        }
      }
      posts: allFile(
        filter: {
          sourceInstanceName: { eq: "posts" }
          name: { ne: ".features-placeholder" }
        }
      ) {
        edges {
          node {
            childMarkdownRemark {
              frontmatter {
                title
                tags
              }
            }
          }
        }
      }
      site {
        siteMetadata {
          postsPerPage
        }
      }
    }
  `).then(result => {
    const {
      allMarkdownRemark: { edges: markdownPages },
      posts: { edges: posts },
      site: { siteMetadata },
    } = result.data
    const sortedPages = markdownPages.sort(
      (
        {
          node: {
            frontmatter: { type: typeA },
          },
        },
        {
          node: {
            frontmatter: { type: typeB },
          },
        }
      ) => (typeA > typeB) - (typeA < typeB)
    )

    if (result.errors) {
      return Promise.reject(result.errors)
    }

    const filteredPosts = posts.filter(
      // make sure to only return posts that contain markdown entries
      // other entries here are [other files] returned from the AllFile() query above
      post => post && post.node && post.node.childMarkdownRemark !== null
    )

    paginate({
      createPage,
      items: filteredPosts,
      component: indexTemplate,
      itemsPerPage: siteMetadata.postsPerPage,
      pathPrefix: '/',
    })

    sortedPages.forEach(({ node }, index) => {
      const pageTypeRegex = /src\/(.*?)\//
      const getType = el => el.fileAbsolutePath.match(pageTypeRegex)[1]

      const previous = index === 0 ? null : sortedPages[index - 1].node
      const next =
        index === sortedPages.length - 1 ? null : sortedPages[index + 1].node
      const isNextSameType = getType(node) === (next && getType(next))
      const isPreviousSameType =
        getType(node) === (previous && getType(previous))

      createPage({
        path: node.frontmatter.path,
        component: pageTemplate,
        context: {
          type: getType(node),
          next: isNextSameType ? next : null,
          previous: isPreviousSameType ? previous : null,
        },
      })
    })

    // tag pages
    let tags = []
    forEach(filteredPosts, edge => {
      if (get(edge, 'node.childMarkdownRemark.frontmatter.tags')) {
        tags = tags.concat(edge.node.childMarkdownRemark.frontmatter.tags)
      }
    })

    tags = uniq(tags)

    forEach(tags, tag => {
      createPage({
        path: `/tags/${kebabCase(tag)}`,
        component: tagTemplate,
        context: {
          tag,
        },
      })
    })

    return sortedPages
  })
}
