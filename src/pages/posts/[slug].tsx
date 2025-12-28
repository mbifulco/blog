import type { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import posthog from 'posthog-js';

import { NewsletterSignup } from '@components/NewsletterSignup';
import { RelatedPosts } from '@components/RelatedPosts';
import type { RelatedContent } from '@lib/related-posts';
import { getRelatedContent } from '@lib/related-posts';
import { getSeries } from '@lib/series';
import type { Series } from '@lib/series';
import { Colophon } from '../../components/Colophon';
import { BlogPost as Post } from '../../components/Post';
import SEO from '../../components/seo';
import WebmentionMetadata from '../../components/webmentionMetadata';
import type { BlogPost } from '../../data/content-types';
import { getAllPosts, getPostBySlug } from '../../lib/blog';
import { getCloudinaryImageUrl } from '../../utils/images';

type PostPageParams = {
  slug: string;
};

type PostPageProps = {
  post: BlogPost;
  series?: Series | null;
  relatedContent: RelatedContent[];
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

  const relatedContent = await getRelatedContent({
    currentSlug: params.slug,
    currentTags: post.frontmatter.tags || [],
    limit: 3,
    includeNewsletters: true,
  });

  return {
    props: {
      post,
      series: series ?? null,
      relatedContent,
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

const PostPage: NextPage<PostPageProps> = ({ post, series, relatedContent }) => {
  const { frontmatter } = post;

  const { coverImagePublicId, published, date, tags, title, excerpt, slug } =
    frontmatter;

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
      <div className="mx-auto w-full px-4 md:px-0" onMouseEnter={handlePostReadStarted}>
        <SEO
          canonical={router.asPath}
          title={title}
          description={excerpt}
          image={coverImageUrl}
          ogType="article"
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
