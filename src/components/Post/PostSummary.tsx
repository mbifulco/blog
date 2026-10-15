import type { BlogPost } from '../../data/content-types';
import React from 'react';
import posthog from 'posthog-js';

import Link from '@components/Link';
import { Heading } from '../Heading';
import { Image } from '../Image';
import { PublishDate } from '../PublishDate';

type PostSummaryProps = {
  post: BlogPost;
  eager?: boolean;
};

const PostSummary: React.FC<PostSummaryProps> = ({ post, eager = false }) => {
  const { frontmatter } = post;

  const { coverImagePublicId, date, excerpt, slug, title } = frontmatter;

  const postPath = `/posts/${slug}`;

  const handlePostSummaryClick = () => {
    posthog.capture('post_summary_clicked', {
      post_slug: slug,
      post_title: title,
      published_date: date,
    });
  };

  const coverContainer = (
    <Link
      href={postPath}
      onClick={handlePostSummaryClick}
      className="riso-plate mb-6 mr-3"
    >
      <Image
        bare
        className="w-full object-cover object-center"
        publicId={coverImagePublicId || `posts/${slug}/cover`}
        alt={excerpt || title}
        height={630}
        width={1200}
        loading={eager ? 'eager' : 'lazy'}
      />
    </Link>
  );

  return (
    <article className="min-w-0 max-w-full">
      <div className="relative">
        <header className="flex flex-col gap-1">
          {coverContainer}
          <Heading as={'h2'} className="m-0 p-0 text-xl md:text-xl">
            <Link
              className="text-riso-blue hover:text-riso-pink text-xl hover:no-underline"
              href={postPath}
              onClick={handlePostSummaryClick}
            >
              {title}
            </Link>
          </Heading>
          <p>
            <PublishDate
              date={date}
              className="text-ink-muted font-mono text-xs"
            />
          </p>
        </header>

        <p className="text-ink-muted text-pretty font-serif text-lg">
          {excerpt}
        </p>
      </div>
    </article>
  );
};

export default PostSummary;
