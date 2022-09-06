import React from 'react';
import { serialize } from 'next-mdx-remote/serialize';

import { useRouter } from 'next/router';
import { Flex } from '@chakra-ui/react';

import { getNewsletterBySlug, getAllNewsletters } from '../../lib/newsletters';

import { DefaultLayout } from '../../components/Layouts';
import {
  Colophon,
  NewsletterSignup,
  Post,
  SEO,
  WebmentionMetadata,
} from '../../components';
import { getCloudinaryImageUrl } from '../../utils/images';
import mdxOptions from '../../utils/mdxOptions';

export async function getStaticProps({ params }) {
  const newsletter = await getNewsletterBySlug(params.slug);

  const mdxSource = await serialize(newsletter.content, mdxOptions);

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

  const postImagePublicId = coverImagePublicId || `posts/${path}/cover`;
  const coverImageUrl = getCloudinaryImageUrl(postImagePublicId);

  return (
    <DefaultLayout>
      {/* TODO image url to SEO */}
      <SEO
        canonical={router.asPath}
        title={`Newsletter: ${title} - Tiny Improvements`}
        description={excerpt}
        image={coverImageUrl}
        ogType="article"
      />

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
    </DefaultLayout>
  );
};

export default NewsletterPage;
