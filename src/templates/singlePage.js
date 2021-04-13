import React from 'react';
import PropTypes from 'prop-types';

import { Flex, Heading, useTheme, useColorMode } from '@chakra-ui/react';

import SEO from '../components/seo';
import { DefaultLayout as Layout } from '../components/Layouts';
import MentionsSummary from '../components/mentionsSummary';
import { NewsletterSignup } from '../components/NewsletterSignup';
import TagsSummary from '../components/tagsSummary';
import WebmentionMetadata from '../components/webmentionMetadata';

import * as style from '../styles/post.module.css';

const SinglePage = ({ children, pageContext, location }) => {
  const { mentions } = pageContext;
  const {
    author,
    coverImageUrl,
    excerpt,
    publishedAt,
    title,
    tags,
  } = pageContext.frontmatter;

  const theme = useTheme();
  const { colorMode } = useColorMode();

  const headerColors = {
    dark: theme.colors.gray[200],
    light: theme.colors.gray[900],
  };

  return (
    <Layout>
      <SEO
        canonical={location.href}
        title={title}
        description={excerpt}
        image={coverImageUrl && coverImageUrl}
        ogType="article"
        location={location}
      />

      <div className={style.post}>
        <div className={style.postContent}>
          <Heading as="h1" color={headerColors[colorMode]}>
            {title}
          </Heading>
          <TagsSummary tags={tags} />
          <WebmentionMetadata
            location={location}
            coverImageUrl={coverImageUrl}
            summary={excerpt && excerpt}
            author={author && author}
            publishedAt={publishedAt && publishedAt}
          />
          {children}
          <MentionsSummary mentions={mentions} />
        </div>
      </div>
      <Flex direction="row" justifyContent="center">
        <NewsletterSignup tags={tags} />
      </Flex>
    </Layout>
  );
};

SinglePage.propTypes = {
  children: PropTypes.node,
  pageContext: PropTypes.shape({
    frontmatter: PropTypes.shape({
      author: PropTypes.string,
      coverImageUrl: PropTypes.string,
      excerpt: PropTypes.string,
      publishedAt: PropTypes.string,
      title: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string),
    }),
    mentions: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  location: PropTypes.shape({
    href: PropTypes.string,
  }),
};

export default SinglePage;
