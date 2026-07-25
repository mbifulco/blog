import type { MarkdownDocument } from '@data/content-types';
import type { RelatedContent, RelatedPostsManifest } from '@lib/related-posts';
import type { MarkdownExportOptions, MarkdownRelatedLink } from './types';
import type { MarkdownContentType } from './urls';

import relatedPostsData from '@data/generated/relatedPosts.json';
import { getSeries } from '@lib/series';
import { BASE_SITE_URL } from '@/config';
import { canonicalUrlFor } from './urls';

/**
 * Enough onward links to give a crawler somewhere to go, without padding every
 * file with a wall of links.
 */
const MAX_RELATED_LINKS = 5;

const segmentFor = (type: 'post' | 'newsletter'): MarkdownContentType =>
  type === 'newsletter' ? 'newsletter' : 'posts';

const toRelatedLink = (item: RelatedContent): MarkdownRelatedLink => ({
  title: item.title,
  url: canonicalUrlFor(segmentFor(item.type), item.slug),
});

const relatedLinksFor = (slug: string): MarkdownRelatedLink[] =>
  ((relatedPostsData as RelatedPostsManifest).relatedContent[slug] ?? [])
    .slice(0, MAX_RELATED_LINKS)
    .map(toRelatedLink);

const seriesFor = async (document: MarkdownDocument, slug: string) => {
  const seriesName = document.frontmatter.series;
  if (!seriesName) return undefined;

  const series = await getSeries(seriesName);
  if (!series) return undefined;

  const entries: MarkdownRelatedLink[] = [
    ...series.posts.map((post) => ({
      title: post.frontmatter.title,
      url: canonicalUrlFor('posts', post.slug),
    })),
    ...series.newsletters.map((newsletter) => ({
      title: newsletter.frontmatter.title,
      url: canonicalUrlFor('newsletter', newsletter.slug),
    })),
  ].filter((entry) => !entry.url.endsWith(`/${slug}`));

  if (entries.length === 0) return undefined;

  return {
    name: series.name,
    url: `${BASE_SITE_URL}/series/${series.slug}`,
    entries,
  };
};

/**
 * Assembles the onward-link context for a document's Markdown twin: related
 * reading and series navigation, both as absolute URLs so the file works as a
 * standalone artifact wherever it is read.
 */
export const buildExportOptions = async (
  document: MarkdownDocument,
  type: MarkdownContentType,
  slug: string
): Promise<MarkdownExportOptions> => {
  const series = await seriesFor(document, slug);

  return {
    canonicalUrl: canonicalUrlFor(type, slug),
    relatedLinks: relatedLinksFor(slug),
    ...(series ? { series } : {}),
  };
};
