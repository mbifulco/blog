import Link from '@components/Link';
import { format } from 'date-fns';
import posthog from 'posthog-js';

import { Image } from '@components/Image';
import NewsletterSignup from '@components/NewsletterSignup';
import type { UnifiedFeedItem } from '@lib/unified-feed';
import { getItemPath, getImagePublicId } from '@lib/unified-feed';

type UnifiedContentFeedProps = {
  items: UnifiedFeedItem[];
  /** "tiered" = featured + 2x2 + CTA + 3-col (home page). "grid" = uniform grid (paginated pages). */
  layout?: 'tiered' | 'grid';
};

const handleItemClick = (item: UnifiedFeedItem) => {
  posthog.capture('unified_feed_item_clicked', {
    item_slug: item.slug,
    item_title: item.title,
    item_type: item.type,
  });
};

const formatDate = (date: string | number | Date) =>
  format(new Date(date), 'MMM d, yyyy');

/** Large featured card for the most recent item */
const FeaturedCard: React.FC<{ item: UnifiedFeedItem }> = ({ item }) => {
  const path = getItemPath(item);
  return (
    <article className="group">
      <Link href={path} onClick={() => handleItemClick(item)}>
        <Image
          className="mb-4 w-full shadow-sm sm:rounded-lg"
          publicId={getImagePublicId(item)}
          alt={item.title}
          height={600}
          width={1200}
          loading="eager"
        />
      </Link>
      <h3 className="m-0 p-0 text-xl font-semibold md:text-2xl">
        <Link
          className="text-pink-600 no-underline hover:underline"
          href={path}
          onClick={() => handleItemClick(item)}
        >
          {item.title}
        </Link>
      </h3>
      <p className="mt-1 text-base text-balance text-gray-600">
        <time dateTime={new Date(item.date).toISOString()} className="font-medium font-mono text-gray-500">
          {formatDate(item.date)}
        </time>
        {item.excerpt && <> {item.excerpt}</>}
      </p>
    </article>
  );
};

/** Medium card for the 2x2 grid */
const MediumCard: React.FC<{ item: UnifiedFeedItem }> = ({ item }) => {
  const path = getItemPath(item);
  return (
    <article className="group flex flex-col">
      <Link href={path} onClick={() => handleItemClick(item)}>
        <Image
          className="mb-3 w-full shadow-sm sm:rounded-lg"
          publicId={getImagePublicId(item)}
          alt={item.title}
          height={630}
          width={1200}
          loading="lazy"
        />
      </Link>
      <h3 className="m-0 p-0 text-lg font-semibold text-balance">
        <Link
          className="text-pink-600 no-underline hover:underline"
          href={path}
          onClick={() => handleItemClick(item)}
        >
          {item.title}
        </Link>
      </h3>
      <p className="mt-1 line-clamp-2 text-sm text-gray-600">
        <time dateTime={new Date(item.date).toISOString()} className="font-semibold text-gray-500">
          {formatDate(item.date)}
        </time>
        {item.excerpt && <> {item.excerpt}</>}
      </p>
    </article>
  );
};

/** Compact card for the 3-column grid */
const CompactCard: React.FC<{ item: UnifiedFeedItem }> = ({ item }) => {
  const path = getItemPath(item);
  return (
    <article className="group flex flex-col">
      <Link href={path} onClick={() => handleItemClick(item)}>
        <Image
          className="mb-2 w-full shadow-sm sm:rounded-lg"
          publicId={getImagePublicId(item)}
          alt={item.title}
          height={630}
          width={1200}
          loading="lazy"
        />
      </Link>
      <h3 className="m-0 p-0 text-sm font-semibold text-balance">
        <Link
          className="text-pink-600 no-underline hover:underline"
          href={path}
          onClick={() => handleItemClick(item)}
        >
          {item.title}
        </Link>
      </h3>
      <p className="mt-1 line-clamp-2 text-xs text-gray-600">
        <time dateTime={new Date(item.date).toISOString()} className="font-semibold text-gray-500">
          {formatDate(item.date)}
        </time>
        {item.excerpt && <> {item.excerpt}</>}
      </p>
    </article>
  );
};

const TieredLayout: React.FC<{ items: UnifiedFeedItem[] }> = ({ items }) => {
  const featured = items[0];
  const gridItems = items.slice(1, 5);
  const remainingItems = items.slice(5);

  return (
    <div className="flex flex-col gap-12">
      {featured && <FeaturedCard item={featured} />}

      {gridItems.length > 0 && (
        <div className="grid gap-8 sm:grid-cols-2">
          {gridItems.map((item) => (
            <MediumCard key={`${item.type}-${item.slug}`} item={item} />
          ))}
        </div>
      )}

      {remainingItems.length > 0 && <NewsletterSignup />}

      {remainingItems.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {remainingItems.map((item) => (
            <CompactCard key={`${item.type}-${item.slug}`} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

const GridLayout: React.FC<{ items: UnifiedFeedItem[] }> = ({ items }) => (
  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
    {items.map((item) => (
      <MediumCard key={`${item.type}-${item.slug}`} item={item} />
    ))}
  </div>
);

const UnifiedContentFeed: React.FC<UnifiedContentFeedProps> = ({
  items,
  layout = 'tiered',
}) => {
  if (!items || items.length === 0) return null;

  return layout === 'grid' ? (
    <GridLayout items={items} />
  ) : (
    <TieredLayout items={items} />
  );
};

export default UnifiedContentFeed;
