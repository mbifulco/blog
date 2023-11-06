import type { GetStaticProps, NextPage } from 'next';

import { useRouter } from 'next/router';
import { Flex } from '@chakra-ui/react';

import { getPostBySlug, getAllPosts } from '../../lib/blog';

import { Colophon } from '../../components/Colophon';
import { NewsletterSignup } from '../../components/NewsletterSignup';
import { BlogPost as Post } from '../../components/Post';
import SEO from '../../components/seo';
import WebmentionMetadata from '../../components/webmentionMetadata';

import { getCloudinaryImageUrl } from '../../utils/images';
import mdxOptions from '../../utils/mdxOptions';
import { BlogPost } from '../../data/content-types';

type PostPageParams = {
  slug: string;
};

type Props = {
  post: BlogPost;
};

export const getStaticProps: GetStaticProps<Props, PostPageParams> = async ({
  params,
}) => {
  const post = await getPostBySlug(params.slug!);

  return {
    props: {
      post,
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

const BlogPost: NextPage<Props> = ({ post }) => {
  const { frontmatter } = post;

  const { coverImagePublicId, published, date, tags, title, excerpt, path } =
    frontmatter;

  console.log('frontmatter is', frontmatter);

  const router = useRouter();

  const postImagePublicId = coverImagePublicId || `posts/${path}/cover`;
  const coverImageUrl = getCloudinaryImageUrl(postImagePublicId);

  return (
    <>
      {/* TODO image url to SEO */}
      <SEO
        canonical={router.asPath}
        title={title}
        description={excerpt}
        image={coverImageUrl}
        ogType="article"
      />
      {!published && process.env.NODE_ENV !== 'production' && (
        <div>
          <em>Note:</em> this is a draft post
        </div>
      )}

      <Post post={post} />
      <Flex direction="row" justifyContent="center" marginTop="3rem">
        <NewsletterSignup tags={tags} />
      </Flex>
      <Colophon />
      <WebmentionMetadata
        coverImageUrl={coverImageUrl}
        summary={excerpt}
        publishedAt={date}
        tags={tags}
        title={title}
      />
    </>
  );
};

export default BlogPost;
