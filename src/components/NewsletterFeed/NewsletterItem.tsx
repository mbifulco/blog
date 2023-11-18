import Link from 'next/link';

import TagsSummary from '../tagsSummary';
import formatDate from '../../utils/format-date';
import { getCloudinaryImageUrl } from '../../utils/images';
import type { NewsletterItemProps } from '../../data/content-types';

const NewsletterItem: React.FC<NewsletterItemProps> = ({ newsletter }) => {
  const { coverImagePublicId, date, excerpt, slug, tags, title } =
    newsletter.frontmatter;

  return (
    <div className="w-full bg-white overflow-hidden">
      <Link
        href={`/newsletter/${slug}`}
        className="block aspect-[1200/630] m-0"
      >
        <div
          className="min-h-[205px] h-full bg-cover aspect-[1200/630]"
          style={{
            backgroundImage: `url('${getCloudinaryImageUrl(
              coverImagePublicId
            )}')`,
          }}
        />
      </Link>
      <div className="mt-4 flex flex-col">
        <h3 className="text-pink-600 text-xl font-sans font-bold">
          <Link href={`/newsletter/${slug}`}>{title}</Link>
        </h3>
        <p className="uppercase text-sm text-gray-500 hidden lg:visible">
          {formatDate(date)}
        </p>
        <p className="text-gray-600 line-clamp-3 overflow-ellipsis overflow-y-hidden">
          {excerpt}
        </p>
      </div>
      <div className="mt-6 flex-col gap-4 self-center hidden lg:flex">
        <div className="flex flex-row text-sm">
          <TagsSummary tags={tags} />
        </div>
      </div>
    </div>
  );
};

export default NewsletterItem;
