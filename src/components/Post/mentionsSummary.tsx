import pluralize from 'pluralize';
import { Avatar, AvatarGroup } from '@chakra-ui/react';

import formatDate from '../../utils/format-date';
import type { WebMention } from '../../utils/webmentions';

type MentionsSummaryProps = {
  mentions?: WebMention[];
};
const MentionsSummary: React.FC<MentionsSummaryProps> = ({ mentions }) => {
  if (!mentions || mentions.length === 0) return null;

  const likes = mentions.filter((mention) => mention.activity.type === 'like');
  const someoneMentioned = mentions.filter((mention) => {
    if (mention.activity.type === 'like') return false;
    if (
      mention?.data?.author?.url === 'https://reddit.com/user/irreverentmike/'
    )
      return false;
    if (mention?.data?.author?.url === 'https://hachyderm.io/@irreverentmike')
      return false;
    if (mention?.data?.author?.url === 'https://twitter.com/irreverentmike')
      return false;
    return true;
  });

  const avatarSize = '48px';

  return (
    <>
      {likes.length > 0 && (
        <div className="flex flex-row mt-4 items-center">
          <AvatarGroup max={4} flexWrap="wrap">
            {likes.map((like) => {
              const { author } = like.data;
              if (!author) return null;
              return (
                <Avatar
                  key={`like-author-${author.name}`}
                  height={avatarSize}
                  width={avatarSize}
                  name={author?.name || 'Unknown author'}
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
        </div>
      )}
      {someoneMentioned.length > 0 && (
        <div>
          <h3 className="font-bold text-xl">Mentions</h3>
          {someoneMentioned.map((mention, idx) => {
            const { author, published: publishedDate, url } = mention.data;

            const formattedPublishDtate = formatDate(new Date(publishedDate));

            if (!author) return null;

            return (
              <div
                className="bg-white/40 p-3 mb-3 flex flex-row gap-3"
                key={`someone-mentioned-author-${idx}-${author.name}`}
              >
                <a href={author?.url}>
                  <Avatar
                    name={author.name}
                    src={author.photo}
                    key={`mentioned-by-author-${author?.name}`}
                    marginRight="0.5rem"
                    height={avatarSize}
                    width={avatarSize}
                  />
                </a>
                <div className="flex flex-col gap-4">
                  <span style={{ width: '100%' }}>
                    <a
                      className="text-pink-600 font-bold hover:underline"
                      href={author?.url}
                    >
                      {author.name}
                    </a>{' '}
                    <a
                      href={url}
                      className="text-sm text-gray-600 hover:underline"
                    >
                      {formattedPublishDtate}
                    </a>
                  </span>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: mention.data.content,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default MentionsSummary;
