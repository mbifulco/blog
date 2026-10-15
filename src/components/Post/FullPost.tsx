import type { BlogPost, Newsletter } from '@data/content-types';
import type { Series } from '@lib/series';
import type { TopicDefinition } from '@lib/topics';
import { MDXRemote } from 'next-mdx-remote';

import Breadcrumbs from '@components/Breadcrumbs/Breadcrumbs';
import { CopyAsMarkdown } from '@components/CopyAsMarkdown';
import Link from '@components/Link';
import { SeriesNavigation } from '@components/Series/SeriesNavigation';
import { StructuredData } from '@components/StructuredData';
import { TLDR } from '@components/TLDR';
import { markdownPathFor } from '@lib/markdown-export/urls';
import { generatePostStructuredData } from '@utils/generateStructuredData';
import { components } from '@utils/MDXProviderWrapper';
import { readingMinutes } from '@utils/readingTime';
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
  contentType?: 'post' | 'newsletter';
  topic?: Pick<TopicDefinition, 'slug' | 'name'> | null;
};

const typeLabel = (contentType: 'post' | 'newsletter') =>
  contentType === 'newsletter' ? '💌 Tiny Improvements' : 'Article';

const FullPost: React.FC<FullPostProps> = ({
  post,
  series,
  contentType = 'post',
  topic,
}) => {
  const { frontmatter } = post;

  const {
    coverImagePublicId,
    date,
    excerpt,
    slug,
    podcastUrl,
    tags,
    title,
    youTubeId,
  } = frontmatter;

  // Build breadcrumb trail
  const breadcrumbs =
    contentType === 'newsletter'
      ? [
          { name: 'Home', href: '/' },
          { name: 'Newsletter', href: '/newsletter' },
          { name: title, href: `/newsletter/${slug}` },
        ]
      : [
          { name: 'Home', href: '/' },
          { name: title, href: `/posts/${slug}` },
        ];

  let coverContainer: React.ReactNode = (
    <div className="riso-plate mb-3 mr-3">
      <Image
        bare
        className="w-full object-cover object-center"
        publicId={coverImagePublicId || `posts/${slug}/cover`}
        alt={excerpt}
        loading="eager"
        priority
      />
    </div>
  );

  if (youTubeId) {
    coverContainer = (
      <div className="riso-plate mb-3 mr-3">
        <YouTube youTubeId={youTubeId} />
      </div>
    );
  }

  const pageStructuredData = generatePostStructuredData({
    post,
    series,
  });

  const markdownPath = markdownPathFor(
    contentType === 'newsletter' ? 'newsletter' : 'posts',
    slug
  );

  return (
    <>
      {pageStructuredData.map((structuredData) => (
        <StructuredData
          structuredData={structuredData}
          key={`structuredData-${structuredData['@type']}-${post.frontmatter.slug}`}
        />
      ))}
      <article
        data-pagefind-filter={`type:${contentType}`}
        className="mx-auto w-full max-w-6xl"
      >
        <header className="flex flex-col">
          <Breadcrumbs crumbs={breadcrumbs} className="mb-8" />
          <Heading
            as="h1"
            className="m-0 max-w-[18ch] p-0 text-[clamp(2.25rem,6vw,4.5rem)] leading-[0.98] tracking-[-0.02em] md:text-[clamp(2.25rem,6vw,4.5rem)]"
            data-pagefind-meta="title"
          >
            <span className="riso-mis" data-text={title}>
              {title}
            </span>
          </Heading>
          {series && (
            <p className="text-ink-muted m-0 mt-4 font-futura text-base font-bold">
              Part of the{' '}
              <Link href={`/series/${series.slug}`} className="text-riso-blue">
                {series.name}
              </Link>{' '}
              series
            </p>
          )}
          {excerpt && (
            <p className="text-ink-muted m-0 mt-5 max-w-[54ch] text-pretty font-serif text-xl leading-relaxed md:text-2xl md:leading-snug">
              {excerpt}
            </p>
          )}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex min-w-0 flex-col gap-2">
              <p className="text-ink-muted m-0 flex flex-wrap items-baseline gap-x-2 gap-y-1 font-futura text-sm font-bold">
                <PublishDate date={date} className="font-mono text-xs" />
                <span aria-hidden>·</span>
                <span>{readingMinutes(post.content)} min read</span>
                {topic && (
                  <>
                    <span aria-hidden>·</span>
                    <Link href={`/topics/${topic.slug}`}>{topic.name}</Link>
                  </>
                )}
                <span aria-hidden>·</span>
                <span className="text-riso-pink">{typeLabel(contentType)}</span>
              </p>
              <TagsSummary tags={tags} />
            </div>
            {/* Above md the control lives in the sticky margin instead, so
                it stays reachable while reading. */}
            <div className="shrink-0 md:hidden">
              <CopyAsMarkdown markdownPath={markdownPath} />
            </div>
          </div>
          <div className="mt-10 w-full">{coverContainer}</div>
        </header>

        <div className="mt-14 grid justify-center gap-x-14 gap-y-8 md:grid-cols-[minmax(0,68ch)_15rem]">
          <div className="min-w-0" data-pagefind-body>
            {/* Pagefind scopes data-pagefind-meta to the body element; repeat title here so it's captured */}
            <span className="sr-only" data-pagefind-meta="title">
              {title}
            </span>
            {series && (
              <div className="mb-6">
                <SeriesNavigation series={series} />
              </div>
            )}
            {podcastUrl && (
              <div className="mb-8">
                <iframe width="100%" height="180" seamless src={podcastUrl} />
              </div>
            )}
            <div className="prose max-w-none">
              {post.tldrSource && <TLDR source={post.tldrSource} />}
              <MDXRemote {...post.source} components={components} />
            </div>
            <MentionsSummary />
          </div>
          <aside className="hidden h-max flex-col gap-6 md:sticky md:top-16 md:flex">
            <CopyAsMarkdown markdownPath={markdownPath} />
            <TableOfContents headings={post.tableOfContents} />
            <CarbonAd />
          </aside>
        </div>
      </article>
    </>
  );
};

export default FullPost;
