import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';

import SEO from '../components/seo';
import Layout from '../components/layout';
import { NewsletterSignup } from '../components/NewsletterSignup';
import Post from '../components/post';
import WebmentionMetadata from '../components/webmentionMetadata';

const MdxPostTemplate = ({ data, pageContext, location }) => {
  const { body, excerpt, frontmatter } = data.post;

  const { date, path, tags, title } = frontmatter;
  const { mentions } = data;

  return (
    <Layout>
      <SEO
        canonical={location.href}
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
      <Post
        key={pageContext.id}
        post={{
          tags,
          title,
          path,
          bodyMdx: body,
          excerpt,
        }}
        mentions={mentions && mentions.nodes}
      />
      <NewsletterSignup tags={tags} />
    </Layout>
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
