import type { NextPage } from 'next';
import { startOfToday } from 'date-fns';

import { Colophon } from '@components/Colophon';
import { HomeHero } from '@components/HomeHero';
import PaginationWrapper from '@components/Pagination';
import SEO from '@components/seo';
import StructuredData from '@components/StructuredData/StructuredData';
import { Subtitle } from '@components/Subtitle';
import { TopicLinks } from '@components/TopicLinks';
import { UnifiedContentFeed } from '@components/UnifiedContentFeed';
import WebmentionMetadata from '@components/webmentionMetadata';
import { getAllPosts } from '@lib/blog';
import { getAllNewsletters } from '@lib/newsletters';
import { getAllTopics } from '@lib/topics';
import type { TopicDefinition } from '@lib/topics';
import type { UnifiedFeedItem } from '@lib/unified-feed';
import { getPaginatedUnifiedFeed } from '@lib/unified-feed';
import { generateFeedItemListStructuredData } from '@utils/generateStructuredData';
import { getCloudinaryImageUrl } from '@utils/images';
import {
  generatePaginatedPaths,
  handlePaginatedStaticProps,
} from '@utils/pagination';

export async function getStaticPaths() {
  const getTotalPages = async (limit: number) => {
    const allPosts = await getAllPosts();
    const allNewsletters = await getAllNewsletters();
    const totalItems = allPosts.length + allNewsletters.length;
    return { totalPages: Math.ceil(totalItems / limit) };
  };
  const paths = await generatePaginatedPaths(getTotalPages, 10);
  return { paths, fallback: false };
}

export async function getStaticProps({
  params,
}: {
  params: { page: string };
}) {
  const allPosts = await getAllPosts();
  const allNewsletters = await getAllNewsletters();

  const getTotalPages = async (limit: number) => {
    const totalItems = allPosts.length + allNewsletters.length;
    return { totalPages: Math.ceil(totalItems / limit) };
  };

  return handlePaginatedStaticProps<{
    feedItems: UnifiedFeedItem[];
    topics: TopicDefinition[];
    pagination: {
      currentPage: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }>({
    params,
    getTotalPages,
    limit: 10,
    redirectBase: '/',
    getPageProps: async (page) => {
      const paginatedFeed = getPaginatedUnifiedFeed(
        allPosts,
        allNewsletters,
        { page, limit: 10 }
      );

      const topics = getAllTopics();

      return {
        props: {
          feedItems: paginatedFeed.items,
          topics,
          pagination: {
            currentPage: paginatedFeed.currentPage,
            totalPages: paginatedFeed.totalPages,
            hasNextPage: paginatedFeed.hasNextPage,
            hasPreviousPage: paginatedFeed.hasPreviousPage,
          },
        },
      };
    },
  });
}

const headshotPublicId = 'mike-headshot-square';
const headshotPublicUrl = getCloudinaryImageUrl(headshotPublicId);

type PaginatedPageProps = {
  feedItems: UnifiedFeedItem[];
  topics: TopicDefinition[];
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

const PaginatedPage: NextPage<PaginatedPageProps> = ({
  feedItems,
  topics,
  pagination,
}) => {
  return (
    <div className="mx-auto mb-10 flex max-w-4xl flex-col gap-12 px-4">
      <SEO
        title={`Page ${pagination.currentPage} | Mike Bifulco`}
        description={`Page ${pagination.currentPage} of articles on React, design, and startup building from Mike Bifulco.`}
        image={headshotPublicUrl}
        pagination={{
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          basePath: '',
        }}
      />
      <StructuredData
        structuredData={generateFeedItemListStructuredData(
          feedItems,
          pagination.currentPage
        )}
      />

      <HomeHero />

      {/* Unified content feed */}
      <div>
        <Subtitle>ARTICLES</Subtitle>
        <div className="mt-4">
          <UnifiedContentFeed items={feedItems} />
        </div>
      </div>

      {/* Topic discovery */}
      <TopicLinks topics={topics} />

      {/* Pagination */}
      <PaginationWrapper
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        hasNextPage={pagination.hasNextPage}
        hasPreviousPage={pagination.hasPreviousPage}
        basePath=""
      />

      <WebmentionMetadata
        summary="mikebifulco.com - articles on design, development, and making the world a better place."
        title="Home - mikebifulco.com"
        publishedAt={startOfToday()}
      />

      <Colophon />
    </div>
  );
};

export default PaginatedPage;
