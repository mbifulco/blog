import React from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import type { BlogPost } from '../../data/content-types';
import { Heading } from '../Heading';
import { Image } from '../Image';
import { PublishDate } from '../PublishDate';
import TagsSummary from '../tagsSummary';

type PostSummaryProps = {
  post: BlogPost;
  eager?: boolean;
};

const PostSummary: React.FC<PostSummaryProps> = ({ post, eager = false }) => {
  const { frontmatter } = post;

  const { author, coverImagePublicId, date, excerpt, path, tags, title } =
    frontmatter;

  const postPath = `/posts/${path}`;

  const coverContainer = (
    <Link href={postPath}>
      <Image
        className={cn(
          '-mx-2 mb-4 object-cover object-center shadow sm:mx-0 sm:rounded-lg'
        )}
        publicId={coverImagePublicId || `posts/${path}/cover`}
        alt={excerpt || title}
        height={630}
        width={1200}
        loading={eager ? 'eager' : 'lazy'}
      />
    </Link>
  );

  return (
    <article className="max-w-[100vw]">
      <div className="relative">
        <header className="flex flex-col gap-1">
          <Heading as={'h2'} className="m-0 p-0">
            <Link
              className="text-pink-600 no-underline hover:underline"
              href={postPath}
            >
              {title}
            </Link>
          </Heading>
          <p className="text-gray-700">
            <PublishDate date={date} /> {author && <>— Written by {author}</>}
          </p>
          <TagsSummary tags={tags} />
          {coverContainer}
        </header>

        <p className="text-xl">{excerpt}</p>
        <Link
          className="text-pink-600 no-underline hover:underline"
          href={postPath}
        >
          Read more →
        </Link>
      </div>
    </article>
  );
};

export default PostSummary;
