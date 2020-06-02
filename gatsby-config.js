// import configuration bits from .env files
require('dotenv').config();

const postCssPresetEnv = require(`postcss-preset-env`);
const postCSSNested = require('postcss-nested');
const postCSSUrl = require('postcss-url');
const postCSSImports = require('postcss-import');
const cssnano = require('cssnano');
const postCSSMixins = require('postcss-mixins');
const { map } = require('lodash');

const BASE_SITE_URL = 'https://mikebifulco.com';

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
    image_url: `${BASE_SITE_URL}/icons/icon-512x512.png`, // used for RSS feed image
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
    siteUrl: BASE_SITE_URL,
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
    `gatsby-transformer-yaml`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        type: 'convertkitType',
        path: `./src/data/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `mdx-posts`,
        type: 'mdx-posts',
        path: `${__dirname}/src/data/posts/`,
      },
    },
    `gatsby-remark-images`,
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              linkImagesToOriginal: false,
              tracedSVG: true,
            },
          },
        ],
        defaultLayouts: {
          posts: require.resolve('./src/templates/MdxPost'),
          default: require.resolve('./src/templates/singlePage'),
        },
      },
    },
    {
      resolve: 'gatsby-transformer-cloudinary',
      options: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
        uploadFolder: 'gatsby-cloudinary',
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
        short_name: `mikebifulco.com`,
        start_url: `/`,
        background_color: `#292a2d`,
        theme_color: `#292a2d`,
        display: `standalone`,
        icon: `src/images/hello-icon.png`,
      },
    },
    {
      resolve: 'gatsby-source-graphql',
      options: {
        typeName: 'TS',
        fieldName: 'takeshape',
        // Url to query from
        url: `https://api.takeshape.io/project/${process.env.TAKESHAPE_PROJECT}/graphql`,
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
            title: 'mikebifulco.com RSS Feed',
            serialize: ({ query }) => {
              const { takeshape } = query;
              return takeshape.posts.items.map((post) => {
                const {
                  _id,
                  author,
                  excerpt,
                  path,
                  tags: tagList,
                  title,
                } = post;

                const tags = map(tagList, (tag) => tag.name);

                return {
                  title,
                  description: excerpt,
                  url: `${BASE_SITE_URL}/${path}`,
                  guid: _id,
                  categories: tags,
                  author: author && author.name,
                };
              });
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
    {
      resolve: `gatsby-plugin-remarketer`,
      options: {
        twitter: {
          siteId: 'o3mdu',
        },
        debug: false, // optional; true fires events in 'development'
      },
    },
    {
      resolve: `gatsby-plugin-webmention`,
      options: {
        username: 'mikebifulco.com', // webmention.io username
        identity: {
          github: 'mbifulco',
          twitter: 'irreverentmike', // no @
        },
        mentions: true,
        pingbacks: true,
        domain: 'mikebifulco.com',
        token: process.env.WEBMENTIONS_TOKEN,
      },
    },
    {
      resolve: `gatsby-plugin-react-helmet-canonical-urls`,
      options: {
        siteUrl: BASE_SITE_URL,
      },
    },
    // leave netlify as the last plugin
    `gatsby-plugin-netlify`,
  ],
};
