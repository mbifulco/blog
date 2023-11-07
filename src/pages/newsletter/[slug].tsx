import { useRouter } from 'next/router';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Text,
  useColorMode,
  useTheme,
} from '@chakra-ui/react';

import { getNewsletterBySlug, getAllNewsletters } from '../../lib/newsletters';

import { Colophon } from '../../components/Colophon';
import { NewsletterSignup } from '../../components/NewsletterSignup';
import { BlogPost as Post } from '../../components/Post';
import SEO from '../../components/seo';
import WebmentionMetadata from '../../components/webmentionMetadata';

import { getCloudinaryImageUrl } from '../../utils/images';
import { serialize } from '../../utils/mdx';

import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa';

export async function getStaticProps({ params }) {
  const newsletter = await getNewsletterBySlug(params.slug);

  const mdxSource = await serialize(newsletter.content);

  return {
    props: {
      ...newsletter,
      source: mdxSource,
    },
  };
}

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

const NewsletterPage = (post) => {
  const { frontmatter } = post;

  const { coverImagePublicId, date, tags, title, excerpt, path } = frontmatter;

  const router = useRouter();
  const theme = useTheme();
  const { colorMode } = useColorMode();

  const postImagePublicId = coverImagePublicId || `posts/${path}/cover`;
  const coverImageUrl = getCloudinaryImageUrl(postImagePublicId);

  const dateColors = {
    dark: theme.colors.gray[400],
    light: '#555555',
  };

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
          <FaChevronRight
            style={{ color: theme.colors.pink[500] }}
            fontSize="smaller"
          />
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

      <Post post={post} />
      <Text fontSize={'1.35rem'} style={{ marginTop: '0' }}>
        Thanks for reading Tiny Improvements. If you found this helpful,{' '}
        {"I'd "}
        love it if you shared this with a friend. It helps me out a great deal.
      </Text>
      <Text fontSize={'1.35rem'}>
        Until next time - be excellent to each other!
      </Text>
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

export default NewsletterPage;
