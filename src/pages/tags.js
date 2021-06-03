import React from 'react';
import PropTypes from 'prop-types';

// Utilities
import { kebabCase } from 'lodash';

// Components
import { Helmet } from 'react-helmet';
import { Link, graphql } from 'gatsby';

import Tag from '../components/tag';
import { DefaultLayout as Layout } from '../components/Layouts';

import * as classes from '../styles/post.module.scss';
import * as tagsClasses from '../styles/tagsPage.module.scss';

const TagsPage = ({ data }) => {
  const { takeshape } = data;
  const { siteMetadata, tags } = takeshape;

  return (
    <Layout>
      <Helmet title={siteMetadata.siteTitle} />
      <div className={classes.post}>
        <div className={classes.postContent}>
          <h1>Tags</h1>
          <ul className={tagsClasses.list}>
            {tags.items.map((tag) => (
                <li key={`tag-${tag._id}`}>
                  <Link href={`/tags/${kebabCase(tag.name)}/`}>
                    <Tag>
                      {tag.name} ({tag.posts.total})
                    </Tag>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

TagsPage.propTypes = {
  data: PropTypes.shape({
    takeshape: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        siteTitle: PropTypes.string.isRequired,
      }),
      tags: PropTypes.shape({
        items: PropTypes.shape({
          map: PropTypes.func,
        }),
      }),
    }),
  }),
};

export default TagsPage;

export const pageQuery = graphql`
  query {
    takeshape {
      tags: getTagList {
        items {
          _id
          name
          posts: postSet {
            total
          }
        }
      }
      siteMetadata: getSiteSettings {
        siteTitle
      }
    }
  }
`;
