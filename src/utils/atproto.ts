import type { Frontmatter } from '@data/content-types';

export type AtprotoDocumentRecord = {
  $type: 'site.standard.document';
  site: string;
  path: string;
  title: string;
  description?: string;
  tags?: string[];
  publishedAt: string;
};

export type AtprotoPublicationRecord = {
  $type: 'site.standard.publication';
  url: string;
  name: string;
  description?: string;
};

export function buildPublicationRecord(opts: {
  url: string;
  name: string;
  description?: string;
}): AtprotoPublicationRecord {
  return {
    $type: 'site.standard.publication',
    url: opts.url,
    name: opts.name,
    ...(opts.description ? { description: opts.description } : {}),
  };
}

export function buildDocumentRecord(
  publicationUri: string,
  path: string,
  frontmatter: Pick<Frontmatter, 'title' | 'date' | 'tags'> & {
    excerpt?: string;
  }
): AtprotoDocumentRecord {
  return {
    $type: 'site.standard.document',
    site: publicationUri,
    path,
    title: frontmatter.title,
    ...(frontmatter.excerpt ? { description: frontmatter.excerpt } : {}),
    ...(frontmatter.tags?.length ? { tags: frontmatter.tags } : {}),
    publishedAt: new Date(frontmatter.date).toISOString(),
  };
}

export function getDocumentUri(
  documents: Record<string, string>,
  slug: string
): string | undefined {
  return documents[slug];
}
