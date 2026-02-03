import Link from '@components/Link';
import { useRouter } from 'next/router';
import posthog from 'posthog-js';

import { Heading } from '@components/Heading';
import type { Series } from '@lib/series';
import clsxm from '@utils/clsxm';

type SeriesNavigationProps = {
  series: Series;
};

export const SeriesNavigation: React.FC<SeriesNavigationProps> = ({
  series,
}) => {
  const router = useRouter();

  const orderedContent = [
    ...(series.posts ?? []).map((post) => ({ ...post, contentType: 'post' as const })),
    ...(series.newsletters ?? []).map((newsletter) => ({ ...newsletter, contentType: 'newsletter' as const })),
  ].sort((a, b) => {
    return (
      new Date(a.frontmatter.date).getTime() -
      new Date(b.frontmatter.date).getTime()
    );
  });

  const handleSeriesNavClick = (targetTitle: string, targetSlug: string, positionInSeries: number) => {
    posthog.capture('series_navigation_clicked', {
      series_name: series.name,
      series_slug: series.slug,
      target_title: targetTitle,
      target_slug: targetSlug,
      position_in_series: positionInSeries,
      total_in_series: orderedContent.length,
    });
  };

  return (
    <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
      <Heading as="h3" className="text-s mb-3 text-sm font-semibold capitalize">
        <Link href={`/series/${series.slug}`}>
          {series.name} ({orderedContent.length} Part Series)
        </Link>
      </Heading>
      <ul className="m-0 list-none p-0">
        {orderedContent.map((item, index) => {
          const itemPath = item.frontmatter.slug
            ? item.contentType === 'newsletter'
              ? `/newsletter/${item.frontmatter.slug}`
              : `/posts/${item.frontmatter.slug}`
            : '';
          const isActivePage = router.asPath.endsWith(itemPath);

          const content = (
            <>
              <span
                className={clsxm(
                  `flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-semibold`,
                  isActivePage && 'bg-pink-500 text-white',
                  !isActivePage && 'bg-gray-500 text-white'
                )}
              >
                {index + 1}
              </span>
              {item.frontmatter.title}
            </>
          );

          return (
            <li
              key={index}
              className={clsxm(
                `flex items-center rounded-md py-2 transition-colors`,
                isActivePage && 'font-bold',
                !isActivePage && 'hover:bg-gray-200'
              )}
            >
              {isActivePage ? (
                <span className="flex items-center gap-2 text-lg">
                  {content}
                </span>
              ) : (
                <Link
                  href={itemPath}
                  className="flex items-center gap-2 text-lg text-inherit no-underline"
                  onClick={() => handleSeriesNavClick(item.frontmatter.title, item.frontmatter.slug, index + 1)}
                >
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
