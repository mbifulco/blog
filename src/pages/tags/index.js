import React from 'react';
import PropTypes from 'prop-types';

// Components
import Link from 'next/link';

import Tag from '../../components/tag';
import { DefaultLayout as Layout } from '../../components/Layouts';

import * as classes from '../../styles/post.module.scss';
import * as tagsClasses from '../../styles/tagsPage.module.scss';
import { SEO } from '../../components';

const TagsPage = ({ tags }) => (
  <Layout>
    <SEO />
    <div className={classes.post}>
      <div className={classes.postContent}>
        <h1>Tags</h1>
        <ul className={tagsClasses.list}>
          {tags?.map((tag) => (
            <li key={`tag-${tag._id}`}>
              <Link href={`/tags/${tag.name}/`}>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a>
                  <Tag>
                    {tag.name} ({tag.posts.total})
                  </Tag>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </Layout>
);

TagsPage.propTypes = {
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      items: PropTypes.shape({}),
    })
  ),
};

export default TagsPage;
