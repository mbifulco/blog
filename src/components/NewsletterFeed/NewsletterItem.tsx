import type { NewsletterItemProps } from '../../data/content-types';

import Link from '@components/Link';
import formatDate from '../../utils/format-date';
import { getCloudinaryImageUrl } from '../../utils/images';
import { Heading } from '../Heading';
import TagsSummary from '../tagsSummary';

const NewsletterItem: React.FC<NewsletterItemProps> = ({ newsletter }) => {
  if (!newsletter) return null;
  const { coverImagePublicId, date, excerpt, slug, tags, title } =
    newsletter.frontmatter;

  return (
    <div className="bg-stock-raised w-full overflow-hidden">
      <Link
        href={`/newsletter/${slug}`}
        className="aspect-1200/630 m-0 block max-w-full"
      >
        <div
          className="aspect-1200/630 m-0 w-full bg-cover bg-center p-0"
          style={{
            backgroundImage: `url('${getCloudinaryImageUrl(
              coverImagePublicId
            )}')`,
          }}
        />
      </Link>
      <div className="mt-4 flex flex-col">
        <Heading as="h3" className="text-riso-pink text-xl">
          <Link href={`/newsletter/${slug}`}>{title}</Link>
        </Heading>
        <p className="text-ink-muted hidden text-sm uppercase lg:visible">
          {formatDate(date)}
        </p>
        <p className="text-ink-muted line-clamp-3 overflow-y-hidden text-ellipsis font-serif">
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
