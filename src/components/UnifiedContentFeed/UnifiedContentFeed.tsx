import type { UnifiedFeedItem } from '@lib/unified-feed';
import { format } from 'date-fns';
import posthog from 'posthog-js';

import { Image } from '@components/Image';
import Link from '@components/Link';
import { getImagePublicId, getItemPath } from '@lib/unified-feed';

type UnifiedContentFeedProps = {
  items: UnifiedFeedItem[];
  /** "tiered" = lead story + contents list (home page). "grid" = uniform grid (paginated pages). */
  layout?: 'tiered' | 'grid';
  /** Rendered directly below the lead story in the tiered layout. */
  leadAside?: React.ReactNode;
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

const typeLabel = (item: UnifiedFeedItem) =>
  item.type === 'newsletter' ? '💌 Tiny Improvements' : 'Article';

const ItemMeta: React.FC<{ item: UnifiedFeedItem }> = ({ item }) => (
  <p className="text-ink-muted m-0 flex flex-wrap items-baseline gap-x-2 font-futura text-sm font-bold">
    <time
      dateTime={new Date(item.date).toISOString()}
      className="font-mono text-xs"
    >
      {formatDate(item.date)}
    </time>
    <span aria-hidden>·</span>
    <span className={item.type === 'newsletter' ? 'text-riso-pink' : undefined}>
      {typeLabel(item)}
    </span>
  </p>
);

const LeadStory: React.FC<{ item: UnifiedFeedItem }> = ({ item }) => {
  const path = getItemPath(item);
  return (
    <article className="grid items-center gap-x-12 gap-y-8 md:grid-cols-[1.35fr_1fr]">
      <Link
        href={path}
        onClick={() => handleItemClick(item)}
        className="riso-plate mb-3 mr-3"
        aria-hidden
        tabIndex={-1}
      >
        <Image
          bare
          className="w-full"
          publicId={getImagePublicId(item)}
          alt=""
          height={600}
          width={1200}
          loading="eager"
          priority
          sizes="(max-width: 768px) 100vw, 640px"
        />
      </Link>
      <div className="flex flex-col gap-3">
        <h2 className="text-riso-blue m-0 text-balance font-futura text-3xl font-bold leading-[1.05] tracking-[-0.02em] lg:text-4xl">
          <Link
            href={path}
            onClick={() => handleItemClick(item)}
            className="text-riso-blue hover:text-riso-pink hover:no-underline"
          >
            {item.title}
          </Link>
        </h2>
        {item.excerpt && (
          <p className="m-0 text-pretty font-serif text-lg leading-relaxed">
            {item.excerpt}
          </p>
        )}
        <ItemMeta item={item} />
      </div>
    </article>
  );
};

const GridCard: React.FC<{ item: UnifiedFeedItem; size?: 'lg' | 'md' }> = ({
  item,
  size = 'md',
}) => {
  const path = getItemPath(item);
  const large = size === 'lg';
  return (
    <article className="group flex min-w-0 flex-col gap-2">
      <Link
        href={path}
        onClick={() => handleItemClick(item)}
        className="riso-plate mb-5 mr-3"
        aria-hidden
        tabIndex={-1}
      >
        <Image
          bare
          className="w-full"
          publicId={getImagePublicId(item)}
          alt=""
          height={630}
          width={1200}
          loading="lazy"
          sizes={
            large
              ? '(max-width: 640px) 100vw, 540px'
              : '(max-width: 640px) 100vw, 360px'
          }
        />
      </Link>
      <h3
        className={
          large
            ? 'm-0 text-balance font-futura text-2xl font-bold leading-tight tracking-[-0.01em]'
            : 'm-0 text-balance font-futura text-lg font-bold leading-tight'
        }
      >
        <Link
          href={path}
          onClick={() => handleItemClick(item)}
          className="text-riso-blue hover:text-riso-pink hover:no-underline"
        >
          {item.title}
        </Link>
      </h3>
      {item.excerpt && (
        <p
          className={
            large
              ? 'text-ink-muted m-0 line-clamp-3 text-pretty font-serif text-lg leading-snug'
              : 'text-ink-muted m-0 line-clamp-2 font-serif text-[0.95rem] leading-snug'
          }
        >
          {item.excerpt}
        </p>
      )}
      <ItemMeta item={item} />
    </article>
  );
};

const TieredLayout: React.FC<{
  items: UnifiedFeedItem[];
  leadAside?: React.ReactNode;
}> = ({ items, leadAside }) => {
  const [lead, ...rest] = items;
  const featured = rest.slice(0, 4);
  const more = rest.slice(4);

  return (
    <div className="flex flex-col gap-16 md:gap-20">
      {lead && <LeadStory item={lead} />}
      {leadAside}

      {rest.length > 0 && (
        <section aria-labelledby="contents-heading">
          <h2
            id="contents-heading"
            className="border-riso-blue text-riso-blue m-0 border-b-2 pb-3 font-futura text-3xl font-bold tracking-[-0.01em]"
          >
            Lately
          </h2>
          <div className="mt-10 grid gap-x-12 gap-y-16 sm:grid-cols-2">
            {featured.map((item) => (
              <GridCard
                key={`${item.type}-${item.slug}`}
                item={item}
                size="lg"
              />
            ))}
          </div>
          {more.length > 0 && (
            <div className="border-riso-blue/30 mt-16 grid gap-x-8 gap-y-12 border-t pt-12 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((item) => (
                <GridCard key={`${item.type}-${item.slug}`} item={item} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

const GridLayout: React.FC<{ items: UnifiedFeedItem[] }> = ({ items }) => (
  <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
    {items.map((item) => (
      <GridCard key={`${item.type}-${item.slug}`} item={item} />
    ))}
  </div>
);

const UnifiedContentFeed: React.FC<UnifiedContentFeedProps> = ({
  items,
  layout = 'tiered',
  leadAside,
}) => {
  if (!items || items.length === 0) return null;

  return layout === 'grid' ? (
    <GridLayout items={items} />
  ) : (
    <TieredLayout items={items} leadAside={leadAside} />
  );
};

export default UnifiedContentFeed;
