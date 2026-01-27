import type { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { compareAsc } from 'date-fns';

import { Badge } from '@components/Badge';
import { Heading } from '@components/Heading';
import NewsletterItem from '@components/NewsletterFeed/NewsletterItem';
import { NewsletterSignup } from '@components/NewsletterSignup';
import { StructuredData } from '@components/StructuredData';
import { getAllSeries, getSeries } from '@lib/series';
import type { Series } from '@lib/series';
import { generateSeriesStructuredData } from '@utils/generateStructuredData';
import { BlogPost as Post } from '../../components/Post';
import SEO from '../../components/seo';
import WebmentionMetadata from '../../components/webmentionMetadata';

type SeriesPageParams = {
  slug: string;
};

type SeriesPageProps = {
  series?: Series | null;
};

export const getStaticProps: GetStaticProps<
  SeriesPageProps,
  SeriesPageParams
> = async ({ params }) => {
  if (!params) {
    throw new Error('No params provided');
  }

  const series = await getSeries(params.slug);

  if (!series) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      series,
    },
  };
};

export async function getStaticPaths() {
  const allSeries = await getAllSeries();

  return {
    paths: allSeries.map((series) => ({
      params: {
        slug: series.slug,
      },
    })),
    fallback: false,
  };
}

const SeriesPage: NextPage<SeriesPageProps> = ({ series }) => {
  const router = useRouter();

  if (!series) {
    return null;
  }

  const sortedContent = [
    ...(series?.posts || []),
    ...(series?.newsletters || []),
  ].sort((a, b) => {
    return compareAsc(a.frontmatter.date, b.frontmatter.date);
  });

  const pageTitle = `${series?.name} series - ${series?.length} parts`;
  const tagsForEachPost = sortedContent.map((post) => post.frontmatter.tags);

  const allTags = [...new Set(tagsForEachPost.flat())];

  return (
    <>
      <div className="mx-auto flex max-w-6xl flex-col gap-4">
        <SEO canonical={router.asPath} title={pageTitle} ogType="article" />

        <header className="mb-6 w-fit max-w-[75ch]">
          <Badge>Post Series</Badge>
          <Heading
            as="h1"
            className="w-fit max-w-[60ch] text-3xl text-black uppercase md:text-5xl"
          >
            <em>{series?.name}</em>
          </Heading>
          <span className="text-lg text-gray-500">
            A series in {series?.length} parts
          </span>
        </header>

        <StructuredData structuredData={generateSeriesStructuredData(series)} />

        <main className="mx-auto grid max-w-full gap-8 gap-y-12 lg:grid-cols-3">
          {series?.posts
            .sort((a, b) => compareAsc(a.frontmatter.date, b.frontmatter.date))
            .map((post) => (
              <Post post={post} series={series} summary key={post.slug} />
            ))}
          {series?.newsletters.map((newsletter) => (
            <NewsletterItem
              newsletter={newsletter}
              series={series}
              key={newsletter.slug}
            />
          ))}

          <div className="lg:col-span-3">
            <NewsletterSignup />
          </div>
        </main>

        <WebmentionMetadata
          publishedAt={sortedContent[0]?.frontmatter.date}
          tags={allTags.filter((tag) => tag !== undefined)}
          title={pageTitle}
        />
      </div>
    </>
  );
};

export default SeriesPage;
