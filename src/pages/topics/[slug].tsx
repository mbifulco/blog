import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { compareDesc } from 'date-fns';

import { Badge } from '@components/Badge';
import Breadcrumbs from '@components/Breadcrumbs/Breadcrumbs';
import { ExternalWorkItem } from '@components/ExternalWork';
import { Heading } from '@components/Heading';
import NewsletterItem from '@components/NewsletterFeed/NewsletterItem';
import { NewsletterSignup } from '@components/NewsletterSignup';
import { BlogPost as Post } from '@components/Post';
import SEO from '@components/seo';
import { StructuredData } from '@components/StructuredData';
import type { Article, BlogPost, Newsletter } from '@data/content-types';
import type { Topic } from '@lib/topics';
import { getAllTopics, getTopicContent } from '@lib/topics';
import { generateTopicStructuredData } from '@utils/generateStructuredData';

type TopicPageParams = {
  slug: string;
};

type TopicPageProps = {
  topic: Topic;
};

export const getStaticProps: GetStaticProps<
  TopicPageProps,
  TopicPageParams
> = async ({ params }) => {
  if (!params) {
    throw new Error('No params provided');
  }

  const topic = await getTopicContent(params.slug);

  if (!topic) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      topic,
    },
  };
};

export const getStaticPaths: GetStaticPaths<TopicPageParams> = async () => {
  const topics = getAllTopics();

  return {
    paths: topics.map((topic) => ({
      params: {
        slug: topic.slug,
      },
    })),
    fallback: false,
  };
};

const TopicPage: NextPage<TopicPageProps> = ({ topic }) => {
  // Combine and sort all content by date
  const allContent = [
    ...topic.posts.map((p) => ({ ...p, contentType: 'post' as const })),
    ...topic.newsletters.map((n) => ({
      ...n,
      contentType: 'newsletter' as const,
    })),
    ...topic.articles.map((a) => ({ ...a, contentType: 'article' as const })),
  ].sort((a, b) =>
    compareDesc(
      new Date(a.frontmatter.date),
      new Date(b.frontmatter.date)
    )
  );

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Topics', href: '/topics' },
    { name: topic.name, href: `/topics/${topic.slug}` },
  ];

  const pageTitle = `${topic.name} - ${topic.totalCount} Articles & Tutorials`;
  const structuredData = generateTopicStructuredData(topic);

  return (
    <>
      <SEO
        title={pageTitle}
        description={topic.description}
        ogType="article"
      />
      <StructuredData structuredData={structuredData} />

      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <Breadcrumbs crumbs={breadcrumbs} />

        <header className="mb-4 max-w-3xl">
          <div className="mb-2 flex items-center gap-3">
            {topic.icon && (
              <span className="text-4xl" aria-hidden="true">
                {topic.icon}
              </span>
            )}
            <Badge>Topic</Badge>
          </div>
          <Heading as="h1" className="mb-3 text-4xl">
            {topic.name}
          </Heading>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {topic.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {topic.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-pink-100 hover:text-pink-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-pink-900 dark:hover:text-pink-300"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </header>

        <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
          <span className="text-gray-600 dark:text-gray-400">
            <strong className="text-gray-900 dark:text-white">
              {topic.totalCount}
            </strong>{' '}
            articles in this topic
          </span>
        </div>

        <main className="grid gap-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {allContent.map((content) => {
            switch (content.contentType) {
              case 'newsletter':
                return (
                  <NewsletterItem
                    key={`newsletter-${content.frontmatter.slug}`}
                    newsletter={content as Newsletter}
                  />
                );
              case 'post':
                return (
                  <Post
                    key={`post-${content.frontmatter.slug}`}
                    post={content as BlogPost}
                    summary
                  />
                );
              case 'article':
                return (
                  <ExternalWorkItem
                    key={`article-${content.frontmatter.title}`}
                    article={content as Article}
                  />
                );
              default:
                return null;
            }
          })}
        </main>

        <div className="mt-8">
          <NewsletterSignup />
        </div>
      </div>
    </>
  );
};

export default TopicPage;
