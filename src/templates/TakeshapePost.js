import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { getImageUrl } from 'takeshape-routing';

import SEO from '../components/seo';
import { DefaultLayout as Layout } from '../components/Layouts';
import { NewsletterSignup } from '../components/NewsletterSignup';
import Post from '../components/post';
import WebmentionMetadata from '../components/webmentionMetadata';

const TakeShapePostTemplate = ({ data, /* pageContext, */ location }) => {
  const {
    author,
    canonical,
    featureImage,
    title,
    excerpt,
    id,
    summary,
    tags,
    _enabledAt: publishedAt,
  } = data.takeshape.post;
  const { mentions } = data;
  // const { next, previous } = pageContext;

  const coverImageUrl = featureImage && getImageUrl(featureImage.path);

  return (
    <Layout>
      <SEO
        canonical={canonical}
        title={title}
        description={excerpt}
        image={getImageUrl(featureImage.path)}
        ogType="article"
        location={location}
      />
      <WebmentionMetadata
        location={location}
        coverImageUrl={coverImageUrl}
        summary={summary}
        author={author}
        publishedAt={publishedAt}
      />
      <Post
        key={id}
        post={data.takeshape.post}
        mentions={mentions && mentions.nodes}
      />
      <NewsletterSignup tags={tags} />
    </Layout>
  );
};

export default TakeShapePostTemplate;

TakeShapePostTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.shape({
    next: PropTypes.object,
    previous: PropTypes.object,
  }),
  location: PropTypes.shape({
    href: PropTypes.string,
  }),
};

export const pageQuery = graphql`
  query($id: ID!, $permalink: String!) {
    takeshape {
      post: getPost(_id: $id) {
        canonical
        tags {
          name
        }
        featureImage {
          path
          description
        }
        title
        path
        excerpt
        body
        bodyHtml
        _createdAt
        _updatedAt
        _enabled
        _enabledAt
        searchSummary
      }
    }
    mentions: allWebMentionEntry(filter: { wmTarget: { eq: $permalink } }) {
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
  }
`;
