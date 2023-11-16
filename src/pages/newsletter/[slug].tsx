import type { GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';

import { getNewsletterBySlug, getAllNewsletters } from '../../lib/newsletters';

import { Colophon } from '../../components/Colophon';
import { NewsletterSignup } from '../../components/NewsletterSignup';
import SEO from '../../components/seo';
import WebmentionMetadata from '../../components/webmentionMetadata';

import { getCloudinaryImageUrl } from '../../utils/images';
import { serialize } from '../../utils/mdx';

import { FaChevronRight } from 'react-icons/fa';
import type { Newsletter } from '../../data/content-types';
import FullPost from '../../components/Post/FullPost';

type NewsletterPageParams = {
  slug: string;
};

export const getStaticProps: GetStaticProps<
  NewsletterPageProps,
  NewsletterPageParams
> = async ({ params }) => {
  if (!params) {
    throw new Error('No params provided');
  }

  const newsletter = await getNewsletterBySlug(params.slug);

  const mdxSource = await serialize(newsletter.content);

  return {
    props: {
      newsletter: {
        ...newsletter,
        source: mdxSource,
      },
    },
  };
};

export async function getStaticPaths() {
  const newsletters = await getAllNewsletters();

  return {
    paths: newsletters.map((post) => ({
      params: {
        slug: post.slug,
      },
    })),
    fallback: false,
  };
}

type NewsletterPageProps = {
  newsletter: Newsletter;
};

const NewsletterPage: React.FC<NewsletterPageProps> = ({ newsletter }) => {
  const { frontmatter } = newsletter;

  const { coverImagePublicId, date, tags, title, excerpt, path } = frontmatter;

  const router = useRouter();

  const postImagePublicId = coverImagePublicId || `posts/${path}/cover`;
  const coverImageUrl = getCloudinaryImageUrl(postImagePublicId);

  return (
    <>
      {/* TODO image url to SEO */}
      <SEO
        canonical={router.asPath}
        title={`${title}`}
        description={excerpt}
        image={coverImageUrl}
        ogType="article"
      />
      <Breadcrumb
        separator={
          <FaChevronRight className="text-pink-500" fontSize="smaller" />
        }
      >
        <BreadcrumbItem>
          <BreadcrumbLink href="/newsletter" as={Link}>
            💌 Tiny Improvements
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>{title}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <FullPost post={newsletter} />
      <p className="mt-0 text-xl">
        Thanks for reading Tiny Improvements. If you found this helpful,{' '}
        {"I'd "}
        love it if you shared this with a friend. It helps me out a great deal.
      </p>
      <p className="text-xl">Until next time - be excellent to each other!</p>
      <div className="flex flex-row justify-center mt-12">
        <NewsletterSignup tags={tags} />
      </div>
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

export default NewsletterPage;
