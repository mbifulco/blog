import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import NewsletterHero from '@components/NewsletterSignup/NewsletterHero';
import { BreadCrumbs } from '../../components/Breadcrumbs';
import { Colophon } from '../../components/Colophon';
import FullPost from '../../components/Post/FullPost';
import SEO from '../../components/seo';
import WebmentionMetadata from '../../components/webmentionMetadata';
import type { Newsletter } from '../../data/content-types';
import { getAllNewsletters, getNewsletterBySlug } from '../../lib/newsletters';
import { getCloudinaryImageUrl } from '../../utils/images';
import { serialize } from '../../utils/mdx';

type NewsletterPageParams = {
  slug: string;
};

export const getStaticProps: GetStaticProps<
  NewsletterPageProps,
  NewsletterPageParams
> = async ({ params }) => {
  if (!params) {
    throw new Error('No params provided');
  }

  const newsletter = await getNewsletterBySlug(params.slug);

  const mdxSource = await serialize(newsletter.content);

  return {
    props: {
      newsletter: {
        ...newsletter,
        source: mdxSource,
      },
    },
  };
};

export async function getStaticPaths() {
  const newsletters = await getAllNewsletters();

  return {
    paths: newsletters.map((post) => ({
      params: {
        slug: post.slug,
      },
    })),
    fallback: false,
  };
}

type NewsletterPageProps = {
  newsletter: Newsletter;
};

const NewsletterPage: React.FC<NewsletterPageProps> = ({ newsletter }) => {
  const { frontmatter } = newsletter;

  const { coverImagePublicId, date, tags, title, excerpt, path } = frontmatter;

  const router = useRouter();

  const postImagePublicId = coverImagePublicId || `posts/${path}/cover`;
  const coverImageUrl = getCloudinaryImageUrl(postImagePublicId);

  return (
    <>
      <div className="mx-auto flex max-w-full flex-col gap-8 xl:max-w-4xl">
        <SEO
          canonical={router.asPath}
          title={`${title}`}
          description={excerpt}
          image={coverImageUrl}
          ogType="article"
        />
        <div className="mx-auto w-full max-w-full text-ellipsis px-4 sm:px-2 lg:px-0 xl:max-w-4xl">
          <BreadCrumbs
            crumbs={[
              {
                name: '💌 Tiny Improvements',
                href: '/newsletter',
              },
              {
                name: title,
                href: `#`,
              },
            ]}
          />
        </div>

        <FullPost post={newsletter} />
        <Colophon />

        <p className="mx-auto mt-0 max-w-full text-xl xl:max-w-4xl">
          Thanks for reading Tiny Improvements. If you found this helpful,{' '}
          {"I'd "}
          love it if you shared this with a friend. It helps me out a great
          deal.
        </p>
        <p className="mx-auto max-w-4xl text-xl">
          Until next time - be excellent to each other!
        </p>
      </div>
      <WebmentionMetadata
        coverImageUrl={coverImageUrl}
        summary={excerpt}
        publishedAt={date}
        tags={tags}
        title={title}
      />
      <div className="mt-10" />
      <NewsletterHero />
    </>
  );
};

export default NewsletterPage;
