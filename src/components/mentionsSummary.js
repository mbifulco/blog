import React from 'react';
import PropTypes from 'prop-types';

import pluralize from 'pluralize';

import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';

import * as classes from '../styles/mentions.module.scss';

const MentionsSummary = ({ mentions }) => {
  if (!mentions || mentions.length === 0) return null;

  const likes = mentions.filter((mention) => mention.wmProperty === 'like-of');
  const likeAuthors = likes.map(
    (mention) => mention.author && { wmId: mention.wmId, ...mention.author }
  );

  return (
    <>
      {likes.length > 0 && (
          <div className={classes.likesHeader}>
            <AvatarGroup max={15}>
              {likeAuthors.map((author) => (
                <a
                  href={author.url}
                  key={author.wmId}
                  className={classes.avatarLink}
                >
                  <Avatar alt={author.name} src={author.photo} />
                </a>
              ))}
            </AvatarGroup>
            <span role="img" aria-label="likes">
              ❤️
            </span>
            {` ${likes.length} ${pluralize('like', likes.length)}`}
          </div>
      )}
      <div>
        <h3 className={classes.title}>Mentions</h3>
        {mentions
          .filter((mention) => mention.wmProperty !== 'like-of')
          .map((mention) => {
            const { author } = mention;
            return (
              <div className={classes.mention} key={mention.wmId}>
                <a
                  href={author.url}
                  className={`${classes.authorContainer} ${classes.avatarLink}`}
                >
                  <Avatar
                    alt={author.name}
                    src={author.photo}
                    key={author.wmId}
                  />
                  <span>{author.name}</span>
                </a>
                <span>
                  {mention.content && mention.content.text}
                  <small>
                    {`  (`}
                    <a className={classes.mentionLink} href={mention.url}>
                      Link
                    </a>
                    )
                  </small>
                </span>
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
