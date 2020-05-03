import React from 'react';
import PropTypes from 'prop-types';
import { OutboundLink } from 'gatsby-plugin-google-analytics';

import classes from '../styles/mentions.module.css';

const MentionsSummary = ({ mentions }) => {
  if (!mentions || mentions.length === 0) return null;
  return (
    <>
      <h4 className={classes.title}>
        <span role="img" aria-label="Hooray">
          🎉
        </span>
        {'  '}
        Mentions of this post online
      </h4>
      <div className={classes.mentionsContainer}>
        {mentions.map((mention) => {
          const { author } = mention;
          return (
            <div className={classes.mention} key={mention.wmId}>
              <OutboundLink
                href={author.url}
                className={classes.authorContainer}
              >
                <img
                  className={classes.authorImage}
                  alt={author.name}
                  src={author.photo}
                  key={author.wmId}
                />
                <span>{author.name}</span>
              </OutboundLink>
              <p>
                {mention.content && mention.content.text}
                <small>
                  {`  (`}
                  <OutboundLink
                    className={classes.mentionLink}
                    href={mention.url}
                  >
                    <span role="img" aria-label="link icon">
                      🔗
                    </span>{' '}
                    Link
                  </OutboundLink>
                  )
                </small>
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
};

MentionsSummary.propTypes = {
  mentions: PropTypes.arrayOf(PropTypes.shape({})),
};

export default MentionsSummary;
