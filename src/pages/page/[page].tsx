import type { NextPage } from 'next';
import type { TopicDefinition } from '@lib/topics';
import type { UnifiedFeedItem } from '@lib/unified-feed';
import { startOfToday } from 'date-fns';

import { Colophon } from '@components/Colophon';
import PaginationWrapper from '@components/Pagination';
import SEO from '@components/seo';
import StructuredData from '@components/StructuredData/StructuredData';
import { TopicLinks } from '@components/TopicLinks';
import { UnifiedContentFeed } from '@components/UnifiedContentFeed';
import WebmentionMetadata from '@components/webmentionMetadata';
import { getAllPosts } from '@lib/blog';
import { getAllNewsletters } from '@lib/newsletters';
import { getAllTopics } from '@lib/topics';
import {
  buildUnifiedFeed,
  getTotalFeedPages,
  HOME_PAGE_LIMIT,
  PAGE_LIMIT,
} from '@lib/unified-feed';
import { generateFeedItemListStructuredData } from '@utils/generateStructuredData';
import { ogImageUrl } from '@utils/og';

export async function getStaticPaths() {
  const allPosts = await getAllPosts();
  const allNewsletters = await getAllNewsletters();
  const totalItems = allPosts.length + allNewsletters.length;
  const totalPages = getTotalFeedPages(totalItems);

  const paths = [];
  for (let i = 2; i <= totalPages; i++) {
    paths.push({ params: { page: i.toString() } });
  }
  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { page: string } }) {
  const pageParam = params?.page;
  const page = parseInt(pageParam, 10);

  if (isNaN(page) || page < 2 || !pageParam.match(/^\d+$/)) {
    return { notFound: true };
  }

  const allPosts = await getAllPosts();
  const allNewsletters = await getAllNewsletters();
  const allItems = buildUnifiedFeed(allPosts, allNewsletters);
  const totalPages = getTotalFeedPages(allItems.length);

  if (page > totalPages) {
    return { redirect: { destination: '/', permanent: false } };
  }

  const offset = HOME_PAGE_LIMIT + (page - 2) * PAGE_LIMIT;
  const feedItems = allItems.slice(offset, offset + PAGE_LIMIT);
  const topics = getAllTopics();

  return {
    props: {
      feedItems,
      topics,
      pagination: {
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: true,
      },
    },
  };
}

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
        title={`Articles - Page ${pagination.currentPage}`}
        description={`Page ${pagination.currentPage} of articles on React, design, and startup building from Mike Bifulco.`}
        image={ogImageUrl({
          title: 'Articles',
          kicker: `Page ${pagination.currentPage}`,
        })}
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

      <div>
        <h1 className="border-riso-blue text-riso-blue m-0 border-b-2 pb-3 font-futura text-3xl font-bold tracking-[-0.01em]">
          Articles{' '}
          <span className="text-ink-muted">
            · Page {pagination.currentPage}
          </span>
        </h1>
        <div className="mt-4">
          <UnifiedContentFeed items={feedItems} layout="grid" />
        </div>
      </div>

      <TopicLinks topics={topics} />

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
