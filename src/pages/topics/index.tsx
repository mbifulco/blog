import type { GetStaticProps, NextPage } from 'next';
import type { TopicDefinition } from '@lib/topics';

import Link from '@components/Link';
import NewsletterSignup from '@components/NewsletterSignup/NewsletterBannerFancy';
import SEO from '@components/seo';
import { getAllTopicsWithCounts } from '@lib/topics';
import { ogImageUrl } from '@utils/og';

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
          image={ogImageUrl('topics')}
          title="Topics - Deep Dives into React, Startups, Design & Developer Tools"
          description="Explore curated collections of articles on React development, startup building, design & UX, and developer productivity. Learn from real-world experience."
        />
        <header>
          <h1 className="border-riso-blue text-riso-blue m-0 border-b-2 pb-3 font-futura text-3xl font-bold tracking-[-0.01em]">
            Topics
          </h1>
          <p className="text-ink-muted mt-4 max-w-2xl font-serif text-lg">
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
              <h2 className="text-riso-blue group-hover:text-riso-pink m-0 mb-2 text-balance font-futura text-xl font-bold">
                {topic.name}
              </h2>
              <p className="text-ink-muted mb-3 font-serif text-lg leading-snug">
                {topic.description}
              </p>
              <p className="text-ink-muted m-0 flex flex-wrap items-baseline gap-x-2 gap-y-1 font-futura text-sm font-bold">
                <span className="text-riso-pink">
                  {topic.totalCount} articles
                </span>
                {topic.tags.map((tag) => (
                  <span key={tag} className="font-mono text-xs font-normal">
                    #{tag}
                  </span>
                ))}
              </p>
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
