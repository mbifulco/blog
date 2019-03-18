// import configuration bits from .env files
require('dotenv').config()

const postCssPresetEnv = require(`postcss-preset-env`)
const postCSSNested = require('postcss-nested')
const postCSSUrl = require('postcss-url')
const postCSSImports = require('postcss-import')
const cssnano = require('cssnano')
const postCSSMixins = require('postcss-mixins')
const { map } = require('lodash')

module.exports = {
  siteMetadata: {
    title: `Mike Bifulco - designer, developer, podcaster, maker`,
    // eslint-disable-next-line max-len
    description: `Resources for modern software designers and developers.  Tips and walkthroughs on using developer tools like React, node, and javascript.  Design thoughts and theory, and tips for tools like sketchapp and figma.`,
    author: `Mike Bifulco (@irreverentmike)`,
    logo: {
      src: '',
      alt: '',
    },
    image_url: 'https://mike.biful.co/icons/icon-512x512.png', // used for RSS feed image
    logoText: 'Mike Bifulco',
    defaultTheme: 'light',
    postsPerPage: 5,
    showMenuItems: 2,
    menuMoreText: 'Show more',
    mainMenu: [
      {
        title: 'About',
        path: '/about',
      },
    ],
    siteUrl: 'https://mike.biful.co',
  },
  plugins: [
    `babel-preset-gatsby`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-postcss`,
      options: {
        postCssPlugins: [
          postCSSUrl(),
          postCSSImports(),
          postCSSMixins(),
          postCSSNested(),
          postCssPresetEnv({
            importFrom: 'src/styles/variables.css',
            stage: 1,
            preserve: false,
          }),
          cssnano({
            preset: 'default',
          }),
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `@weknow/gatsby-remark-twitter`,
          {
            resolve: 'gatsby-remark-embed-video',
            options: {
              related: false,
              noIframeBorder: true,
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 800,
              quality: 100,
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: 'language-',
              inlineCodeMarker: null,
              aliases: {},
              showLineNumbers: false,
              noInlineHighlight: false,
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Mike Bifulco`,
        short_name: `mike.biful.co`,
        start_url: `/`,
        background_color: `#292a2d`,
        theme_color: `#292a2d`,
        display: `standalone`,
        icon: `src/images/hello-icon.png`,
      },
    },
    {
      resolve: 'gatsby-plugin-google-tagmanager',
      options: {
        id: 'GTM-PZRPQ5H',
        // set this to true to make GTM work in dev environment (for testing/debug)
        includeInDevelopment: false,
      },
    },
    {
      resolve: `gatsby-plugin-segment-js`,
      options: {
        // your segment write key for your production environment
        // when process.env.NODE_ENV === 'production'
        // required; non-empty string
        prodKey: `WBg2ungfDr2xc9rzrZelCY8ZM1NFEUD2`,

        // if you have a development env for your segment account, paste that key here
        // when process.env.NODE_ENV === 'development'
        // optional; non-empty string
        devKey: `7p42YvCTx6buTZ6AIoHAOS8AjwxhRacW`,

        // boolean (defaults to false) on whether you want
        // to include analytics.page() automatically
        // if false, see below on how to track pageviews manually
        trackPage: true,
      },
    },
    {
      resolve: 'gatsby-source-graphql',
      options: {
        typeName: 'TS',
        fieldName: 'takeshape',
        // Url to query from
        url: `https://api.takeshape.io/project/${
          process.env.TAKESHAPE_PROJECT
        }/graphql`,
        // HTTP headers
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.TAKESHAPE_TOKEN}`,
        },
        // Additional options to pass to node-fetch
        fetchOptions: {},
      },
    },
    {
      resolve: 'gatsby-plugin-feed',
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
                image_url
              }
            }
          }
        `,
        feeds: [
          {
            output: '/rss.xml',
            title: 'mike.biful.co RSS Feed',
            serialize: ({ query }) => {
              const { takeshape } = query
              return takeshape.posts.items.map(post => {
                const {
                  _id,
                  author,
                  excerpt,
                  path,
                  tags: tagList,
                  title,
                } = post

                const tags = map(tagList, tag => tag.name)

                return {
                  title,
                  description: excerpt,
                  url: `https://mike.biful.co/${path}`,
                  guid: _id,
                  categories: tags,
                  author: author.name,
                }
              })
            },
            query: ` 
              {
                takeshape {
                  posts: getPostList(sort: [{ field: "_enabledAt", order: "DESC" }]) {
                    items {
                      _id
                      author {
                        name
                      }
                      excerpt
                      path
                      tags {
                        name
                      }
                      title
                    }
                  }
                }
              }
            `,
          },
        ],
      },
    },
    // leave netlify as the last plugin
    `gatsby-plugin-netlify`,
  ],
}
