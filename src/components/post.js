import React from 'react';
import PropTypes from 'prop-types';
import NextLink from 'next/link';

import { MDXRemote } from 'next-mdx-remote';

import useSWR from 'swr';

import {
  Heading,
  Link,
  Stack,
  Text,
  useColorMode,
  useTheme,
} from '@chakra-ui/react';

import { getMentions } from '../utils/webmentions';

import MentionsSummary from './mentionsSummary';
import TagsSummary from './tagsSummary';
import * as style from '../styles/post.module.scss';
import { CarbonAd, Image, PublishDate } from '.';
import frontmatterType from '../types/frontmatter';

const Post = ({ summary, post }) => {
  const { frontmatter } = post;

  const { author, coverImagePublicId, date, excerpt, path, tags, title } =
    frontmatter;

  const theme = useTheme();
  const { colorMode } = useColorMode();

  const dateColors = {
    dark: theme.colors.gray[400],
    light: '#555555',
  };

  const postPath = `/posts/${path}`;

  const { data: mentions /* error */ } = useSWR(postPath, getMentions);

  // TODO test cover image support

  const coverImageContainer = (
    <Image
      className={style.coverImage}
      marginBottom="2em"
      publicId={coverImagePublicId || `posts/${path}/cover`}
      alt={excerpt}
    />
  );

  return (
    <article className={style.post}>
      <div className={style.postContent}>
        <header>
          <Heading
            as="h1"
            color={theme.colors.pink[500]}
            textDecoration="none"
            border={0}
          >
            {summary ? (
              <Link as={NextLink} href={postPath}>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a>{title}</a>
              </Link>
            ) : (
              title
            )}
          </Heading>
          <Text fontSize="1rem" color={dateColors[colorMode]}>
            <PublishDate date={date} /> {author && <>— Written by {author}</>}
          </Text>
          <TagsSummary tags={tags} />
          {coverImageContainer}
        </header>

        {summary ? (
          <>
            <p>{excerpt}</p>
            <Link as={NextLink} href={postPath}>
              Read more →
            </Link>
          </>
        ) : (
          <Stack spacing={4}>
            {summary ? null : <CarbonAd />}
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <MDXRemote {...post.source} />

            <MentionsSummary mentions={mentions} />
          </Stack>
        )}
      </div>
    </article>
  );
};

Post.propTypes = {
  post: PropTypes.shape({
    frontmatter: frontmatterType,
    source: PropTypes.shape({}),
  }),
  summary: PropTypes.bool,
  previous: PropTypes.object,
  next: PropTypes.object,
};

export default Post;
