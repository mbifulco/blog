import type { NextPage } from 'next';
import { startOfToday } from 'date-fns';

import { Colophon } from '@components/Colophon';
import { HomeHero } from '@components/HomeHero';
import PaginationWrapper from '@components/Pagination';
import { PodcastSidebar } from '@components/PodcastSidebar';
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
import {
  buildUnifiedFeed,
  getTotalFeedPages,
  HOME_PAGE_LIMIT,
} from '@lib/unified-feed';
import { generateFeedItemListStructuredData } from '@utils/generateStructuredData';
import { getCloudinaryImageUrl } from '@utils/images';
import { personStructuredData } from '@utils/mikePersonStructuredData';
import { generateRSSFeed } from '@utils/rss';

export async function getStaticProps() {
  const allPosts = await getAllPosts();
  const allNewsletters = await getAllNewsletters();

  // Fix: pass ALL posts to RSS feed, not just paginated subset
  generateRSSFeed(allPosts, allNewsletters);

  const allItems = buildUnifiedFeed(allPosts, allNewsletters);
  const feedItems = allItems.slice(0, HOME_PAGE_LIMIT);
  const totalPages = getTotalFeedPages(allItems.length);

  const topics = getAllTopics();

  return {
    props: {
      feedItems,
      topics,
      pagination: {
        currentPage: 1,
        totalPages,
        hasNextPage: totalPages > 1,
        hasPreviousPage: false,
      },
    },
  };
}

const headshotPublicId = 'mike-headshot-square';
const headshotPublicUrl = getCloudinaryImageUrl(headshotPublicId);

type HomePageProps = {
  feedItems: UnifiedFeedItem[];
  topics: TopicDefinition[];
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

const HomePage: NextPage<HomePageProps> = ({
  feedItems,
  topics,
  pagination,
}) => {
  return (
    <div className="mx-auto mb-10 flex max-w-4xl flex-col gap-12 px-4">
      <SEO
        title="Mike Bifulco | Developer Advocate & Startup Founder"
        description="Articles on React, Next.js, startup building, and developer advocacy from Mike Bifulco - CTO, Y Combinator alum, and creator of Tiny Improvements newsletter."
        image={headshotPublicUrl}
        pagination={{
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          basePath: '',
        }}
      />
      <StructuredData structuredData={personStructuredData} />
      <StructuredData
        structuredData={generateFeedItemListStructuredData(feedItems, 1)}
      />

      <HomeHero priorityImage />

      {/* Podcast: accordion on mobile/tablet */}
      <PodcastSidebar />

      {/* Unified content feed */}
      <div>
        <Subtitle>LATEST</Subtitle>
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

export default HomePage;
