import { useRouter } from 'next/router';
import { MDXRemote } from 'next-mdx-remote';
import useSWR from 'swr';

import type { BlogPost, Newsletter } from '../../data/content-types';
import { components } from '../../utils/MDXProviderWrapper';
import { getMentions } from '../../utils/webmentions';
import { CarbonAd } from '../CarbonAd';
import { Heading } from '../Heading';
import { Image } from '../Image';
import { YouTube } from '../MdxEmbed';
import { PolitePop } from '../PolitePop';
import { PublishDate } from '../PublishDate';
import TagsSummary from '../tagsSummary';
import MentionsSummary from './mentionsSummary';

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
      className={'mb-4 ml-0 rounded-lg object-cover object-center shadow'}
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
    <article className={'mx-auto mb-4 w-full text-left text-base'}>
      <div className={'relative'}>
        <header>
          <Heading as="h1" className="m-0 p-0">
            {title}
          </Heading>
          <p className="text-xs text-gray-700 dark:text-gray-400">
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
