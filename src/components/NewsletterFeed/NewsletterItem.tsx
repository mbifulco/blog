import Link from 'next/link';

import TagsSummary from '../tagsSummary';
import formatDate from '../../utils/format-date';
import { getCloudinaryImageUrl } from '../../utils/images';

type NewsletterMetadata = {
  coverImagePublicId: string;
  date: string | number | Date;
  excerpt: string;
  slug: string;
  tags: string[];
  title: string;
};

type Newsletter = {
  frontmatter: NewsletterMetadata;
};

type NewsletterItemProps = {
  newsletter: Newsletter;
  compact?: boolean;
};

const NewsletterItem: React.FC<NewsletterItemProps> = ({
  newsletter,
  compact = false,
}) => {
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
        {!compact && (
          <p className="uppercase text-sm text-gray-500">{formatDate(date)}</p>
        )}
        <p className="text-gray-600 line-clamp-3 overflow-ellipsis overflow-y-hidden">
          {excerpt}
        </p>
      </div>
      {!compact && (
        <div className="mt-6 flex flex-col gap-4 self-center">
          <div className="flex flex-row text-sm">
            <TagsSummary tags={tags} />
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsletterItem;
