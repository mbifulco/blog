import { mdx } from '@mdx-js/react';
import { serialize } from 'next-mdx-remote/serialize';

import { getPostBySlug, getAllPosts } from '../../lib/blog';
import markdownToHtml from '../../lib/markdown';
import MdxPostTemplate from '../../templates/MdxPost';

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug);

  const mdxSource = await serialize(post.content);

  return {
    props: {
      ...post,
      source: mdxSource,
    },
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts();

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}

const BlogPost = (post) => <MdxPostTemplate post={post} />;

export default BlogPost;