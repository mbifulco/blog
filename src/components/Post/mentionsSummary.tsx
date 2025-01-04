import { useRouter } from 'next/router';
import { useWebMentions } from '@hooks/useWebMentions';
import pluralize from 'pluralize';

import formatDate from '@utils/format-date';
import type { WebMention } from '@utils/webmentions';
import { Avatar, AvatarGroup } from '../Avatar';

type MentionsSummaryProps = {
  mentions?: WebMention[];
};

const mySocialHandleUrls = [
  'https://twitter.com/irreverentmike',
  'https://reddit.com/user/irreverentmike/',
  'https://hachyderm.io/@irreverentmike',
  'https://threads.net/@irreverentmike',
  'https://bsky.app/profile/mikebifulco.com',
];

const MentionsSummary: React.FC<MentionsSummaryProps> = () => {
  const router = useRouter();
  const { data: mentions } = useWebMentions(router.asPath);

  if (!mentions || mentions.length === 0) return null;

  const likes = mentions.filter((mention) => mention.activity.type === 'like');
  const someoneMentioned = mentions.filter((mention) => {
    // likes don't indicate a mention
    if (mention.activity.type === 'like') return false;

    // make sure this isn't a mention from me
    if (mySocialHandleUrls.includes(mention?.data?.author?.url)) return false;
    return true;
  });

  return (
    <>
      {likes.length > 0 && (
        <div className="mt-4 flex flex-row items-center gap-2">
          <AvatarGroup
            people={likes.map((like) => {
              const { author } = like.data;
              return {
                name: author?.name || 'Unknown author',
                src: author?.photo,
                size: 48,
              };
            })}
            variant="sm"
          />

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
          <h3 className="text-xl font-bold">Mentions</h3>
          {someoneMentioned.map((mention, idx) => {
            const { author, published: publishedDate, url } = mention.data;

            const formattedPublishDtate = formatDate(new Date(publishedDate));

            if (!author) return null;

            return (
              <div
                className="mb-3 flex flex-row gap-3 bg-white/40 p-3"
                key={`someone-mentioned-author-${idx}-${author.name}`}
              >
                <a href={author?.url}>
                  <Avatar
                    name={author.name}
                    src={author?.photo}
                    key={`mentioned-by-author-${author?.name}`}
                    variant="xl"
                  />
                </a>
                <div className="flex flex-col gap-4">
                  <span style={{ width: '100%' }}>
                    <a
                      className="font-bold text-pink-600 hover:underline"
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
