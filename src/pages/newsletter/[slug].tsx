import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import { Colophon } from '@components/Colophon';
import { NewsletterSignup } from '@components/NewsletterSignup';
import FullPost from '@components/Post/FullPost';
import { RelatedPosts } from '@components/RelatedPosts';
import SEO from '@components/seo';
import StructuredData from '@components/StructuredData/StructuredData';
import WebmentionMetadata from '@components/webmentionMetadata';
import type { Newsletter } from '@data/content-types';
import { getAllNewsletters, getNewsletterBySlug } from '@lib/newsletters';
import type { RelatedContent } from '@lib/related-posts';
import { getRelatedContent } from '@lib/related-posts';
import { getSeries } from '@lib/series';
import type { Series } from '@lib/series';
import { getCloudinaryImageUrl } from '@utils/images';
import { serialize } from '@utils/mdx';
import { generatePostStructuredData } from '@utils/generateStructuredData';

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

  const relatedContent = await getRelatedContent({
    currentSlug: params.slug,
    currentTags: newsletter.frontmatter.tags || [],
    limit: 3,
    includeNewsletters: true,
  });

  return {
    props: {
      newsletter: {
        ...newsletter,
        source: mdxSource,
      },
      series: series ?? null,
      relatedContent,
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
  relatedContent: RelatedContent[];
};

const NewsletterPage: React.FC<NewsletterPageProps> = ({
  newsletter,
  series,
  relatedContent,
}) => {
  const { frontmatter } = newsletter;

  const { coverImagePublicId, date, tags, title, excerpt, slug } = frontmatter;

  const router = useRouter();

  const postImagePublicId = coverImagePublicId || `newsletters/${slug}/cover`;
  const coverImageUrl = getCloudinaryImageUrl(postImagePublicId);

  const structuredData = generatePostStructuredData({ post: newsletter });

  return (
    <>
      <div className="mx-auto flex max-w-full flex-col">
        <SEO
          canonical={router.asPath}
          title={`${title}`}
          description={excerpt}
          image={coverImageUrl}
          ogType="article"
          publishedAt={date}
          tags={tags}
        />
        <StructuredData structuredData={structuredData} />

        <FullPost post={newsletter} series={series} contentType="newsletter" />
        <Colophon />
      </div>
      <WebmentionMetadata
        coverImageUrl={coverImageUrl}
        summary={excerpt}
        publishedAt={date}
        tags={tags}
        title={title}
      />
      {relatedContent && relatedContent.length > 0 && (
        <RelatedPosts relatedContent={relatedContent} currentTitle={title} />
      )}
      <NewsletterSignup />
    </>
  );
};

export default NewsletterPage;
