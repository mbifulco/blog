import type { GetStaticPaths, GetStaticProps } from 'next';

import { getPostBySlug } from '@lib/blog';
import { getNewsletterBySlug } from '@lib/newsletters';
import { ExternalWorkItem } from '../../components/ExternalWork';
import { Heading } from '../../components/Heading';
import NewsletterItem from '../../components/NewsletterFeed/NewsletterItem';
import { BlogPost as Post } from '../../components/Post';
import SEO from '../../components/seo';
import type { Article, BlogPost, Newsletter } from '../../data/content-types';
import { getExternalReferenceBySlug as getArticleBySlug } from '../../lib/external-references';
import { getAllTags, getContentForTag } from '../../lib/tags';

type TagPageParams = {
  tag: string;
};

type TagPageProps = {
  tag: string;
  posts: BlogPost[];
  articles: Article[];
  newsletters: Newsletter[];
};

export const getStaticProps: GetStaticProps<
  TagPageProps,
  TagPageParams
> = async ({ params }) => {
  if (!params) {
    throw new Error('No params provided');
  }

  const { tag } = params;

  try {
    const content = await getContentForTag(tag);

    const [posts, articles, newsletters] = await Promise.all([
      Promise.all(content.post.map((slug) => getPostBySlug(slug))),
      Promise.all(content.article.map((slug) => getArticleBySlug(slug))),
      Promise.all(content.newsletter.map((slug) => getNewsletterBySlug(slug))),
    ]);

    return {
      props: {
        tag,
        posts,
        articles,
        newsletters,
      },
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        tag,
        posts: [],
        articles: [],
        newsletters: [],
      },
    };
  }
};

export const getStaticPaths: GetStaticPaths<TagPageParams> = async () => {
  const allTags = await getAllTags();

  return {
    paths: allTags.map((tag) => ({
      params: {
        tag,
      },
    })),
    fallback: false,
  };
};

const TagPage: React.FC<TagPageProps> = ({
  tag,
  posts,
  articles,
  newsletters,
}) => {
  const all = [...posts, ...articles, ...newsletters].sort((a, b) => {
    return (
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
    );
  });

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <SEO
        title={`#${tag}: ${all.length} posts, articles, and videos`}
        description={`Posts, articles, and videos tagged with ${tag} for designers and developers building great things on the web.`}
      />
      <Heading as="h1">
        <span className="text-gray-400">#</span>
        <span>{tag}</span>
        <span>: {all.length} posts tagged</span>
      </Heading>
      <div className="flex flex-col gap-8">
        {all.map((content) => {
          switch (content.frontmatter.type) {
            case 'newsletter': {
              return (
                <NewsletterItem
                  key={`newsletter-${content.frontmatter.slug as string}`}
                  newsletter={content as Newsletter}
                />
              );
            }
            case 'post':
              return (
                <Post
                  post={content as BlogPost}
                  key={`post-${content.frontmatter.slug as string}`}
                  summary
                />
              );
            case 'article':
              return (
                <ExternalWorkItem
                  article={content as Article}
                  key={`article-${content.frontmatter.title}`}
                />
              );
            default:
              break;
          }
        })}
      </div>
    </div>
  );
};

export default TagPage;
