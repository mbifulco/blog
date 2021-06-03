// Install remark and remark-html
import remark from 'remark';
import html from 'remark-html';
import { getPostBySlug, getAllPosts } from '../../lib/blog';
import markdownToHtml from '../../lib/markdown';
import MdxPostTemplate from '../../templates/MdxPost';

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug);
  const content = await markdownToHtml(post.content || '');

  return {
    props: {
      ...post,
      content,
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
