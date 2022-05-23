import React from 'react';
import PropTypes from 'prop-types';

import pluralize from 'pluralize';

import {
  Avatar,
  AvatarGroup,
  Flex,
  Heading,
  Stack,
  Text,
  useTheme,
} from '@chakra-ui/react';

import formatDate from '../utils/format-date';

import * as classes from '../styles/mentions.module.scss';

const MentionsSummary = ({ mentions }) => {
  const theme = useTheme();

  if (!mentions || mentions.length === 0) return null;

  const likes = mentions.filter((mention) => mention.activity.type === 'like');
  const someoneMentioned = mentions.filter(
    (mention) => mention.activity.type !== 'like'
  );

  const avatarSize = '48px';

  return (
    <>
      {likes.length > 0 && (
        <Stack direction="row" alignItems="center" marginTop="1rem">
          <AvatarGroup max={4} flexWrap="wrap">
            {likes.map((like) => {
              const { author } = like.data;
              if (!author) return null;
              return (
                <Avatar
                  key={`like-author-${author.name}`}
                  height={avatarSize}
                  width={avatarSize}
                  alt={author.name}
                  src={author.photo}
                />
              );
            })}
          </AvatarGroup>
          <span>
            <span role="img" aria-label="likes">
              ❤️
            </span>
            {` ${likes.length} ${pluralize('like', likes.length)}`}
          </span>
        </Stack>
      )}
      {someoneMentioned.length > 0 && (
        <div>
          <Heading as="h3">Mentions</Heading>
          {someoneMentioned.map((mention, idx) => {
            const { author, published: publishedDate, url } = mention.data;

            const formattedPublishDtate = formatDate(new Date(publishedDate));

            if (!author) return null;

            return (
              <div
                className={classes.mention}
                key={`someone-mentioned-author-${idx}-${author.name}`}
              >
                <Flex direction="row">
                  <a href={author?.url}>
                    <Avatar
                      alt={author.name}
                      src={author.photo}
                      key={`mentioned-by-author-${author?.name}`}
                      marginRight="0.5rem"
                      height={avatarSize}
                      width={avatarSize}
                    />
                  </a>
                  <Stack>
                    <span style={{ width: '100%' }}>
                      <a href={author?.url}>
                        <Text
                          color={theme.colors.pink[600]}
                          as="span"
                          fontWeight="bold"
                          _hover={{ textDecoration: 'underline' }}
                        >
                          {author.name}
                        </Text>
                      </a>{' '}
                      <a href={url}>
                        <Text
                          as="span"
                          fontSize="smaller"
                          color={theme.colors.gray[600]}
                          _hover={{ textDecoration: 'underline' }}
                        >
                          {formattedPublishDtate}
                        </Text>
                      </a>
                    </span>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: mention.data.content,
                      }}
                    />
                  </Stack>
                </Flex>
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
