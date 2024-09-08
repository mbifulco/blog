import Head from 'next/head';
import { useRouter } from 'next/router';

import { getCloudinaryImageUrl } from '@/utils/images';
import config from '../config';

const baseUrl = config.siteUrl;

type SEOMeta = {
  name: string;
  content: string;
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
  publishedAt?: string | Date;
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
      <title>{title}</title>
      <meta name="description" content={description ?? metaDescription} />
      <meta
        name="monetization"
        content="$twitter.xrptipbot.com/irreverentmike"
      />
      {keywords && keywords?.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      <meta
        name="twitter:card"
        content={ogImageUrl ? `summary_large_image` : `summary`}
      />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:creator" content={social.twitter} />
      <meta name="twitter:description" content={metaDescription} />
      <meta
        name="og:title"
        content={title ? `${title} | ${siteTitle}` : siteTitle}
      />
      <meta name="og:description" content={metaDescription} />
      <meta name="og:type" content={ogType ?? `website`} />
      <meta name="og:url" content={router.asPath} />
      <meta name="og:image" content={ogImageUrl} />
      <meta name="og:image:url" content={ogImageUrl} />
      <meta name="creator" content="Mike Bifulco @irreverentmike" />
      <meta name="publisher" content="mikebifulco.com" />
      {publishedAt && (
        <meta
          name="article:published_time"
          content={new Date(publishedAt).toUTCString()}
        />
      )}
      {meta?.map(({ name, content }) => (
        <meta key={name} name={name} content={content} />
      ))}
    </Head>
  );
};

export default SEO;
