import React from 'react';
import PropTypes from 'prop-types';
import NextLink from 'next/link';
import GatsbyImage from 'next/image';
import moment from 'moment';

import { MDXRemote } from 'next-mdx-remote';


import { Heading, Link, Text, useColorMode, useTheme } from '@chakra-ui/react';

import MentionsSummary from './mentionsSummary';
import TagsSummary from './tagsSummary';
import Navigation from './navigation';
import * as style from '../styles/post.module.scss';
import { Image } from '.';

const Post = ({ summary, mentions, post, previous, next }) => {
  const {
    frontmatter,
    content,
  } = post;

  const {
    author,
    coverImagePublicId,
    date,
    excerpt,
    path,
    tags,
    title,
  } = frontmatter;

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

  const previousPath = previous && previous.path;
  const previousLabel = previous && previous.title;
  const nextPath = next && next.path;
  const nextLabel = next && next.title;

  const postPath = `/posts/${path}`;

  // TODO test cover image support

  let coverImageContainer;
  if (coverImagePublicId) {
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
              as={NextLink}
              style={{
                color: headerColors[colorMode],
                textDecoration: 'none',
              }}
              href={postPath}
            >
              <a>{title}</a>
            </Link>
          ) : (
            title
          )}
        </Heading>
        <Text fontSize="1rem" color={dateColors[colorMode]}>
          {formattedDate} {author && <>— Written by {author}</>}
        </Text>
        <TagsSummary tags={tags} />
        {coverImageContainer}

        {summary ? (
          <>
            <p>{excerpt}</p>
            <Link as={NextLink} href={postPath} className={style.readMore}>
              Read more →
            </Link>
          </>
        ) : (
          <>
            <MDXRemote {...post.source} />

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
    tags: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.shape({}), PropTypes.string])
    ),
    title: PropTypes.string,
    date: PropTypes.string,
    coverImagePublicId: PropTypes.string,
    path: PropTypes.string,
    author: PropTypes.string,
    id: PropTypes.string,
  }),
  summary: PropTypes.bool,
  previous: PropTypes.object,
  next: PropTypes.object,
};

export default Post;
