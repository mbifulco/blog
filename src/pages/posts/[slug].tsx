import type { GetStaticProps, NextPage } from 'next';
import type { RelatedContent, RelatedPostsManifest } from '@lib/related-posts';
import type { Series } from '@lib/series';
import type { TopicDefinition } from '@lib/topics';
import type { BlogPost, RenderedDocument } from '../../data/content-types';
import { useRef } from 'react';
import { useRouter } from 'next/router';
import posthog from 'posthog-js';

import PostSignoff from '@components/NewsletterSignup/PostSignoff';
import { RelatedPosts } from '@components/RelatedPosts';
import atprotoData from '@data/atproto-documents.json';
import relatedPostsData from '@data/generated/relatedPosts.json';
import { markdownUrlFor } from '@lib/markdown-export/urls';
import { getLatestNewsletter } from '@lib/newsletters';
import { getSeries } from '@lib/series';
import { getTopicForTags } from '@lib/topics';
import { Colophon } from '../../components/Colophon';
import { BlogPost as Post } from '../../components/Post';
import SEO from '../../components/seo';
import WebmentionMetadata from '../../components/webmentionMetadata';
import { toRendered } from '../../data/content-types';
import { getAllPosts, getPostBySlug } from '../../lib/blog';
import { getDocumentUri } from '../../utils/atproto';
import { getCloudinaryImageUrl } from '../../utils/images';

type PostPageParams = {
  slug: string;
};

type PostPageProps = {
  post: RenderedDocument<BlogPost>;
  series?: Series | null;
  topic: Pick<TopicDefinition, 'slug' | 'name'> | null;
  relatedContent: RelatedContent[];
  latestIssue: { slug: string; title: string } | null;
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

  const latest = await getLatestNewsletter();

  const standardSiteDocumentUri = getDocumentUri(
    (atprotoData as { documents: Record<string, string> }).documents,
    params.slug
  );

  const standardSitePublicationUri = (atprotoData as { publicationUri: string })
    .publicationUri;

  return {
    props: {
      post: toRendered(post),
      series: series ?? null,
      topic: getTopicForTags(post.frontmatter.tags),
      relatedContent,
      latestIssue: latest
        ? { slug: latest.frontmatter.slug, title: latest.frontmatter.title }
        : null,
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
  topic,
  relatedContent,
  latestIssue,
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
        className="mx-auto flex w-full flex-col gap-16"
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
          markdownUrl={markdownUrlFor('posts', post.frontmatter.slug)}
        />
        {published === false && process.env.NODE_ENV !== 'production' && (
          <div>
            <em>Note:</em> this is a draft post
          </div>
        )}

        <Post
          post={post}
          series={series}
          topic={topic}
          signoff={
            <PostSignoff
              source="post-signoff"
              slug={slug}
              latestIssue={latestIssue}
            />
          }
        />
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
        <Colophon />
      </div>
    </>
  );
};

export default PostPage;
