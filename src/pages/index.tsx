import type { NextPage } from 'next';
import type { TopicDefinition } from '@lib/topics';
import type { UnifiedFeedItem } from '@lib/unified-feed';
import { startOfToday } from 'date-fns';

import { Colophon } from '@components/Colophon';
import { HomeHero } from '@components/HomeHero';
import { NewsletterSignup } from '@components/NewsletterSignup';
import PaginationWrapper from '@components/Pagination';
import { PodcastSidebar } from '@components/PodcastSidebar';
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
} from '@lib/unified-feed';
import { generateFeedItemListStructuredData } from '@utils/generateStructuredData';
import { personStructuredData } from '@utils/mikePersonStructuredData';
import { ogImageUrl } from '@utils/og';
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
    <div className="mx-auto mb-10 flex w-full max-w-6xl flex-col gap-16 md:gap-20">
      <SEO
        title="Mike Bifulco | Developer Advocate & Startup Founder"
        description="Articles on React, Next.js, startup building, and developer advocacy from Mike Bifulco - CTO, Y Combinator alum, and creator of Tiny Improvements newsletter."
        image={ogImageUrl()}
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

      <UnifiedContentFeed
        items={feedItems}
        leadAside={<NewsletterSignup variant="band" source="home-lead" />}
      />

      <PaginationWrapper
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        hasNextPage={pagination.hasNextPage}
        hasPreviousPage={pagination.hasPreviousPage}
        basePath=""
      />

      <PodcastSidebar />

      <TopicLinks topics={topics} />

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
