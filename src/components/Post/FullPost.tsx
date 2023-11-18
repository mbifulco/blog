import { MDXRemote } from 'next-mdx-remote';
import { useRouter } from 'next/router';

import useSWR from 'swr';

import { getMentions } from '../../utils/webmentions';

import { CarbonAd } from '../CarbonAd';
import { components } from '../../utils/MDXProviderWrapper';
import { Image } from '../Image';
import MentionsSummary from './mentionsSummary';
import { PolitePop } from '../PolitePop';
import { PublishDate } from '../PublishDate';
import TagsSummary from '../tagsSummary';
import { YouTube } from '../MdxEmbed';
import type { BlogPost, Newsletter } from '../../data/content-types';

type FullPostProps = {
  post: BlogPost | Newsletter;
};

const FullPost: React.FC<FullPostProps> = ({ post }) => {
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

  const { data: mentions /* error */ } = useSWR(router.asPath, getMentions);

  // TODO test cover image support

  let coverContainer: React.ReactNode = (
    <Image
      className={'rounded-lg mb-4 shadow ml-0 object-cover object-center'}
      publicId={coverImagePublicId || `posts/${path}/cover`}
      alt={excerpt}
      loading="eager"
      priority
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
          <p className="dark:text-gray-400 text-gray-700 text-xs">
            <PublishDate date={date} /> {author && <>— Written by {author}</>}
          </p>
          <TagsSummary tags={tags} />
          {coverContainer}
        </header>

        <div className="flex flex-col gap-4">
          <CarbonAd />
          <MDXRemote {...post.source} components={components} />
          <MentionsSummary mentions={mentions} />
        </div>
      </div>
      <PolitePop />
    </article>
  );
};

export default FullPost;
