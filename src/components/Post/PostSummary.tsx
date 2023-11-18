import React from 'react';
import Link from 'next/link';

import TagsSummary from '../tagsSummary';

import PolitePop from '../PolitePop/PolitePop';

import { Image } from '../Image';
import { PublishDate } from '../PublishDate';
import clsx from 'clsx';
import type { BlogPost } from '../../data/content-types';
import { Heading } from '../Heading';

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
    <Image
      className={clsx(
        'sm:rounded-lg mb-4 shadow -mx-2 sm:mx-0 object-cover object-center'
      )}
      publicId={coverImagePublicId || `posts/${path}/cover`}
      alt={excerpt || title}
      height={630}
      width={1200}
      loading={eager ? 'eager' : 'lazy'}
    />
  );

  return (
    <article>
      <div className="relative">
        <header>
          <Heading as={'h2'} className="m-0 p-0">
            <Link
              className="text-pink-600 hover:underline no-underline"
              href={postPath}
            >
              {title}
            </Link>
          </Heading>
          <p className="text-[1rem] text-gray-700">
            {!date && <h2>this mf</h2>}
            <PublishDate date={date} /> {author && <>— Written by {author}</>}
          </p>
          <TagsSummary tags={tags} />
          {coverContainer}
        </header>

        <p className="max-w-prose">{excerpt}</p>
        <Link
          className="text-pink-600 hover:underline no-underline"
          href={postPath}
        >
          Read more →
        </Link>
      </div>
      <PolitePop />
    </article>
  );
};

export default PostSummary;
