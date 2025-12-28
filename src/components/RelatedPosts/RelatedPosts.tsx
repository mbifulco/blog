import Link from 'next/link';
import posthog from 'posthog-js';

import { Badge } from '@components/Badge';
import { Heading } from '@components/Heading';
import { Image } from '@components/Image';
import { PublishDate } from '@components/PublishDate';
import type { RelatedContent } from '@lib/related-posts';

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
    <div className="w-full border-t border-gray-200 py-12">
      <div className="mx-auto max-w-5xl px-4">
        <Heading as="h2" className="mb-6 text-2xl font-bold">
          Related Reading
        </Heading>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                  className="overflow-hidden rounded-lg"
                >
                  <Image
                    className="aspect-video w-full object-cover transition-opacity duration-200 group-hover:opacity-90"
                    publicId={
                      item.type === 'newsletter'
                        ? `newsletters/${item.slug}/cover`
                        : `posts/${item.slug}/cover`
                    }
                    alt={item.title}
                    height={315}
                    width={600}
                    loading="lazy"
                  />
                </Link>
                <div className="flex items-center gap-2">
                  <Badge>
                    {item.type === 'newsletter' ? '💌 Newsletter' : 'Article'}
                  </Badge>
                  <PublishDate date={item.date} className="text-xs text-gray-500" />
                </div>
                <Heading as="h3" className="m-0 text-lg font-semibold">
                  <Link
                    href={path}
                    onClick={() => handleRelatedClick(item)}
                    className="text-pink-600 no-underline hover:underline"
                  >
                    {item.title}
                  </Link>
                </Heading>
                {item.excerpt && (
                  <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                    {item.excerpt}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RelatedPosts;
