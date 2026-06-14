/**
 * Extract a bare hostname (no scheme, no port) from a value that may be a
 * full origin (`https://host:port`), a bare host (`host:port`), or just a
 * hostname (`host`). Returns null if nothing usable can be parsed.
 */
function extractHostname(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  // Try parsing as a full URL first (handles `https://host:port`). Only trust
  // it when a non-empty hostname comes back — `new URL('localhost:3000')`
  // "succeeds" but treats `localhost` as a scheme and yields an empty hostname.
  try {
    const parsed = new URL(trimmed);
    if (parsed.hostname) return parsed.hostname.toLowerCase();
  } catch {
    // Not a full URL — fall through and treat it as a bare host[:port].
  }

  // Strip any port (and anything after a slash, just in case) from a bare host.
  const host = trimmed.split('/')[0]?.split(':')[0]?.trim();
  return host ? host.toLowerCase() : null;
}

/**
 * Cheap, bonus same-origin check for the newsletter mutation. Turnstile is the
 * real gate — this is deliberately lenient and designed to NEVER block a
 * legitimate user.
 *
 * - A missing/empty `origin` is allowed through (some legit clients omit it).
 * - Otherwise the origin's hostname is compared to the host's hostname. A match
 *   means same-origin, which works across the production custom domain, Vercel
 *   preview URLs, and localhost without hardcoding any domain, because a
 *   same-origin browser fetch sends `Origin` equal to the site's own host.
 * - Port differences on the same hostname still match (compared by hostname).
 * - If the origin is present but cannot be matched to the host (parse failure,
 *   missing host, or differing hostname) → blocked.
 */
export function isRequestOriginAllowed(
  origin: string | null,
  host: string | null
): boolean {
  // Missing Origin header is allowed — never block a real user over this.
  if (!origin) return true;

  const originHostname = extractHostname(origin);
  const hostHostname = host ? extractHostname(host) : null;

  // If we can't derive both hostnames, we can't confirm same-origin → block.
  if (!originHostname || !hostHostname) return false;

  return originHostname === hostHostname;
}
