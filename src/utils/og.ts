import config from '../config';

/**
 * Absolute URL of a prerendered riso Open Graph card. `path` is a key from
 * getOgCards, such as 'newsletter' or 'tags/react'; '' is the home card.
 */
export const ogImageUrl = (path = '') =>
  `${config.siteUrl}/og${path ? `/${path.split('/').map(encodeURIComponent).join('/')}` : ''}`;
