import React from 'react';

import { MDXRemote } from 'next-mdx-remote';
import { useRouter } from 'next/router';

import useSWR from 'swr';

import {
  Heading,
  Link,
  Stack,
  Text,
  useColorMode,
  useTheme,
} from '@chakra-ui/react';

import { getMentions } from '../../utils/webmentions';

import { CarbonAd } from '../CarbonAd';
import { components } from '../../utils/MDXProviderWrapper';
import { Image } from '../Image';
import MentionsSummary from './mentionsSummary';
import { PolitePop } from '../PolitePop';
import { PublishDate } from '../PublishDate';
import TagsSummary from '../tagsSummary';
import { YouTube } from '../MdxEmbed';

import * as style from '../../styles/post.module.scss';

const FullPost = ({ post }) => {
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

  const router = useRouter();
  const theme = useTheme();
  const { colorMode } = useColorMode();

  const dateColors = {
    dark: theme.colors.gray[400],
    light: '#555555',
  };

  const { data: mentions /* error */ } = useSWR(router.asPath, getMentions);

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

  if (youTubeId) {
    coverContainer = <YouTube youTubeId="AbtoSbPUx9o" />;
  }

  // no cover image for newsletters, we want it to look like an email
  if (frontmatter?.type === 'newsletter') {
    coverContainer = null;
  }

  return (
    <article className={style.post}>
      <div className={style.postContent}>
        <header>
          <Heading
            as={'h1'}
            size="2xl"
            color={theme.colors.pink[500]}
            textDecoration="none"
            border={0}
            margin={0}
            padding={0}
          >
            {title}
          </Heading>
          <Text fontSize="1rem" color={dateColors[colorMode]}>
            <PublishDate date={date} /> {author && <>— Written by {author}</>}
          </Text>
          <TagsSummary tags={tags} />
          {coverContainer}
        </header>

        <Stack spacing={2}>
          <CarbonAd />
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <MDXRemote {...post.source} components={components} />
          <MentionsSummary mentions={mentions} />
        </Stack>
      </div>
      <PolitePop />
    </article>
  );
};

export default FullPost;
