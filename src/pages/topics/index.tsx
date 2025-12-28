import type { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';

import NewsletterSignup from '@components/NewsletterSignup/NewsletterBannerFancy';
import SEO from '@components/seo';
import { Subtitle } from '@components/Subtitle';
import type { TopicDefinition } from '@lib/topics';
import { getAllTopicsWithCounts } from '@lib/topics';

type TopicsPageProps = {
  topics: (TopicDefinition & { totalCount: number })[];
};

export const getStaticProps: GetStaticProps<TopicsPageProps> = async () => {
  const topics = await getAllTopicsWithCounts();

  return {
    props: {
      topics,
    },
  };
};

const TopicsPage: NextPage<TopicsPageProps> = ({ topics }) => {
  return (
    <>
      <main className="mx-auto flex max-w-5xl flex-col gap-8">
        <SEO
          title="Topics - Deep Dives into React, Startups, Design & Developer Tools"
          description="Explore curated collections of articles on React development, startup building, design & UX, and developer productivity. Learn from real-world experience."
        />
        <header>
          <Subtitle>Topics</Subtitle>
          <p className="mt-2 max-w-2xl text-lg text-gray-600">
            Deep dives into the subjects I write about most. Each topic brings
            together related articles, tutorials, and insights.
          </p>
        </header>

        <div className="grid gap-12 md:grid-cols-2 md:gap-x-16 md:gap-y-10">
          {topics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/topics/${topic.slug}`}
              className="group no-underline"
            >
              <div className="mb-2 flex items-center gap-3">
                {topic.icon && (
                  <span className="text-3xl" aria-hidden="true">
                    {topic.icon}
                  </span>
                )}
                <h2 className="m-0 font-futura text-xl font-bold text-gray-900 group-hover:text-pink-600">
                  {topic.name}
                </h2>
              </div>
              <p className="mb-3 text-gray-600">
                {topic.description}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="font-medium text-pink-600">
                  {topic.totalCount} articles
                </span>
                <span>•</span>
                <span className="flex flex-wrap gap-1">
                  {topic.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-gray-100 px-2 py-0.5 text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <div className="mt-12">
        <NewsletterSignup />
      </div>
    </>
  );
};

export default TopicsPage;
