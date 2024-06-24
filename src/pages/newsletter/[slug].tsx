import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import NewsletterHero from '@components/NewsletterSignup/NewsletterHero';
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
      <div className="mx-auto flex max-w-full flex-col">
        <SEO
          canonical={router.asPath}
          title={`${title}`}
          description={excerpt}
          image={coverImageUrl}
          ogType="article"
        />

        <FullPost post={newsletter} />
        <Colophon />
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
