import React from 'react';
import PropTypes from 'prop-types';

import pluralize from 'pluralize';

import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';

import * as classes from '../styles/mentions.module.scss';

const MentionsSummary = ({ mentions }) => {
  if (!mentions || mentions.length === 0) return null;

  const likes = mentions.filter((mention) => mention.activity.type === 'like');
  const someoneMentioned = mentions.filter((mention) => mention.activity.type !== 'like');

  return (
    <>
      {likes.length > 0 && (
        <div className={classes.likesHeader}>
          <AvatarGroup max={15}>
            {likes.map((like) => {
              const { author } = like.data;
              return (
                <a
                  href={author.url}
                  key={`like-author-${author.name}`}
                  s
                  className={classes.avatarLink}
                >
                  <Avatar alt={author.name} src={author.photo} />
                </a>
              );
            })}
          </AvatarGroup>
          <span role="img" aria-label="likes">
            ❤️
          </span>
          {` ${likes.length} ${pluralize('like', likes.length)}`}
        </div>
      )}
      {someoneMentioned.length > 0 && (
        <div>
          <h3 className={classes.title}>Mentions</h3>
          {someoneMentioned.map((mention,idx ) => {
            const { author } = mention.data;
            return (
              <div
                className={classes.mention}
                key={`someone-mentioned-author-${idx}-${author.name}`}
              >
                <a
                  href={author.url}
                  className={`${classes.authorContainer} ${classes.avatarLink}`}
                >
                  <Avatar
                    alt={author.name}
                    src={author.photo}
                    key={`mentioned-by-author-${author.name}`}
                  />
                  <span>{author.name}</span>
                </a>
                <span>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: mention.data.content,
                    }}
                  />
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
      )}
    </>
  );
};

MentionsSummary.propTypes = {
  mentions: PropTypes.arrayOf(PropTypes.shape({})),
};

export default MentionsSummary;
