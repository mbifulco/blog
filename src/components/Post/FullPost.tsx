import { MDXRemote } from 'next-mdx-remote';
import type { VideoObject, WithContext } from 'schema-dts';

import { SeriesNavigation } from '@components/Series/SeriesNavigation';
import type { BlogPost, Newsletter } from '@data/content-types';
import type { Series } from '@lib/series';
import { components } from '@utils/MDXProviderWrapper';
import { CarbonAd } from '../CarbonAd';
import { Heading } from '../Heading';
import { Image } from '../Image';
import { YouTube } from '../MdxEmbed';
import { PublishDate } from '../PublishDate';
import TagsSummary from '../tagsSummary';
import MentionsSummary from './mentionsSummary';
import TableOfContents from './TableOfContents';

type FullPostProps = {
  post: BlogPost | Newsletter;
  series?: Series | null;
};

const FullPost: React.FC<FullPostProps> = ({ post, series }) => {
  const { frontmatter } = post;

  const {
    coverImagePublicId,
    date,
    excerpt,
    path,
    podcastUrl,
    tags,
    title,
    youTubeId,
  } = frontmatter;

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
    coverContainer = (
      <section className="bg-gray-900">
        <main className="h-[calc(100vw * 0.725)] mx-auto max-w-full md:w-[75%]">
          <YouTube youTubeId={youTubeId} />
        </main>
      </section>
    );
    videoStructuredData = {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: title,
      description: excerpt,
      thumbnailUrl: `https://i.ytimg.com/vi/${youTubeId}/hqdefault.jpg`,
      uploadDate: new Date(date).toISOString(),
      contentUrl: `https://www.youtube.com/watch?v=${youTubeId}`,
      embedUrl: `https://www.youtube.com/embed/${youTubeId}`,
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
      <article>
        <header className="mx-auto mb-4 flex flex-col gap-2">
          <div className="mx-auto mb-4 max-w-[75ch]">
            {series && (
              <p className="mb-2 text-sm uppercase text-gray-600 dark:text-gray-400">
                <em>Part of the </em>
                <span className="0font-medium">
                  {frontmatter?.series && frontmatter.series}
                </span>
                <em> Series</em>
              </p>
            )}
            <Heading as="h1" className="m-0 p-0">
              {title}
            </Heading>
            <p className="text-xs text-gray-700 dark:text-gray-400">
              <PublishDate date={date} />{' '}
            </p>

            <TagsSummary tags={tags} />
          </div>
          <div className="mx-auto h-auto min-h-52 w-full">{coverContainer}</div>
        </header>

        <div className="mx-auto flex w-fit flex-col gap-4">
          <main className="mx-auto flex flex-col-reverse content-center justify-center gap-4 md:flex md:flex-row lg:gap-8">
            <article className="max-w-prose">
              {series && (
                <div className="mb-6">
                  <SeriesNavigation
                    series={series.name}
                    posts={series?.posts}
                    newsletters={series?.newsletters}
                  />
                </div>
              )}
              {podcastUrl && (
                <div className="mb-8">
                  <iframe width="100%" height="180" seamless src={podcastUrl} />
                </div>
              )}
              <div className="prose lg:prose-xl">
                <MDXRemote {...post.source} components={components} />
              </div>
              <MentionsSummary />
            </article>
            <div className="sticky top-12 flex h-max w-[300px] flex-col gap-4">
              <TableOfContents headings={post.tableOfContents} />
              <CarbonAd />
            </div>
          </main>
        </div>
      </article>
    </>
  );
};

export default FullPost;
