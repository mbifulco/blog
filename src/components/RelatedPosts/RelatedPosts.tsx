import type { RelatedContent } from '@lib/related-posts';
import posthog from 'posthog-js';

import { Image } from '@components/Image';
import Link from '@components/Link';
import { PublishDate } from '@components/PublishDate';

type RelatedPostsProps = {
  relatedContent: RelatedContent[];
  currentTitle?: string;
};

const RelatedPosts: React.FC<RelatedPostsProps> = ({
  relatedContent,
  currentTitle,
}) => {
  if (!relatedContent || relatedContent.length === 0) {
    return null;
  }

  const handleRelatedClick = (item: RelatedContent) => {
    posthog.capture('related_content_clicked', {
      from_title: currentTitle,
      to_slug: item.slug,
      to_title: item.title,
      to_type: item.type,
      shared_tag_count: item.sharedTagCount,
    });
  };

  return (
    <section className="w-full" aria-labelledby="related-heading">
      <div className="mx-auto max-w-6xl">
        <h2
          id="related-heading"
          className="border-riso-blue text-riso-blue m-0 mb-10 border-b-2 pb-3 font-futura text-3xl font-bold tracking-[-0.01em]"
        >
          Keep reading
        </h2>
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {relatedContent.map((item) => {
            const path =
              item.type === 'newsletter'
                ? `/newsletter/${item.slug}`
                : `/posts/${item.slug}`;

            return (
              <article
                key={`${item.type}-${item.slug}`}
                className="group flex flex-col gap-2"
              >
                <Link
                  href={path}
                  onClick={() => handleRelatedClick(item)}
                  className="riso-plate mb-3 mr-3"
                  aria-hidden
                  tabIndex={-1}
                >
                  <Image
                    bare
                    className="aspect-video w-full object-cover"
                    publicId={
                      item.coverImagePublicId ||
                      (item.type === 'newsletter'
                        ? `newsletters/${item.slug}/cover`
                        : `posts/${item.slug}/cover`)
                    }
                    alt=""
                    height={315}
                    width={600}
                    loading="lazy"
                  />
                </Link>
                <h3 className="m-0 text-balance font-futura text-lg font-bold leading-tight">
                  <Link
                    href={path}
                    onClick={() => handleRelatedClick(item)}
                    className="text-riso-blue hover:text-riso-pink hover:no-underline"
                  >
                    {item.title}
                  </Link>
                </h3>
                {item.excerpt && (
                  <p className="text-ink-muted m-0 line-clamp-2 font-serif text-[0.95rem] leading-snug">
                    {item.excerpt}
                  </p>
                )}
                <p className="text-ink-muted m-0 flex flex-wrap items-baseline gap-x-2 font-futura text-sm font-bold">
                  <PublishDate date={item.date} className="font-mono text-xs" />
                  <span aria-hidden>·</span>
                  <span
                    className={
                      item.type === 'newsletter' ? 'text-riso-pink' : undefined
                    }
                  >
                    {item.type === 'newsletter'
                      ? '💌 Tiny Improvements'
                      : 'Article'}
                  </span>
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RelatedPosts;
