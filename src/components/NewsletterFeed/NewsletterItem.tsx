import Link from 'next/link';

import type { NewsletterItemProps } from '../../data/content-types';
import formatDate from '../../utils/format-date';
import { getCloudinaryImageUrl } from '../../utils/images';
import { Heading } from '../Heading';
import TagsSummary from '../tagsSummary';

const NewsletterItem: React.FC<NewsletterItemProps> = ({ newsletter }) => {
  if (!newsletter) return null;
  const { coverImagePublicId, date, excerpt, slug, tags, title } =
    newsletter.frontmatter;

  return (
    <div className="w-full overflow-hidden bg-white">
      <Link
        href={`/newsletter/${slug}`}
        className="m-0 block aspect-1200/630 max-w-full"
      >
        <div
          className="aspect-1200/630 h-full min-h-[205px] bg-cover"
          style={{
            backgroundImage: `url('${getCloudinaryImageUrl(
              coverImagePublicId
            )}')`,
          }}
        />
      </Link>
      <div className="mt-4 flex flex-col">
        <Heading as="h3" className="text-xl text-pink-600">
          <Link href={`/newsletter/${slug}`}>{title}</Link>
        </Heading>
        <p className="hidden text-sm text-gray-500 uppercase lg:visible">
          {formatDate(date)}
        </p>
        <p className="line-clamp-3 overflow-y-hidden text-ellipsis text-gray-600">
          {excerpt}
        </p>
      </div>
      <div className="mt-6 hidden flex-col gap-4 self-center lg:flex">
        <div className="flex flex-row text-sm">
          <TagsSummary tags={tags} />
        </div>
      </div>
    </div>
  );
};

export default NewsletterItem;
