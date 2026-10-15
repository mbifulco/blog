import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import type { BlogPost, Newsletter } from '@data/content-types';
import type { Topic } from '@lib/topics';
import { compareDesc } from 'date-fns';

import Breadcrumbs from '@components/Breadcrumbs/Breadcrumbs';
import { Heading } from '@components/Heading';
import Link from '@components/Link';
import NewsletterItem from '@components/NewsletterFeed/NewsletterItem';
import { NewsletterSignup } from '@components/NewsletterSignup';
import { BlogPost as Post } from '@components/Post';
import SEO from '@components/seo';
import { StructuredData } from '@components/StructuredData';
import { getAllTopics, getTopicContent } from '@lib/topics';
import { generateTopicStructuredData } from '@utils/generateStructuredData';
import { ogImageUrl } from '@utils/og';

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
  // Combine and sort all content by date (excluding articles since they don't have show pages)
  const allContent = [
    ...topic.posts.map((p) => ({ ...p, contentType: 'post' as const })),
    ...topic.newsletters.map((n) => ({
      ...n,
      contentType: 'newsletter' as const,
    })),
  ].sort((a, b) =>
    compareDesc(new Date(a.frontmatter.date), new Date(b.frontmatter.date))
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
        image={ogImageUrl(`topics/${topic.slug}`)}
        title={pageTitle}
        description={topic.description}
        ogType="article"
      />
      <StructuredData structuredData={structuredData} />

      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <Breadcrumbs crumbs={breadcrumbs} />

        <header className="mb-4 max-w-3xl">
          <Heading
            as="h1"
            className="mb-3 text-balance text-3xl [overflow-wrap:anywhere] sm:text-4xl"
          >
            {topic.name}
          </Heading>
          <p className="text-ink-muted font-serif text-lg">
            {topic.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
            {topic.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="text-ink-muted hover:text-riso-pink font-futura text-sm font-bold no-underline"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </header>

        <div className="border-riso-blue flex items-center justify-between border-b-2 pb-4">
          <span className="text-ink-muted font-futura font-bold">
            <strong className="text-riso-blue">{topic.totalCount}</strong>{' '}
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
