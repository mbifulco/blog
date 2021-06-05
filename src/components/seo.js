import React from 'react';
import PropTypes from 'prop-types';

import Head from 'next/head';
import config from '../config';
import { useRouter } from 'next/router';

const SEO = ({
  author,
  canonical,
  description,
  meta,
  keywords,
  title,
  ogType,
  image,
}) => {
  const router = useRouter();

  const {
    title: siteTitle,
    description: siteDescription,
    author: siteAuthor,
  } = config;

  const metaTitle = title || siteTitle;
  const metaDescription = description || siteDescription;

  const ogImage = image
    ? {
        property: `og:image`,
        content: image,
      }
    : null;
  const ogImageUrl = image
    ? {
        property: `og:image:url`,
        content: image,
      }
    : null;

  return (
    <Head>
      {/* favicon */}
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="theme-color" content="#ffffff" />
      {/* end favicon */}

      {canonical && <link rel="canonical" key={canonical} href={canonical} />}
      <title>{`${title} | ${siteTitle}`}</title>
      <meta name="description" content={metaDescription} />
      <meta
        name="monetization"
        content="$twitter.xrptipbot.com/irreverentmike"
      />

      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}

      <meta
        name="twitter:card"
        content={image ? `summary_large_image` : `summary`}
      />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:creator" content={author?.name || siteAuthor?.name} />
      <meta name="twitter:description" content={metaDescription} />

      <meta
        name="og:title"
        content={title ? `${title} | ${siteTitle}` : siteTitle}
      />
      <meta name="og:description" content={metaDescription} />
      <meta name="og:type" content={ogType || `website`} />
      <meta name="og:url" content={router.asPath} />
      <meta name="og:image" content={image} />
      <meta name="og:image:url" content={image} />
      {meta}
    </Head>
  );
};

SEO.defaultProps = {
  meta: [],
  keywords: [],
};

SEO.propTypes = {
  author: PropTypes.string,
  canonical: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  meta: PropTypes.array,
  ogType: PropTypes.string,
  keywords: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
};

export default SEO;
