import type { GetStaticProps, NextPage } from 'next';
import type { RelatedContent, RelatedPostsManifest } from '@lib/related-posts';
import type { Series } from '@lib/series';
import type { BlogPost } from '../../data/content-types';
import { useRef } from 'react';
import { useRouter } from 'next/router';
import posthog from 'posthog-js';

import { NewsletterSignup } from '@components/NewsletterSignup';
import { RelatedPosts } from '@components/RelatedPosts';
import atprotoData from '@data/atproto-documents.json';
import relatedPostsData from '@data/generated/relatedPosts.json';
import { getSeries } from '@lib/series';
import { Colophon } from '../../components/Colophon';
import { BlogPost as Post } from '../../components/Post';
import SEO from '../../components/seo';
import WebmentionMetadata from '../../components/webmentionMetadata';
import { getAllPosts, getPostBySlug } from '../../lib/blog';
import { getDocumentUri } from '../../utils/atproto';
import { getCloudinaryImageUrl } from '../../utils/images';

type PostPageParams = {
  slug: string;
};

type PostPageProps = {
  post: BlogPost;
  series?: Series | null;
  relatedContent: RelatedContent[];
  standardSiteDocumentUri?: string;
  standardSitePublicationUri?: string;
};

export const getStaticProps: GetStaticProps<
  PostPageProps,
  PostPageParams
> = async ({ params }) => {
  if (!params) {
    throw new Error('No params provided');
  }

  const post = await getPostBySlug(params.slug);

  const series = post.frontmatter.series
    ? await getSeries(post.frontmatter.series)
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
      post,
      series: series ?? null,
      relatedContent,
      ...(standardSiteDocumentUri ? { standardSiteDocumentUri } : {}),
      ...(standardSitePublicationUri ? { standardSitePublicationUri } : {}),
    },
  };
};

export async function getStaticPaths() {
  const posts = await getAllPosts();

  return {
    paths: posts.map((post) => ({
      params: {
        slug: post.slug,
      },
    })),
    fallback: false,
  };
}

const PostPage: NextPage<PostPageProps> = ({
  post,
  series,
  relatedContent,
  standardSiteDocumentUri,
  standardSitePublicationUri,
}) => {
  const { frontmatter } = post;

  const {
    coverImagePublicId,
    published,
    date,
    updated,
    tags,
    title,
    excerpt,
    slug,
  } = frontmatter;

  const router = useRouter();
  const hasTrackedRead = useRef(false);

  // Track post read started event (fires once when user engages with content)
  const handlePostReadStarted = () => {
    if (hasTrackedRead.current) return;
    hasTrackedRead.current = true;

    posthog.capture('post_read_started', {
      post_slug: slug,
      post_title: title,
      post_tags: tags,
      series_name: series?.name,
      published_date: date,
    });
  };
  const postImagePublicId = coverImagePublicId || `posts/${slug}/cover`;
  const coverImageUrl = getCloudinaryImageUrl(postImagePublicId);

  return (
    <>
      <div
        className="mx-auto w-full px-4 md:px-0"
        onMouseEnter={handlePostReadStarted}
      >
        <SEO
          canonical={router.asPath}
          title={title}
          description={excerpt}
          image={coverImageUrl}
          ogType="article"
          publishedAt={date}
          modifiedAt={updated}
          tags={tags}
          standardSiteDocumentUri={standardSiteDocumentUri}
          standardSitePublicationUri={standardSitePublicationUri}
        />
        {published === false && process.env.NODE_ENV !== 'production' && (
          <div>
            <em>Note:</em> this is a draft post
          </div>
        )}

        <Post post={post} series={series} />
        <WebmentionMetadata
          coverImageUrl={coverImageUrl}
          summary={excerpt}
          publishedAt={date}
          tags={tags}
          title={title}
        />
        <Colophon />
      </div>
      {relatedContent && relatedContent.length > 0 && (
        <RelatedPosts relatedContent={relatedContent} currentTitle={title} />
      )}
      <NewsletterSignup />
    </>
  );
};

export default PostPage;
