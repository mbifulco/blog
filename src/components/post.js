import React from 'react';
import PropTypes from 'prop-types';
import { Link as GatsbyLink } from 'gatsby';
import Img from 'gatsby-image';
import moment from 'moment';
import { getImageUrl } from '@takeshape/routing';
import { MDXRenderer } from 'gatsby-plugin-mdx';

import { Heading, Link, Text, useColorMode, useTheme } from '@chakra-ui/react';

import MentionsSummary from './mentionsSummary';
import TagsSummary from './tagsSummary';
import Navigation from './navigation';
import style from '../styles/post.module.css';
import { Image } from '.';

const Post = ({ summary, mentions, post, previous, next }) => {
  const {
    author,
    excerpt,
    coverImagePublicId,
    featureImage,
    bodyHtml: html,
    bodyMdx,
    path,
    tags,
    title,
  } = post;

  const theme = useTheme();
  const { colorMode } = useColorMode();

  const headerColors = {
    dark: theme.colors.gray[200],
    light: theme.colors.gray[900],
  };

  const dateColors = {
    dark: theme.colors.gray[400],
    light: '#555555',
  };

  const date = post._enabledAt || post.date;

  const previousPath = previous && previous.path;
  const previousLabel = previous && previous.title;
  const nextPath = next && next.path;
  const nextLabel = next && next.title;

  const postPath = `/posts/${path}`;

  const coverImageUrl =
    featureImage &&
    getImageUrl(featureImage.path, {
      auto: 'format',
      fit: 'max',
      w: 760,
      h: 535,
      q: 80,
    });
  const coverImageAlt = featureImage && featureImage.description;

  let coverImageContainer;
  if (featureImage && featureImage.childImageSharp) {
    coverImageContainer = (
      <Img
        loading="lazy"
        fluid={featureImage.childImageSharp.fluid}
        className={style.coverImage}
      />
    );
  } else if (coverImageUrl) {
    coverImageContainer = (
      <img
        loading="lazy"
        src={coverImageUrl}
        className={style.coverImage}
        alt={coverImageAlt}
      />
    );
  } else if (coverImagePublicId) {
    coverImageContainer = (
      <Image marginBottom="2em" publicId={coverImagePublicId} />
    );
  }

  const formattedDate = moment(new Date(date)).format('DD MMMM YYYY');

  return (
    <div className={style.post}>
      <div className={style.postContent}>
        <Heading as="h1" color={headerColors[colorMode]}>
          {summary ? (
            <Link
              as={GatsbyLink}
              style={{
                color: headerColors[colorMode],
                textDecoration: 'none',
              }}
              to={postPath}
            >
              {title}
            </Link>
          ) : (
            title
          )}
        </Heading>
        <Text
          className={style.meta}
          fontSize="1rem"
          color={dateColors[colorMode]}
        >
          {formattedDate} {author && <>— Written by {author}</>}
        </Text>
        <TagsSummary tags={tags} />
        {coverImageContainer}

        {summary ? (
          <>
            <p>{excerpt}</p>
            <Link as={GatsbyLink} to={postPath} className={style.readMore}>
              Read more →
            </Link>
          </>
        ) : (
          <>
            {/* eslint-disable-next-line react/no-danger */}
            <div dangerouslySetInnerHTML={{ __html: html }} />

            {bodyMdx && <MDXRenderer>{bodyMdx}</MDXRenderer>}

            <MentionsSummary mentions={mentions} />

            <Navigation
              previousPath={previousPath}
              previousLabel={previousLabel}
              nextPath={nextPath}
              nextLabel={nextLabel}
            />
          </>
        )}
      </div>
    </div>
  );
};

Post.propTypes = {
  mentions: PropTypes.arrayOf(PropTypes.shape({})),
  post: PropTypes.shape({
    bodyHtml: PropTypes.string,
    bodyMdx: PropTypes.string,
    tags: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.shape({}), PropTypes.string])
    ),
    title: PropTypes.string,
    date: PropTypes.string,
    _enabledAt: PropTypes.string,
    coverImagePublicId: PropTypes.string,
    featureImage: PropTypes.shape({
      childImageSharp: PropTypes.object,
      description: PropTypes.string,
      path: PropTypes.string,
    }),
    path: PropTypes.string,
    coverImage: PropTypes.object,
    coverImageAlt: PropTypes.string,
    coverImageUrl: PropTypes.string,
    author: PropTypes.string,
    excerpt: PropTypes.string,
    html: PropTypes.string,
    id: PropTypes.string,
  }),
  summary: PropTypes.bool,
  previous: PropTypes.object,
  next: PropTypes.object,
};

export default Post;
