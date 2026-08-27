'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import posthog from 'posthog-js';

import { GoogleIcon } from '@components/icons';
import Link from '@components/Link';
import { BASE_SITE_URL } from '@/config';

type PreferredSourceApi = {
  init: (options: { theme?: 'light' | 'dark'; lang?: string }) => void;
  addPreferredSource: () => void;
};

declare global {
  // Google's library drains this queue on load, then replaces it with an
  // object whose push runs callbacks immediately.
  var PREFERRED_SOURCE: ((api: PreferredSourceApi) => void)[] | undefined;
}

const SITE_DOMAIN = new URL(BASE_SITE_URL).hostname;
const DEEPLINK = `https://www.google.com/preferences/source?q=${SITE_DOMAIN}`;

// One library instance per page load, so registration is module state rather
// than component state — a remount must not queue a second callback.
let api: PreferredSourceApi | null = null;
let registered = false;

const register = () => {
  if (registered) return;
  registered = true;

  (globalThis.PREFERRED_SOURCE ??= []).push((preferredSource) => {
    preferredSource.init({ theme: 'light' });
    api = preferredSource;
  });
};

/** @see https://developers.google.com/search/docs/appearance/preferred-sources */
const PreferredSource = () => {
  useEffect(register, []);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    posthog.capture('preferred_source_clicked', {
      in_page_flow: Boolean(api),
    });

    if (!api) return; // let the browser follow the deeplink

    event.preventDefault();
    api.addPreferredSource();
  };

  return (
    <>
      {/* "manual": don't render Google's own button. */}
      <Script
        id="google-preferred-sources"
        src="https://news.google.com/swg/js/v1/publisher.js"
        strategy="lazyOnload"
        preferred-sources-control="manual"
      />

      <Link
        href={DEEPLINK}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="inline-flex w-fit items-center gap-2 rounded-full border border-pink-200 bg-white px-3 py-1.5 text-sm text-black shadow-sm transition-all duration-200 hover:scale-105 hover:border-pink-600 hover:text-pink-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
      >
        <GoogleIcon />
        <span>
          Make <span className="font-bold">{SITE_DOMAIN}</span> a preferred
          source
        </span>
      </Link>
    </>
  );
};

export default PreferredSource;
