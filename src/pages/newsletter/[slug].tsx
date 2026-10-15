import type { GetStaticProps } from 'next';
import type { Newsletter, RenderedDocument } from '@data/content-types';
import type { RelatedContent, RelatedPostsManifest } from '@lib/related-posts';
import type { Series } from '@lib/series';
import type { TopicDefinition } from '@lib/topics';
import { useRouter } from 'next/router';

import { Colophon } from '@components/Colophon';
import { NewsletterSignup } from '@components/NewsletterSignup';
import FullPost from '@components/Post/FullPost';
import { RelatedPosts } from '@components/RelatedPosts';
import SEO from '@components/seo';
import StructuredData from '@components/StructuredData/StructuredData';
import WebmentionMetadata from '@components/webmentionMetadata';
import atprotoData from '@data/atproto-documents.json';
import { toRendered } from '@data/content-types';
import relatedPostsData from '@data/generated/relatedPosts.json';
import { markdownUrlFor } from '@lib/markdown-export/urls';
import { getAllNewsletters, getNewsletterBySlug } from '@lib/newsletters';
import { getSeries } from '@lib/series';
import { getTopicForTags } from '@lib/topics';
import { getDocumentUri } from '@utils/atproto';
import { generatePostStructuredData } from '@utils/generateStructuredData';
import { getCloudinaryImageUrl } from '@utils/images';
import { serialize } from '@utils/mdx';

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

  const relatedContent =
    (relatedPostsData as RelatedPostsManifest).relatedContent[params.slug] ??
    [];

  const standardSiteDocumentUri = getDocumentUri(
    (atprotoData as { documents: Record<string, string> }).documents,
    params.slug
  );

  const standardSitePublicationUri = (atprotoData as { publicationUri: string })
    .publicationUri;

  return {
    props: {
      newsletter: {
        ...toRendered(newsletter),
        source: mdxSource,
      },
      series: series ?? null,
      topic: getTopicForTags(newsletter.frontmatter.tags),
      relatedContent,
      ...(standardSiteDocumentUri ? { standardSiteDocumentUri } : {}),
      ...(standardSitePublicationUri ? { standardSitePublicationUri } : {}),
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
  newsletter: RenderedDocument<Newsletter>;
  series?: Series | null;
  topic: Pick<TopicDefinition, 'slug' | 'name'> | null;
  relatedContent: RelatedContent[];
  standardSiteDocumentUri?: string;
  standardSitePublicationUri?: string;
};

const NewsletterPage: React.FC<NewsletterPageProps> = ({
  newsletter,
  series,
  topic,
  relatedContent,
  standardSiteDocumentUri,
  standardSitePublicationUri,
}) => {
  const { frontmatter } = newsletter;

  const { coverImagePublicId, date, tags, title, excerpt, slug } = frontmatter;

  const router = useRouter();

  const postImagePublicId = coverImagePublicId || `newsletters/${slug}/cover`;
  const coverImageUrl = getCloudinaryImageUrl(postImagePublicId);

  const structuredData = generatePostStructuredData({ post: newsletter });

  return (
    <>
      <div className="mx-auto flex w-full flex-col gap-16">
        <SEO
          canonical={router.asPath}
          title={`${title}`}
          description={excerpt}
          image={coverImageUrl}
          ogType="article"
          publishedAt={date}
          tags={tags}
          standardSiteDocumentUri={standardSiteDocumentUri}
          standardSitePublicationUri={standardSitePublicationUri}
          markdownUrl={markdownUrlFor(
            'newsletter',
            newsletter.frontmatter.slug
          )}
        />
        <StructuredData structuredData={structuredData} />

        <FullPost
          post={newsletter}
          series={series}
          topic={topic}
          contentType="newsletter"
        />
        <Colophon />
      </div>
      <WebmentionMetadata
        coverImageUrl={coverImageUrl}
        summary={excerpt}
        publishedAt={date}
        tags={tags}
        title={title}
      />
      <div className="mt-20 flex flex-col gap-20">
        {relatedContent && relatedContent.length > 0 && (
          <RelatedPosts relatedContent={relatedContent} currentTitle={title} />
        )}
        <NewsletterSignup />
      </div>
    </>
  );
};

export default NewsletterPage;
