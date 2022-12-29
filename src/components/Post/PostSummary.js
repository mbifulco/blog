import React from 'react';
import NextLink from 'next/link';

import { Heading, Link, Text, useColorMode, useTheme } from '@chakra-ui/react';

import TagsSummary from '../tagsSummary';
import * as style from '../../styles/post.module.scss';

import PolitePop from '../PolitePop/PolitePop';

import { Image } from '../Image';
import { PublishDate } from '../PublishDate';

const PostSummary = ({ post, eager = false }) => {
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

  // TODO test cover image support

  let coverContainer = (
    <Image
      className={style.coverImage}
      marginBottom="2em"
      publicId={coverImagePublicId || `posts/${path}/cover`}
      alt={excerpt}
      height={420}
      width={800}
      loading={eager ? 'eager' : 'lazy'}
    />
  );

  return (
    <article className={style.post}>
      <div className={style.postContent}>
        <header>
          <Heading
            as={'h2'}
            size="2xl"
            color={theme.colors.pink[500]}
            textDecoration="none"
            border={0}
            margin={0}
            padding={0}
          >
            <Link as={NextLink} href={postPath}>
              {title}
            </Link>
          </Heading>
          <Text fontSize="1rem" color={dateColors[colorMode]}>
            <PublishDate date={date} /> {author && <>— Written by {author}</>}
          </Text>
          <TagsSummary tags={tags} />
          {coverContainer}
        </header>

        <p>{excerpt}</p>
        <Link as={NextLink} href={postPath}>
          Read more →
        </Link>
      </div>
      <PolitePop />
    </article>
  );
};

export default PostSummary;
