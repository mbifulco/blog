import React from 'react';
import { useRouter } from 'next/router';

import { Flex } from '@chakra-ui/react';

import { DefaultLayout } from '../components/Layouts';

import SEO from '../components/seo';

import { NewsletterSignup } from '../components/NewsletterSignup';
import Post from '../components/post';
import WebmentionMetadata from '../components/webmentionMetadata';

const MdxPostTemplate = ({ post, mentions }) => {
  const { excerpt, frontmatter } = post;

  const {
    published,
    date,
    tags,
    title,
  } = frontmatter;

  const router = useRouter();
  const location = router.asPath;

  if (!published && process.env.NODE_ENV === 'production') return null;

  return (
    <DefaultLayout>
      {/* TODO image url to SEO */}
      <SEO
        canonical={router.asPath}
        title={title}
        description={excerpt}
        // image={getImageUrl(featureImage.path)}
        ogType="article"
      />
      {/* TODO cover image url in webmentions */}
      <WebmentionMetadata
        // coverImageUrl={coverImageUrl}
        summary={excerpt}
        publishedAt={date}
      />
      {!published && process.env.NODE_ENV !== 'production' && (
        <div>
          <em>Note:</em> this is a draft post
        </div>
      )}

      <Post post={post} mentions={mentions?.nodes} />
      <Flex direction="row" justifyContent="center" marginTop="3rem">
        <NewsletterSignup tags={tags} />
      </Flex>
    </DefaultLayout>
  );
};

export default MdxPostTemplate;


