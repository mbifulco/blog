import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { useStaticQuery, graphql } from 'gatsby'

const SEO = ({
  description,
  lang,
  location,
  meta,
  keywords,
  title,
  ogType,
  image,
}) => {
  const data = useStaticQuery(graphql`
    query DefaultSEOQuery {
      site {
        siteMetadata {
          title
          description
          author
        }
      }
    }
  `)
  const {
    title: siteTitle,
    description: siteDescription,
    author,
  } = data.site.siteMetadata
  const metaTitle = title || siteTitle
  const metaDescription = description || siteDescription

  let imageUrl
  if (location && location.origin && image) {
    imageUrl = `${location.origin}${image}`
  }

  const ogImage = image
    ? {
        property: `og:image`,
        content: imageUrl,
      }
    : null
  const ogImageUrl = image
    ? {
        property: `og:image:url`,
        content: imageUrl,
      }
    : null

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={metaTitle}
      titleTemplate={title ? `${title} | ${siteTitle}` : siteTitle}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title ? `${title} | ${siteTitle}` : siteTitle,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: ogType || `website`,
        },
        {
          name: `twitter:card`,
          content: imageUrl ? `summary_large_image` : `summary`,
        },
        {
          name: `twitter:title`,
          content: metaTitle,
        },
        {
          name: `twitter:creator`,
          content: `@irreverentmike`,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
        {
          name: `twitter:creator`,
          content: author,
        },
      ]
        .concat(
          keywords.length > 0
            ? {
                name: `keywords`,
                content: keywords.join(`, `),
              }
            : []
        )
        .concat(
          location
            ? {
                name: 'og:url',
                content: location.href,
              }
            : []
        )
        .concat(ogImage || [])
        .concat(ogImageUrl || [])
        .concat(meta)}
    />
  )
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  keywords: [
    'gatsby',
    'minimal',
    'starter',
    'blog',
    'theme',
    'dark',
    'light',
    'personal site',
  ],
}

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  location: PropTypes.shape({}),
  image: PropTypes.string,
  meta: PropTypes.array,
  ogType: PropTypes.string,
  keywords: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
}

export default SEO
