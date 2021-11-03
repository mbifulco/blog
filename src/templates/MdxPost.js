import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import { Flex } from '@chakra-ui/react';

import { DefaultLayout } from '../components/Layouts';

import SEO from '../components/seo';

import { NewsletterSignup } from '../components/NewsletterSignup';
import Post from '../components/post';
import WebmentionMetadata from '../components/webmentionMetadata';

import frontmatterType from '../types/frontmatter';

const MdxPostTemplate = ({ post, mentions }) => {
  const { frontmatter } = post;

  const { published, date, tags, title, excerpt } = frontmatter;

  const router = useRouter();

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

MdxPostTemplate.propTypes = {
  mentions: PropTypes.shape({
    nodes: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  post: PropTypes.shape({
    excerpt: PropTypes.string,
    frontmatter: frontmatterType,
  }),
};

export default MdxPostTemplate;
