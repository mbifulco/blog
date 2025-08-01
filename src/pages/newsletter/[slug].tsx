import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import { NewsletterSignup } from '@components/NewsletterSignup';
import { getSeries } from '@lib/series';
import type { Series } from '@lib/series';
import { Colophon } from '@components/Colophon';
import FullPost from '@components/Post/FullPost';
import SEO from '@components/seo';
import StructuredData from '@components/StructuredData/StructuredData';
import WebmentionMetadata from '@components/webmentionMetadata';
import type { Newsletter } from '@data/content-types';
import { getAllNewsletters, getNewsletterBySlug } from '@lib/newsletters';
import { getCloudinaryImageUrl } from '@utils/images';
import { serialize } from '@utils/mdx';
import { generateNewsletterBlogPostingStructuredData } from '../../utils/newsletterStructuredData';

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

  const series = newsletter.frontmatter.series
    ? await getSeries(newsletter.frontmatter.series)
    : undefined;

  return {
    props: {
      newsletter: {
        ...newsletter,
        source: mdxSource,
      },
      series: series ?? null,
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
  series?: Series | null;
};

const NewsletterPage: React.FC<NewsletterPageProps> = ({
  newsletter,
  series,
}) => {
  const { frontmatter } = newsletter;

  const { coverImagePublicId, date, tags, title, excerpt, slug } = frontmatter;

  const router = useRouter();

  const postImagePublicId = coverImagePublicId || `newsletters/${slug}/cover`;
  const coverImageUrl = getCloudinaryImageUrl(postImagePublicId);

  const blogPostingStructuredData = generateNewsletterBlogPostingStructuredData(newsletter);

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
        <StructuredData structuredData={blogPostingStructuredData} />

        <FullPost post={newsletter} series={series} />
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
      <NewsletterSignup />
    </>
  );
};

export default NewsletterPage;
