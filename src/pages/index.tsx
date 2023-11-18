import type { NextPage } from 'next';
import Link from 'next/link';
import { startOfToday } from 'date-fns';

import { PostFeed } from '../components/PostFeed';
import SEO from '../components/seo';
import { Subtitle } from '../components/Subtitle';
import WebmentionMetadata from '../components/webmentionMetadata';

import { getAllPosts } from '../lib/blog';
import { generateRSSFeed } from '../utils/rss';
import { getCloudinaryImageUrl } from '../utils/images';
import config from '../config';
import { getAllNewsletters } from '../lib/newsletters';
import NewsletterItem from '../components/NewsletterFeed/NewsletterItem';
import { Headshot } from '../components/Headshot';
import type { Newsletter, BlogPost } from '../data/content-types';

export async function getStaticProps() {
  const posts = await getAllPosts();
  const newsletters = await getAllNewsletters();

  generateRSSFeed(posts, newsletters);

  return {
    props: {
      posts,
      newsletter: newsletters[0],
    },
  };
}

const headshotPublicId = 'mike-headshot-square';
const headshotPublicUrl = getCloudinaryImageUrl(headshotPublicId);

type HomePageProps = {
  posts: BlogPost[];
  newsletter: Newsletter;
};

const HomePage: NextPage<HomePageProps> = ({ posts, newsletter }) => {
  return (
    <>
      <SEO
        title="Latest articles on design, development, and the world around me"
        image={headshotPublicUrl}
      />
      <div className="md:flex my-4 items-start">
        <div className="mr-0 lg:mr-4">
          <Headshot size={250} />
        </div>
        <div className="max-w-[50ch]">
          <h2 className="text-4xl m-0 font-bold mb-2">Oh, hello</h2>
          <p className="text-xl font-normal m-0">
            {"I'm"} a startup founder, a designer, and a maker. I share my
            writing on this site, but you can also find me on threads{' '}
            <Link
              href="https://threads.net/@irrevernemikt"
              target="_blank"
              rel="noopener noreferrer"
            >
              @irreverentmike
            </Link>{' '}
            <Link
              className="text-pink-600 hover:underline"
              href="https://hachyderm.io/@irreverentmike"
            >
              Mastodon
            </Link>{' '}
            and{' '}
            <Link
              className="text-pink-600 hover:underline"
              href="https://github.com/mbifulco"
            >
              GitHub
            </Link>
            .
          </p>
          <p className="text-cl font-normal italic mt-4 mx-0 mb-0">
            I work as a {config.employer.role} at{' '}
            <Link
              href={config.employer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:underline"
            >
              {config.employer.name}
            </Link>{' '}
            &mdash; however, the things I post here are my own, and {"don't "}
            necessarily reflect the views or opinions of {config.employer.name}.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div>
          <Subtitle>
            <Link href="/newsletter">💌 Tiny Improvements newsletter</Link>
          </Subtitle>
          <div className="my-4">
            <NewsletterItem newsletter={newsletter} />
          </div>
        </div>

        <div>
          <Subtitle>
            <Link href="/podcast">🎙️ The Podcast</Link>
          </Subtitle>
          <div className="pt-4">
            <iframe
              width="100%"
              height="390"
              seamless
              src="https://share.transistor.fm/e/tiny-improvements/playlist"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div>
          <Subtitle>LATEST POSTS</Subtitle>
        </div>
        <PostFeed posts={posts} />
      </div>
      <WebmentionMetadata
        summary="mikebifulco.com - articles on design, development, and making the world a better place."
        title="Home - mikebifulco.com"
        publishedAt={startOfToday()}
      />
    </>
  );
};

export default HomePage;
