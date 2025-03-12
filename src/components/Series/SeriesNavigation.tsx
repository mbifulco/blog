import Link from 'next/link';
import { useRouter } from 'next/router';

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
    ...(series.posts ?? []),
    ...(series.newsletters ?? []),
  ].sort((a, b) => {
    return (
      new Date(a.frontmatter.date).getTime() -
      new Date(b.frontmatter.date).getTime()
    );
  });

  return (
    <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
      <Heading as="h3" className="text-s mb-3 text-sm font-semibold capitalize">
        <Link href={`/series/${series.slug}`}>
          {series.name} ({orderedContent.length} Part Series)
        </Link>
      </Heading>
      <ul className="m-0 list-none p-0">
        {orderedContent.map((post, index) => {
          const postPath =
            post.frontmatter.slug && `/posts/${post.frontmatter.slug}`;
          const newsletterPath =
            post.frontmatter.slug && `/newsletters/${post.frontmatter.slug}`;
          const isActivePage =
            router.asPath.endsWith(postPath) ||
            router.asPath.endsWith(newsletterPath);

          return (
            <li
              key={index}
              className={clsxm(
                `flex items-center rounded-md py-2 transition-colors`,
                isActivePage && 'font-bold',
                !isActivePage && 'hover:bg-gray-200'
              )}
            >
              <Link
                href={isActivePage ? '#' : postPath || newsletterPath}
                className="flex items-center gap-2 text-lg text-inherit no-underline"
              >
                <span
                  className={clsxm(
                    `flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-semibold`,
                    isActivePage && 'bg-pink-500 text-white',
                    !isActivePage && 'bg-gray-500 text-white'
                  )}
                >
                  {index + 1}
                </span>
                {post.frontmatter.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
