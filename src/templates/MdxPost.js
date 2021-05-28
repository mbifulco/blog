import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';

import { Flex } from '@chakra-ui/react';

import { useImage } from 'use-cloudinary';

import { DefaultLayout } from '../components/Layouts';

import SEO from '../components/seo';

import { NewsletterSignup } from '../components/NewsletterSignup';
import Post from '../components/post';
import WebmentionMetadata from '../components/webmentionMetadata';

const MdxPostTemplate = ({ data, pageContext, location }) => {
  const { body, excerpt, frontmatter } = data.post;

  const {
    published,
    date,
    path,
    tags,
    title,
    coverImagePublicId,
  } = frontmatter;
  const { mentions } = data;

  const { generateImageUrl } = useImage(
    process.env.GATSBY_CLOUDINARY_CLOUD_NAME
  );

  const cloudinaryConfig = {
    delivery: {
      publicId: coverImagePublicId,
    },
  };

  const coverImageUrl = generateImageUrl(cloudinaryConfig);

  if (!published && process.env.NODE_ENV === 'production') return null;

  return (
    <DefaultLayout>
      <SEO
        canonical={location.href}
        title={title}
        description={excerpt}
        image={coverImageUrl}
        ogType="article"
        location={location}
      />
      <WebmentionMetadata
        location={location}
        coverImageUrl={coverImageUrl}
        summary={excerpt}
        publishedAt={date}
      />
      {!published && process.env.NODE_ENV !== 'production' && (
        <div>
          <em>Note:</em> this is a draft post
        </div>
      )}
      <Post
        key={pageContext.id}
        post={{
          coverImagePublicId,
          date,
          tags,
          title,
          path,
          bodyMdx: body,
          excerpt,
        }}
        mentions={mentions && mentions.nodes}
      />
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

export const pageQuery = graphql`
  query($path: String!, $id: String!) {
    mentions: allWebMentionEntry(filter: { wmTarget: { eq: $path } }) {
      nodes {
        wmTarget
        wmSource
        wmProperty
        wmId
        type
        url
        likeOf
        author {
          url
          type
          photo
          name
        }
        content {
          text
        }
      }
    }
    post: mdx(id: { eq: $id }) {
      body
      excerpt
      frontmatter {
        coverImagePublicId
        date
        path
        published
        tags
        title
        type
      }
    }
  }
`;
