import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import { Flex } from '@chakra-ui/react';

import { DefaultLayout } from '../components/Layouts';

import SEO from '../components/seo';

import { NewsletterSignup } from '../components/NewsletterSignup';
import Post from '../components/post';
import WebmentionMetadata from '../components/webmentionMetadata';

const MdxPostTemplate = ({ post, mentions, pageContext, location }) => {
  const { excerpt, frontmatter } = post;

  const {
    published,
    date,
    tags,
    title,
  } = frontmatter;

  const router = useRouter();

  if (!published && process.env.NODE_ENV === 'production') return null;

  return (
    <DefaultLayout>
      <SEO
        canonical={router.asPath}
        title={title}
        description={excerpt}
        // image={getImageUrl(featureImage.path)}
        ogType="article"
        location={location}
      />
      <WebmentionMetadata
        location={location}
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

MdxPostTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.shape({
    id: PropTypes.string,
  }),
  location: PropTypes.shape({
    href: PropTypes.string,
  }),
};

