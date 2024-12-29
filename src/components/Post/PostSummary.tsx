import React from 'react';
import Link from 'next/link';

import clsxm from '@utils/clsxm';
import type { BlogPost } from '../../data/content-types';
import { Heading } from '../Heading';
import { Image } from '../Image';
import { PublishDate } from '../PublishDate';

type PostSummaryProps = {
  post: BlogPost;
  eager?: boolean;
};

const PostSummary: React.FC<PostSummaryProps> = ({ post, eager = false }) => {
  const { frontmatter } = post;

  const { coverImagePublicId, date, excerpt, path, title } = frontmatter;

  const postPath = `/posts/${path}`;

  const coverContainer = (
    <Link href={postPath}>
      <Image
        className={clsxm(
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
          {coverContainer}
          <Heading as={'h2'} className="m-0 p-0 text-xl md:text-xl">
            <Link
              className="text-xl text-pink-600 no-underline hover:underline"
              href={postPath}
            >
              {title}
            </Link>
          </Heading>
          <p>
            <PublishDate date={date} className="text-sm text-gray-500" />
          </p>
        </header>

        <p className="text-md text-balance">{excerpt}</p>
      </div>
    </article>
  );
};

export default PostSummary;
