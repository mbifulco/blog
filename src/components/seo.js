import React from 'react';
import PropTypes from 'prop-types';

import Head from 'next/head';
import { useRouter } from 'next/router';

import config from '../config';

const baseUrl = config.siteUrl;

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

  const fullCanonical = () => {
    const link = canonical || router.asPath;
    if (!link) return baseUrl;

    const slashLink = link.startsWith('/') ? link : `/${link}`;

    const fullUrl = link.startsWith(baseUrl) ? link : `${baseUrl}${slashLink}`;
    console.log('setting canonical to', fullUrl);
    return fullUrl;
  };

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

      {/* affilimate */}
      <meta name="am-api-token" content="NDGNbytop" />
      {/* end affilimate */}

      <link rel="canonical" href={fullCanonical(canonical)} />

      <title>{`${title} | ${siteTitle}`}</title>
      <meta name="description" content={description || metaDescription} />
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

      <meta name="creator" content="Mike Bifulco @irreverentmike" />
      <meta name="publisher" content="mikebifulco.com" />
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
  lang: PropTypes.string,
};

export default SEO;
