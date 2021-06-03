// Install remark and remark-html
import remark from 'remark';
import html from 'remark-html';
import { getPostBySlug, getAllPosts } from '../lib/blog';
import MdxPostTemplate from '../templates/MdxPost';

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug);
  const markdown = await remark()
    .use(html)
    .process(post.content || '');
  const content = markdown.toString();

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


const PageTemplate = post => <div>wobble</div>

export default PageTemplate