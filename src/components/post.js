import React from 'react';
import PropTypes from 'prop-types';
import NextLink from 'next/link';

import { MDXRemote } from 'next-mdx-remote';

import { YouTube } from 'mdx-embed';

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
import { components } from '../utils/MDXProviderWrapper';
import PolitePop from './PolitePop/PolitePop';

const Post = ({ summary, post }) => {
  const { frontmatter } = post;

  const {
    author,
    coverImagePublicId,
    date,
    excerpt,
    path,
    tags,
    title,
    youTubeId,
  } = frontmatter;

  const theme = useTheme();
  const { colorMode } = useColorMode();

  const dateColors = {
    dark: theme.colors.gray[400],
    light: '#555555',
  };

  const postPath = `/posts/${path}`;

  const { data: mentions /* error */ } = useSWR(postPath, getMentions);

  // TODO test cover image support

  let coverContainer = (
    <Image
      className={style.coverImage}
      marginBottom="2em"
      publicId={coverImagePublicId || `posts/${path}/cover`}
      alt={excerpt}
      loading="eager"
    />
  );

  if (!summary && youTubeId) {
    coverContainer = <YouTube youTubeId="AbtoSbPUx9o" />;
  }

  // no cover image for newsletters, we want it to look like an email
  if (!summary && frontmatter?.type === 'newsletter') {
    coverContainer = null;
  }

  return (
    <article className={style.post}>
      <div className={style.postContent}>
        <header>
          <Heading
            as={summary ? 'h2' : 'h1'}
            size="2xl"
            color={theme.colors.pink[500]}
            textDecoration="none"
            border={0}
            margin={0}
            padding={0}
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
          {coverContainer}
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
            <MDXRemote {...post.source} components={components} />

            <MentionsSummary mentions={mentions} />
          </Stack>
        )}
      </div>
      <PolitePop />
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
