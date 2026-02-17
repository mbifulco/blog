import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';

import Link from '@components/Link';

const PODCAST_EMBED_URL =
  'https://share.transistor.fm/e/tiny-improvements/playlist?color=F90476';

const PodcastSidebar: React.FC = () => {
  return (
    <>
      {/* Desktop: sticky gutter player */}
      <aside className="pointer-events-none fixed top-24 right-4 z-10 hidden w-[300px] xl:block">
        <div className="pointer-events-auto">
          <iframe
            width="100%"
            height="200"
            src={PODCAST_EMBED_URL}
            title="Tiny Improvements podcast player"
          />
        </div>
      </aside>

      {/* Mobile/tablet: collapsible accordion */}
      <div className="xl:hidden">
        <Disclosure as="div" className="group">
          <DisclosureButton className="flex w-full items-center justify-between py-3 text-left text-sm font-bold uppercase text-gray-700">
            Podcast
            <svg
              className="h-5 w-5 text-gray-500 transition-transform group-data-[open]:rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </DisclosureButton>
          <DisclosurePanel className="pb-4">
            <iframe
              width="100%"
              height="200"
              src={PODCAST_EMBED_URL}
              title="Tiny Improvements podcast player"
            />
            <Link
              href="/podcast"
              className="mt-2 inline-block text-sm font-semibold text-pink-600 hover:underline"
            >
              All episodes &rarr;
            </Link>
          </DisclosurePanel>
        </Disclosure>
      </div>
    </>
  );
};

export default PodcastSidebar;
