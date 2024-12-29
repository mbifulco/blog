import type { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { compareAsc } from 'date-fns';

import { Heading } from '@components/Heading';
import NewsletterItem from '@components/NewsletterFeed/NewsletterItem';
import { NewsletterSignup } from '@components/NewsletterSignup';
import { StructuredData } from '@components/StructuredData';
import { getAllSeries, getSeries } from '@lib/series';
import type { Series } from '@lib/series';
import { generateSeriesStructuredData } from '@utils/generateStructuredData';
import { Colophon } from '../../components/Colophon';
import { BlogPost as Post } from '../../components/Post';
import SEO from '../../components/seo';
import WebmentionMetadata from '../../components/webmentionMetadata';
import type { BlogPost } from '../../data/content-types';
import { getAllPosts, getPostBySlug } from '../../lib/blog';
import { getCloudinaryImageUrl } from '../../utils/images';

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
  if (!series) {
    return null;
  }

  const router = useRouter();

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

        <Heading as="h1" className="mb-12 text-center uppercase text-black">
          The <em>{series?.name}</em> series - {series?.length} parts
        </Heading>

        <StructuredData structuredData={generateSeriesStructuredData(series)} />

        <main className="mx-auto grid max-w-full gap-8 lg:grid-cols-3">
          {series?.posts.map((post) => (
            <Post post={post} series={series} summary />
          ))}
          {series?.newsletters.map((newsletter) => (
            <NewsletterItem newsletter={newsletter} series={series} />
          ))}

          <div className="lg:col-span-3">
            <NewsletterSignup />
          </div>
        </main>

        <WebmentionMetadata
          publishedAt={series?.posts[0].frontmatter.date}
          tags={allTags.filter((tag) => tag !== undefined)}
          title={pageTitle}
        />
        <Colophon />
      </div>
    </>
  );
};

export default SeriesPage;
