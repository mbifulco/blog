'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import posthog from 'posthog-js';

import { GoogleIcon } from '@components/icons';
import { BASE_SITE_URL } from '@/config';

type PreferredSourceApi = {
  init: (options: { theme?: 'light' | 'dark'; lang?: string }) => void;
  addPreferredSource: () => void;
};

type PreferredSourceCallback = (api: PreferredSourceApi) => void;

/** Google's library replaces the queue array with a live object of this shape. */
type PreferredSourceQueue = {
  push: (callback: PreferredSourceCallback) => void;
};

declare global {
  var PREFERRED_SOURCE: PreferredSourceQueue | undefined;
}

const SITE_DOMAIN = new URL(BASE_SITE_URL).hostname;

/**
 * Where the button sends readers when Google's library never loads (blocked
 * script, no JS): the same source preferences tool, just as a full page.
 */
const DEEPLINK = `https://www.google.com/preferences/source?q=${SITE_DOMAIN}`;

/**
 * Lets readers mark this site as a preferred source in Google Search, which
 * makes its posts more likely to surface in Top Stories and AI Overviews for
 * them. Google's own library renders an in-page flow that returns readers
 * where they left off, so the button asks for it when it has loaded and falls
 * back to the deeplink when it hasn't.
 *
 * @see https://developers.google.com/search/docs/appearance/preferred-sources
 */
const PreferredSource = () => {
  const api = useRef<PreferredSourceApi | null>(null);

  useEffect(() => {
    // The queue is drained when Google's library loads; pushing before then is
    // the documented way to hand it options, and a push after it has loaded
    // runs immediately. Either order works, so registration doesn't wait on
    // the script.
    const queue: PreferredSourceQueue =
      globalThis.PREFERRED_SOURCE ?? new Array<PreferredSourceCallback>();
    globalThis.PREFERRED_SOURCE = queue;

    queue.push((preferredSource) => {
      preferredSource.init({ theme: 'light' });
      api.current = preferredSource;
    });
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    posthog.capture('preferred_source_clicked', {
      // Distinguishes the in-page flow from the deeplink fallback.
      in_page_flow: Boolean(api.current),
    });

    if (!api.current) return; // let the browser follow the deeplink

    event.preventDefault();
    api.current.addPreferredSource();
  };

  return (
    <>
      {/* "manual" keeps the library from rendering its own button, so the one
          below stays in the site's voice. */}
      <Script
        id="google-preferred-sources"
        src="https://news.google.com/swg/js/v1/publisher.js"
        strategy="lazyOnload"
        preferred-sources-control="manual"
      />

      <a
        href={DEEPLINK}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="inline-flex w-fit items-center gap-2 rounded-full border border-pink-200 bg-white px-3 py-1.5 text-sm text-black shadow-sm transition-all duration-200 hover:scale-105 hover:border-pink-600 hover:text-pink-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
      >
        <GoogleIcon aria-hidden />
        <span>
          Make <span className="font-bold">{SITE_DOMAIN}</span> a preferred
          source
        </span>
      </a>
    </>
  );
};

export default PreferredSource;
