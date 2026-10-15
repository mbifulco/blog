import { describe, expect, it, vi } from 'vitest';

vi.mock('./blog', () => ({ getPostBySlug: vi.fn() }));
vi.mock('./newsletters', () => ({ getNewsletterBySlug: vi.fn() }));
vi.mock('./tags', () => ({ getContentForTag: vi.fn() }));

const { getTopicForTags } = await import('./topics');

describe('getTopicForTags', () => {
  it('picks the topic sharing the most tags', () => {
    expect(getTopicForTags(['react', 'nextjs', 'design'])?.slug).toBe(
      'react-development'
    );
  });

  it('returns null when no topic shares at least two tags', () => {
    expect(getTopicForTags(['ai', 'llm', 'typescript', 'dev'])).toBeNull();
  });

  it('returns null for untagged posts', () => {
    expect(getTopicForTags()).toBeNull();
  });
});
