import { describe, expect, it } from 'vitest';

import {
  buildDocumentRecord,
  buildPublicationRecord,
  getDocumentUri,
} from './atproto';

const PUBLICATION_URI =
  'at://did:plc:icpcpp5txyow3prnfgi533lj/site.standard.publication/abc123';

describe('buildPublicationRecord', () => {
  it('includes required fields', () => {
    const record = buildPublicationRecord({
      url: 'https://mikebifulco.com',
      name: 'Mike Bifulco',
    });

    expect(record.$type).toBe('site.standard.publication');
    expect(record.url).toBe('https://mikebifulco.com');
    expect(record.name).toBe('Mike Bifulco');
  });

  it('includes description when provided', () => {
    const record = buildPublicationRecord({
      url: 'https://mikebifulco.com',
      name: 'Mike Bifulco',
      description: 'A blog about dev stuff.',
    });

    expect(record.description).toBe('A blog about dev stuff.');
  });

  it('omits description when not provided', () => {
    const record = buildPublicationRecord({
      url: 'https://mikebifulco.com',
      name: 'Mike Bifulco',
    });

    expect(record).not.toHaveProperty('description');
  });
});

describe('buildDocumentRecord', () => {
  const baseFrontmatter = {
    title: 'My Test Post',
    date: '2024-03-15',
    tags: ['react', 'typescript'],
    excerpt: 'A brief intro.',
  };

  it('includes required fields', () => {
    const record = buildDocumentRecord(
      PUBLICATION_URI,
      '/posts/my-test-post',
      baseFrontmatter
    );

    expect(record.$type).toBe('site.standard.document');
    expect(record.site).toBe(PUBLICATION_URI);
    expect(record.path).toBe('/posts/my-test-post');
    expect(record.title).toBe('My Test Post');
  });

  it('formats publishedAt as ISO datetime', () => {
    const record = buildDocumentRecord(
      PUBLICATION_URI,
      '/posts/my-test-post',
      baseFrontmatter
    );

    expect(record.publishedAt).toBe(new Date('2024-03-15').toISOString());
  });

  it('includes description from excerpt', () => {
    const record = buildDocumentRecord(
      PUBLICATION_URI,
      '/posts/my-test-post',
      baseFrontmatter
    );

    expect(record.description).toBe('A brief intro.');
  });

  it('includes tags when provided', () => {
    const record = buildDocumentRecord(
      PUBLICATION_URI,
      '/posts/my-test-post',
      baseFrontmatter
    );

    expect(record.tags).toEqual(['react', 'typescript']);
  });

  it('omits description when no excerpt', () => {
    const record = buildDocumentRecord(PUBLICATION_URI, '/posts/my-test-post', {
      title: 'No Excerpt',
      date: '2024-03-15',
    });

    expect(record).not.toHaveProperty('description');
  });

  it('omits tags when not provided', () => {
    const record = buildDocumentRecord(PUBLICATION_URI, '/posts/my-test-post', {
      title: 'No Tags',
      date: '2024-03-15',
    });

    expect(record).not.toHaveProperty('tags');
  });

  it('omits tags when empty array', () => {
    const record = buildDocumentRecord(PUBLICATION_URI, '/posts/my-test-post', {
      title: 'Empty Tags',
      date: '2024-03-15',
      tags: [],
    });

    expect(record).not.toHaveProperty('tags');
  });

  it('uses the provided path for newsletter paths', () => {
    const record = buildDocumentRecord(
      PUBLICATION_URI,
      '/newsletter/my-newsletter',
      baseFrontmatter
    );

    expect(record.path).toBe('/newsletter/my-newsletter');
  });
});

describe('getDocumentUri', () => {
  const documents = {
    'my-post': 'at://did:plc:abc/site.standard.document/def',
    'other-post': 'at://did:plc:abc/site.standard.document/ghi',
  };

  it('returns the AT-URI for a known slug', () => {
    expect(getDocumentUri(documents, 'my-post')).toBe(
      'at://did:plc:abc/site.standard.document/def'
    );
  });

  it('returns undefined for an unknown slug', () => {
    expect(getDocumentUri(documents, 'unknown-slug')).toBeUndefined();
  });

  it('returns undefined for an empty documents map', () => {
    expect(getDocumentUri({}, 'my-post')).toBeUndefined();
  });
});
