import { getAllSeries } from './series';
import { getAllTags, getContentForTag } from './tags';
import { getAllTopicsWithCounts } from './topics';

export type OgCard =
  | { kind: 'home' }
  | { kind: 'newsletter' }
  | { kind: 'podcast' }
  | { kind: 'page'; title: string; kicker?: string };

// One build renders every card, and each render asks for the whole set.
let cardsPromise: Promise<Map<string, OgCard>> | undefined;

/**
 * Every Open Graph card the site can serve, keyed by its path under /og
 * ('' is the home card). Titles come from site data rather than the URL, so
 * the route can't be made to print arbitrary text in the site's branding.
 */
export const getOgCards = () => (cardsPromise ??= buildOgCards());

const buildOgCards = async (): Promise<Map<string, OgCard>> => {
  const cards = new Map<string, OgCard>([
    ['', { kind: 'home' }],
    ['newsletter', { kind: 'newsletter' }],
    ['podcast', { kind: 'podcast' }],
    ['articles', { kind: 'page', title: 'Articles', kicker: 'The archive' }],
    ['about', { kind: 'page', title: 'About me', kicker: 'Mike Bifulco' }],
    [
      'integrity',
      {
        kind: 'page',
        title: 'Editorial integrity',
        kicker: 'Reviews and sponsorships',
      },
    ],
    ['search', { kind: 'page', title: 'Search' }],
    [
      'shop',
      {
        kind: 'page',
        title: 'Shop',
        kicker: 'Stickers and other things I made',
      },
    ],
    ['tags', { kind: 'page', title: 'All tags', kicker: 'Browse' }],
    ['topics', { kind: 'page', title: 'Topics', kicker: 'Deep dives' }],
    ['work', { kind: 'page', title: 'My work around the web', kicker: 'Work' }],
  ]);

  const [tags, topics, series] = await Promise.all([
    getAllTags(),
    getAllTopicsWithCounts(),
    getAllSeries(),
  ]);

  for (const tag of tags) {
    const content = await getContentForTag(tag);
    const count =
      content.post.length + content.article.length + content.newsletter.length;
    cards.set(`tags/${tag}`, {
      kind: 'page',
      title: `#${tag}`,
      kicker: `${count} ${count === 1 ? 'post' : 'posts'} tagged`,
    });
  }
  for (const topic of topics) {
    cards.set(`topics/${topic.slug}`, {
      kind: 'page',
      title: topic.name,
      kicker: `Topic · ${topic.totalCount} articles`,
    });
  }
  for (const entry of series) {
    cards.set(`series/${entry.slug}`, {
      kind: 'page',
      title: entry.name,
      kicker: `A series in ${entry.length} parts`,
    });
  }

  return cards;
};
