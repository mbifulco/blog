import React from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';

import { Heading } from '../components/Heading';
import { Image } from '../components/Image';
import SEO from '../components/seo';

const NotFoundPage: NextPage = () => {
  return (
    <div className="mx-auto mb-10 flex max-w-4xl flex-col gap-8 text-xl">
      <SEO title="404: URL Not found" />
      <Heading as="h1">Uh oh, you stumbled upon a bad URL.</Heading>
      <Image
        publicId="pawel-czerwinski-lWBZ01XRRoI-unsplash_fyoisl"
        alt="A soothing potted plant to atone for a missing page"
        caption={
          <span>
            Photo by{' '}
            <Link
              className="text-pink-600 no-underline hover:underline"
              href="https://unsplash.com/@pawel_czerwinski?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
            >
              Pawel Czerwinski
            </Link>{' '}
            on{' '}
            <Link
              className="text-pink-600 no-underline hover:underline"
              href="https://unsplash.com/s/photos/plant?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
            >
              Unsplash
            </Link>
          </span>
        }
      />
      <p>
        Hey, shit, sorry, this &mdash; {"isn't"} a page. If {"you're "}
        expecting something to be here,{' '}
        <Link
          className="text-pink-600 no-underline hover:underline"
          href="mailto:hello@mikebifulco.com"
        >
          email me
        </Link>{' '}
        or message me on threads {'('}
        <Link
          className="text-pink-600 no-underline hover:underline"
          href="https://threads.net/@irreverentmike"
        >
          @irreverentmike
        </Link>
        {')'}, and {"I'll"} do my best to help you out.
      </p>
    </div>
  );
};

export default NotFoundPage;
