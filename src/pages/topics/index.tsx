import type { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';

import { Heading } from '@components/Heading';
import NewsletterSignup from '@components/NewsletterSignup/NewsletterBannerFancy';
import SEO from '@components/seo';
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
          <Heading as="h1" className="text-4xl">
            Topics
          </Heading>
          <p className="mt-2 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Deep dives into the subjects I write about most. Each topic brings
            together related articles, tutorials, and insights.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {topics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/topics/${topic.slug}`}
              className="group rounded-xl border border-gray-200 p-6 transition-all hover:border-pink-300 hover:shadow-md dark:border-gray-700 dark:hover:border-pink-600"
            >
              <div className="mb-3 flex items-center gap-3">
                {topic.icon && (
                  <span className="text-3xl" aria-hidden="true">
                    {topic.icon}
                  </span>
                )}
                <Heading
                  as="h2"
                  className="m-0 text-xl font-semibold text-gray-900 group-hover:text-pink-600 dark:text-white dark:group-hover:text-pink-400"
                >
                  {topic.name}
                </Heading>
              </div>
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                {topic.description}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                <span className="font-medium text-pink-600 dark:text-pink-400">
                  {topic.totalCount} articles
                </span>
                <span>•</span>
                <span className="flex flex-wrap gap-1">
                  {topic.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-800"
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
