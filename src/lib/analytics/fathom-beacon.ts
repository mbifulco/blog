/**
 * Server-side Fathom pageviews.
 *
 * Fathom is a browser product: `fathom-client` only queues calls for the script
 * loaded from cdn.usefathom.com, and the public API at api.usefathom.com is
 * read-only reporting. Neither can record a request for a file that runs no
 * JavaScript, which is every markdown twin and llms.txt hit.
 *
 * So this sends the same beacon the embed script sends — a GET to the CDN with
 * the site id and the path — from the proxy instead of from a browser. That
 * request shape is not part of Fathom's documented API and could change without
 * notice, so treat it as best-effort: `FATHOM_SERVER_BEACON=off` turns it off
 * without touching anything else, and a failed beacon never affects the
 * response (see `sendFathomPageview`).
 *
 * To verify after deploying: request a `.md` URL and watch Fathom's real-time
 * dashboard for the path. To re-derive the parameters if it ever stops
 * counting, open a page with the embed script and read the request the script
 * makes to cdn.usefathom.com in devtools.
 */
export const FATHOM_BEACON_ENDPOINT = 'https://cdn.usefathom.com/';

export type FathomPageview = {
  /** Fathom site id (NEXT_PUBLIC_FATHOM_ID). */
  siteId: string;
  /** Origin of the request, e.g. `https://mikebifulco.com`. */
  origin: string;
  /** Path being recorded, e.g. `/posts/all-about-ch.md`. */
  pathname: string;
  /** Referrer from the incoming request, if it sent one. */
  referrer?: string | null;
  /**
   * The requesting client's user agent, forwarded so Fathom attributes the hit
   * to whoever actually made it rather than to our server. Fathom filters known
   * bots, so crawler traffic may be dropped on their side by design — PostHog
   * is where the unfiltered picture lives.
   */
  userAgent?: string | null;
};

export const buildFathomBeaconUrl = ({
  siteId,
  origin,
  pathname,
  referrer,
}: FathomPageview): string => {
  const url = new URL(FATHOM_BEACON_ENDPOINT);

  url.searchParams.set('h', origin);
  url.searchParams.set('p', pathname);
  url.searchParams.set('r', referrer ?? '');
  url.searchParams.set('sid', siteId);
  // The script sends the page's parsed query string; these files are requested
  // without one, and a literal empty object matches what it sends in that case.
  url.searchParams.set('qs', '{}');

  return url.toString();
};

/**
 * Fire the beacon. Resolves to whether Fathom accepted it, and never throws —
 * analytics must not be able to break a page request.
 */
export const sendFathomPageview = async (
  pageview: FathomPageview
): Promise<boolean> => {
  try {
    const response = await fetch(buildFathomBeaconUrl(pageview), {
      method: 'GET',
      headers: {
        ...(pageview.userAgent ? { 'user-agent': pageview.userAgent } : {}),
        ...(pageview.referrer ? { referer: pageview.referrer } : {}),
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(
        `Fathom beacon for ${pageview.pathname} returned ${response.status}`
      );
    }

    return response.ok;
  } catch (error) {
    console.error('Failed to send server-side Fathom pageview:', error);
    return false;
  }
};
