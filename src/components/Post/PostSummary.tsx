import React from 'react';
import NextLink from 'next/link';

import { Heading, Link, Text, useColorMode, useTheme } from '@chakra-ui/react';

import TagsSummary from '../tagsSummary';

import PolitePop from '../PolitePop/PolitePop';

import { Image } from '../Image';
import { PublishDate } from '../PublishDate';
import clsx from 'clsx';
import { BlogPost } from '../../data/content-types';

type PostSummaryProps = {
  post: BlogPost;
  eager?: boolean;
};

const PostSummary: React.FC<PostSummaryProps> = ({ post, eager = false }) => {
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
      className={clsx(
        'sm:rounded-lg mb-4 shadow -mx-2 sm:mx-0 object-cover object-center'
      )}
      publicId={coverImagePublicId || `posts/${path}/cover`}
      alt={excerpt || title}
      height={420}
      width={800}
      loading={eager ? 'eager' : 'lazy'}
    />
  );

  return (
    <article>
      <div className="relative">
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
            <NextLink href={postPath}>{title}</NextLink>
          </Heading>
          <Text fontSize="1rem" color={dateColors[colorMode]}>
            <PublishDate date={date} /> {author && <>— Written by {author}</>}
          </Text>
          <TagsSummary tags={tags} />
          {coverContainer}
        </header>

        <p className="max-w-prose">{excerpt}</p>
        <Link as={NextLink} href={postPath}>
          Read more →
        </Link>
      </div>
      <PolitePop />
    </article>
  );
};

export default PostSummary;
