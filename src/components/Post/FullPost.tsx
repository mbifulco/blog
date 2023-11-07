import { MDXRemote } from 'next-mdx-remote';
import { useRouter } from 'next/router';

import useSWR from 'swr';

import { Heading, Text, useColorMode, useTheme } from '@chakra-ui/react';

import { getMentions } from '../../utils/webmentions';

import { CarbonAd } from '../CarbonAd';
import { components } from '../../utils/MDXProviderWrapper';
import { Image } from '../Image';
import MentionsSummary from './mentionsSummary';
import { PolitePop } from '../PolitePop';
import { PublishDate } from '../PublishDate';
import TagsSummary from '../tagsSummary';
import { YouTube } from '../MdxEmbed';

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
      className={'rounded-lg mb-4 shadow ml-0 object-cover object-center'}
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
    <article className={'w-full text-left mx-auto mb-4 text-base'}>
      <div className={'relative'}>
        <header>
          <h1 className="text-3xl lg:text-5xl font-bold p-0 m-0 border-none no-underline text-pink-500">
            {title}
          </h1>
          <Text fontSize="1rem" color={dateColors[colorMode]}>
            <PublishDate date={date} /> {author && <>— Written by {author}</>}
          </Text>
          <TagsSummary tags={tags} />
          {coverContainer}
        </header>

        <div className="flex flex-col gap-4">
          <CarbonAd />
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <MDXRemote {...post.source} components={components} />
          <MentionsSummary mentions={mentions} />
        </div>
      </div>
      <PolitePop />
    </article>
  );
};

export default FullPost;
