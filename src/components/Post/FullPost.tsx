import { useRouter } from 'next/router';
import { MDXRemote } from 'next-mdx-remote';
import type { VideoObject, WithContext } from 'schema-dts';
import useSWR from 'swr';

import type { BlogPost, Newsletter } from '../../data/content-types';
import { components } from '../../utils/MDXProviderWrapper';
import { getMentions } from '../../utils/webmentions';
import { CarbonAd } from '../CarbonAd';
import { Heading } from '../Heading';
import { Image } from '../Image';
import { YouTube } from '../MdxEmbed';
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
    podcastUrl,
    tags,
    title,
    youTubeId,
  } = frontmatter;

  const router = useRouter();

  const { data: mentions /* error */ } = useSWR(router.asPath, getMentions);

  let coverContainer: React.ReactNode = (
    <Image
      className={'mb-4 ml-0 rounded-lg object-cover object-center shadow'}
      publicId={coverImagePublicId || `posts/${path}/cover`}
      alt={excerpt}
      loading="eager"
      priority
    />
  );

  let videoStructuredData: WithContext<VideoObject> | undefined = undefined;

  if (youTubeId) {
    coverContainer = <YouTube youTubeId={youTubeId} />;
    videoStructuredData = {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: title,
      description: excerpt,
      thumbnailUrl: `https://i.ytimg.com/vi/${youTubeId}/hqdefault.jpg`,
      uploadDate: new Date(date).toISOString(),
      contentUrl: `https://www.youtube.com/watch?v=${youTubeId}`,
      embedUrl: `https://www.youtube.com/embed/${youTubeId}`,
      // interactionStatistic: {
      //   '@type': 'InteractionCounter',
      //   interactionType: { '@type': 'http://schema.org/WatchAction' },
      //   userInteractionCount: 0,
      // },
    };
  }

  return (
    <>
      {videoStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(videoStructuredData),
          }}
        />
      )}
      <article
        className={
          'mx-auto mb-4 w-full px-2 text-left text-base sm:px-4 md:px-10 lg:px-20 xl:px-0'
        }
      >
        <div className={'relative'}>
          <header className="mb-4 flex flex-col gap-2">
            <Heading as="h1" className="m-0 p-0">
              {title}
            </Heading>
            <p className="text-xs text-gray-700 dark:text-gray-400">
              <PublishDate date={date} /> {author && <>— Written by {author}</>}
            </p>
            <TagsSummary tags={tags} />
            {coverContainer}
            {podcastUrl && (
              <iframe width="100%" height="180" seamless src={podcastUrl} />
            )}
          </header>

          <div>
            <CarbonAd />
            <main className="prose xl:prose-2xl">
              <MDXRemote {...post.source} components={components} />
            </main>
            <MentionsSummary mentions={mentions} />
          </div>
        </div>
      </article>
    </>
  );
};

export default FullPost;
