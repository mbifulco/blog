import React from 'react';
import { serialize } from 'next-mdx-remote/serialize';

import { useRouter } from 'next/router';
import { Flex } from '@chakra-ui/react';

import { getPostBySlug, getAllPosts } from '../../lib/blog';

import Colophon from '../../components/Colophon';
import NewsletterSignup from '../../components/NewsletterSignup';
import Post from '../../components/Post';
import SEO from '../../components/SEO';
import WebmentionMetadata from '../../components/WebmentionMetadata';

import { getCloudinaryImageUrl } from '../../utils/images';
import mdxOptions from '../../utils/mdxOptions';

export async function getStaticProps({ params }) {
  const post = await getPostBySlug(params.slug);

  const mdxSource = await serialize(post.content, mdxOptions);

  return {
    props: {
      ...post,
      source: mdxSource,
    },
  };
}

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

const BlogPost = (post) => {
  const { frontmatter } = post;

  const { coverImagePublicId, published, date, tags, title, excerpt, path } =
    frontmatter;

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
