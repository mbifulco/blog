import config from '../config';

type OgCard = {
  /** A fixed design instead of a titled page card. */
  card?: 'newsletter' | 'podcast';
  title?: string;
  kicker?: string;
};

/** Absolute URL of a generated riso Open Graph card; no title draws the home card. */
export const ogImageUrl = ({ card, title, kicker }: OgCard = {}) => {
  const params = new URLSearchParams();
  if (card) params.set('card', card);
  if (title) params.set('title', title);
  if (kicker) params.set('kicker', kicker);
  const query = params.toString();
  return `${config.siteUrl}/og${query ? `?${query}` : ''}`;
};
