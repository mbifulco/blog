import Head from 'next/head';
import { useRouter } from 'next/router';

import config from '../config';
import { getCloudinaryImageUrl } from '../utils/images';

const baseUrl = config.siteUrl;
const siteName = 'mikebifulco.com';

type SEOMeta = {
  name: string;
  content: string;
};

type SEOPagination = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

type SEOProps = {
  author?: string;
  canonical?: string;
  description?: string;
  image?: string;
  meta?: SEOMeta[];
  ogType?: string;
  keywords?: string[];
  title?: string;
  lang?: string;
  publishedAt?: string | number | Date;
  tags?: string[];
  pagination?: SEOPagination;
};

const SEO: React.FC<SEOProps> = ({
  author: _,
  canonical,
  description,
  meta,
  keywords,
  title,
  ogType,
  image,
  publishedAt,
  tags,
  pagination,
}) => {
  const router = useRouter();

  const {
    title: siteTitle,
    description: siteDescription,
    author: _siteAuthor,
    social,
  } = config;

  const metaTitle = title ?? siteTitle;
  const metaDescription = description ?? siteDescription;

  const fullCanonical = () => {
    const link = canonical ?? router.asPath;
    if (!link) return baseUrl;

    const slashLink = link.startsWith('/') ? link : `/${link}`;

    const fullUrl = link.startsWith(baseUrl) ? link : `${baseUrl}${slashLink}`;

    return fullUrl;
  };

  // fall back to a nice headshot of my domepiece if there's no OG image associated with this page
  const ogImageUrl = image ?? getCloudinaryImageUrl('mike-headshot-square');

  return (
    <Head>
      {/* webmention enablement */}
      <link
        rel="webmention"
        href="https://webmention.io/mikebifulco.com/webmention"
      />
      <link
        rel="pingback"
        href="https://webmention.io/mikebifulco.com/xmlrpc"
      />
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

      <link rel="canonical" href={fullCanonical()} />
      <title>{title ? `${title} | ${siteTitle}` : siteTitle}</title>
      <meta name="description" content={description ?? metaDescription} />
      <meta
        name="monetization"
        content="$twitter.xrptipbot.com/irreverentmike"
      />
      {keywords && keywords?.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      {/* Twitter Card meta tags */}
      <meta
        name="twitter:card"
        content={ogImageUrl ? `summary_large_image` : `summary`}
      />
      <meta name="twitter:site" content={social.twitter} />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:creator" content={social.twitter} />
      <meta name="twitter:description" content={metaDescription} />

      {/* Open Graph meta tags */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />
      <meta
        property="og:title"
        content={title ? `${title} | ${siteTitle}` : siteTitle}
      />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={ogType ?? `website`} />
      <meta property="og:url" content={fullCanonical()} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:url" content={ogImageUrl} />

      {/* Article-specific meta tags */}
      {ogType === 'article' && (
        <meta property="article:author" content={baseUrl} />
      )}
      {publishedAt && (
        <meta
          property="article:published_time"
          content={new Date(publishedAt).toISOString()}
        />
      )}
      {tags?.map((tag) => (
        <meta key={`article-tag-${tag}`} property="article:tag" content={tag} />
      ))}

      <meta name="creator" content="Mike Bifulco @irreverentmike" />
      <meta name="publisher" content={siteName} />
      {meta?.map(({ name, content }) => (
        <meta key={name} name={name} content={content} />
      ))}

      {/* Pagination rel prev/next */}
      {pagination && pagination.currentPage > 1 && (
        <link
          rel="prev"
          href={
            pagination.currentPage === 2
              ? `${baseUrl}${pagination.basePath || '/'}`
              : `${baseUrl}${pagination.basePath}/page/${pagination.currentPage - 1}`
          }
        />
      )}
      {pagination && pagination.currentPage < pagination.totalPages && (
        <link
          rel="next"
          href={`${baseUrl}${pagination.basePath}/page/${pagination.currentPage + 1}`}
        />
      )}
    </Head>
  );
};

export default SEO;
