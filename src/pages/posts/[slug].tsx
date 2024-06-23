import type { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';

import { Colophon } from '../../components/Colophon';
import { NewsletterHero } from '../../components/NewsletterSignup';
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
};

export const getStaticProps: GetStaticProps<
  PostPageProps,
  PostPageParams
> = async ({ params }) => {
  if (!params) {
    throw new Error('No params provided');
  }

  const post = await getPostBySlug(params.slug);

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

const PostPage: NextPage<PostPageProps> = ({ post }) => {
  const { frontmatter } = post;

  const { coverImagePublicId, published, date, tags, title, excerpt, path } =
    frontmatter;

  const router = useRouter();

  const postImagePublicId = coverImagePublicId || `posts/${path}/cover`;
  const coverImageUrl = getCloudinaryImageUrl(postImagePublicId);

  return (
    <>
      <div className="mx-auto px-4 md:px-0 w-full">
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

        <Post post={post} />
        <WebmentionMetadata
          coverImageUrl={coverImageUrl}
          summary={excerpt}
          publishedAt={date}
          tags={tags}
          title={title}
        />
        <Colophon />
      </div>
      <NewsletterHero />
    </>
  );
};

export default PostPage;
