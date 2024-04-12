import Link from 'next/link';
import { Popover } from '@headlessui/react';

import { NewsletterSignup } from '../../components/NewsletterSignup';
import SEO from '../../components/seo';
import { Subtitle } from '../../components/Subtitle';

const Eponymous = () => {
  return (
    <Popover className="relative inline" as="div">
      <Popover.Button
        className={`cursor-pointer border-b border-dashed border-pink-400`}
        as="span"
      >
        eponymous
      </Popover.Button>
      <Popover.Panel className="absolute left-3 z-10 max-w-md rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
        <dl>
          <dt className="font-semibold">e·pon·y·mous</dt>
          <dd className="text-sm">
            <em>adj.</em> - of or having the same name.
          </dd>
        </dl>
        <p className="mt-2 text-sm">
          That&apos;s right, my newsletter is also called{' '}
          <em>Tiny Improvements</em>. Sound interesting? Check it out{' '}
          <Link href="/newsletter" className="text-pink-600 hover:underline">
            here
          </Link>
          .
        </p>
      </Popover.Panel>
    </Popover>
  );
};

const PodcastPage = () => {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <SEO
        title="Subscribe to Tiny Improvements: articles software dev, design, and climate"
        image={
          'https://res.cloudinary.com/mikebifulco-com/image/upload/v1662476730/newsletters/cover.png'
        }
      />

      <header className="space-y-2">
        <h1 className="text-4xl font-bold">Tiny Improvements</h1>
        <Subtitle>🎙️ The Podcast</Subtitle>
      </header>
      <div className="text-xl">
        Occasionally, {"I'll"} write something I like <em>so much</em> that I
        record it as a podcast. Think of them as short-form audio essays,
        published under the same title as my <Eponymous />{' '}
        <Link className="text-pink-600 hover:underline" href="/newsletter">
          newsletter
        </Link>
        .
      </div>

      <div className="aspect-w-16 aspect-h-9 h-full">
        <iframe
          height={390}
          width={'100%'}
          src="https://share.transistor.fm/e/tiny-improvements/playlist"
        ></iframe>
      </div>

      <NewsletterSignup />
    </div>
  );
};

export default PodcastPage;
