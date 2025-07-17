import type { NextPage } from 'next';
import Link from 'next/link';
import { startOfToday } from 'date-fns';

import { Colophon } from '../components/Colophon';
import { Heading } from '../components/Heading';
import { Headshot } from '../components/Headshot';
import NewsletterItem from '../components/NewsletterFeed/NewsletterItem';
import PaginationWrapper from '../components/Pagination';
import { PostFeed } from '../components/PostFeed';
import SEO from '../components/seo';
import { Subtitle } from '../components/Subtitle';
import WebmentionMetadata from '../components/webmentionMetadata';
import config from '../config';
import type { BlogPost, Newsletter } from '../data/content-types';
import { getPaginatedPosts } from '../lib/blog';
import { getAllNewsletters } from '../lib/newsletters';
import { getCloudinaryImageUrl } from '../utils/images';
import { generateRSSFeed } from '../utils/rss';

export async function getStaticProps() {
  const paginatedPosts = await getPaginatedPosts({ limit: 10 });
  const newsletters = await getAllNewsletters();

  generateRSSFeed(paginatedPosts.items, newsletters);

  return {
    props: {
      posts: paginatedPosts.items,
      newsletter: newsletters[0],
      pagination: {
        currentPage: paginatedPosts.currentPage,
        totalPages: paginatedPosts.totalPages,
        hasNextPage: paginatedPosts.hasNextPage,
        hasPreviousPage: paginatedPosts.hasPreviousPage,
      },
    },
  };
}

const headshotPublicId = 'mike-headshot-square';
const headshotPublicUrl = getCloudinaryImageUrl(headshotPublicId);

type HomePageProps = {
  posts: BlogPost[];
  newsletter: Newsletter;
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

const HomePage: NextPage<HomePageProps> = ({
  posts,
  newsletter,
  pagination,
}) => {
  return (
    <div className="mx-auto mb-10 flex max-w-4xl flex-col gap-12">
      <SEO
        title="Latest articles on design, development, and the world around me"
        image={headshotPublicUrl}
      />
      <div className="my-4 items-start gap-4 md:flex">
        <div className="mr-0 overflow-clip rounded-xl lg:mr-4">
          <Headshot size={250} />
        </div>
        <div className="prose prose-xl max-w-[50ch]">
          <Heading as="h2" className="m-0 mb-2 text-4xl font-bold">
            Oh, hello
          </Heading>
          <p className="text-xl font-normal italic">
            I work as a {config.employer.role} at{' '}
            <Link
              href={config.employer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:underline"
            >
              {config.employer.name}
            </Link>{' '}
            &mdash; I&apos;m a founder &amp; product builder with background in
            design and development.
          </p>
          <p className="m-0 text-xl font-normal">
            Find me on Bluesky{' '}
            <Link
              href="https://bsky.app/profile/mikebifulco.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:underline"
            >
              @mikebifulco.com
            </Link>
            {', '}Threads{' '}
            <Link
              href="https://threads.net/@irreverentmike"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:underline"
            >
              @irreverentmike
            </Link>{' '}
            or{' '}
            <Link
              className="text-pink-600 hover:underline"
              href="https://hachyderm.io/@irreverentmike"
            >
              Mastodon
            </Link>
            .
          </p>
          <p className="text-sm italic">
            What you see here are my own thoughts, and don&apos;t necessarily
            reflect the views or opinions of {config.employer.name} or you, or
            anyone else.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <Subtitle>
            <Link href="/newsletter">💌 Tiny Improvements newsletter</Link>
          </Subtitle>
          <div className="my-2">
            <NewsletterItem newsletter={newsletter} />
          </div>
        </div>

        <div>
          <Subtitle>
            <Link href="/podcast">🎙️ The Podcast</Link>
          </Subtitle>
          <div className="my-2">
            <iframe
              width="100%"
              height="390"
              seamless
              src="https://share.transistor.fm/e/tiny-improvements/playlist?color=F90476"
            />
          </div>
        </div>
      </div>

      <div>
        <Subtitle>LATEST POSTS</Subtitle>
        <PostFeed posts={posts} />
        <PaginationWrapper
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          hasNextPage={pagination.hasNextPage}
          hasPreviousPage={pagination.hasPreviousPage}
          basePath=""
        />
      </div>
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
