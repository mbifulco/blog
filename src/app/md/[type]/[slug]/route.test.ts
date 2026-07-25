import { beforeEach, describe, expect, it, vi } from 'vitest';

const getPostBySlug = vi.fn();
const getAllPosts = vi.fn();
const getNewsletterBySlug = vi.fn();
const getAllNewsletters = vi.fn();

vi.mock('@lib/blog', () => ({
  getPostBySlug: (slug: string) => getPostBySlug(slug),
  getAllPosts: () => getAllPosts(),
}));

vi.mock('@lib/newsletters', () => ({
  getNewsletterBySlug: (slug: string) => getNewsletterBySlug(slug),
  getAllNewsletters: () => getAllNewsletters(),
}));

vi.mock('next/server', () => ({
  after: (fn: () => void) => fn(),
}));

vi.mock('@server/logging/otel-logs', () => ({
  flushLogs: vi.fn(),
}));

const { GET, generateStaticParams } = await import('./route');

const post = {
  slug: 'all-about-ch',
  content: 'Body text.\n',
  source: {},
  tableOfContents: [],
  frontmatter: {
    type: 'post',
    slug: 'all-about-ch',
    title: 'All about ch',
    date: 'Fri, 17 May 2019 00:00:00 GMT',
    published: true,
  },
};

const request = () => new Request('https://mikebifulco.com');

describe('markdown route handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getPostBySlug.mockResolvedValue(post);
    getAllPosts.mockResolvedValue([post]);
    getNewsletterBySlug.mockResolvedValue(post);
    getAllNewsletters.mockResolvedValue([]);
  });

  it('returns markdown for a known post', async () => {
    const response = await GET(request(), {
      params: Promise.resolve({ type: 'posts', slug: 'all-about-ch' }),
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/markdown');
    await expect(response.text()).resolves.toContain('# All about ch');
  });

  it('points the canonical field at the html url', async () => {
    const response = await GET(request(), {
      params: Promise.resolve({ type: 'posts', slug: 'all-about-ch' }),
    });

    await expect(response.text()).resolves.toContain(
      'canonical: https://mikebifulco.com/posts/all-about-ch'
    );
  });

  it('sends a canonical link header pointing at the html page', async () => {
    const response = await GET(request(), {
      params: Promise.resolve({ type: 'posts', slug: 'all-about-ch' }),
    });

    expect(response.headers.get('link')).toBe(
      '<https://mikebifulco.com/posts/all-about-ch>; rel="canonical"'
    );
  });

  it('closes the document with an attribution line', async () => {
    const response = await GET(request(), {
      params: Promise.resolve({ type: 'posts', slug: 'all-about-ch' }),
    });

    await expect(response.text()).resolves.toContain(
      'Written by Mike Bifulco. Originally published at https://mikebifulco.com/posts/all-about-ch'
    );
  });

  it('404s for an unknown content type', async () => {
    const response = await GET(request(), {
      params: Promise.resolve({ type: 'recipes', slug: 'all-about-ch' }),
    });

    expect(response.status).toBe(404);
  });

  it('404s when the loader throws for an unknown slug', async () => {
    getPostBySlug.mockRejectedValue(new Error('File not found'));

    const response = await GET(request(), {
      params: Promise.resolve({ type: 'posts', slug: 'nope' }),
    });

    expect(response.status).toBe(404);
  });

  it('404s for a draft', async () => {
    getPostBySlug.mockResolvedValue({
      ...post,
      frontmatter: { ...post.frontmatter, published: false },
    });

    const response = await GET(request(), {
      params: Promise.resolve({ type: 'posts', slug: 'all-about-ch' }),
    });

    expect(response.status).toBe(404);
  });

  it('enumerates params for posts and newsletters', async () => {
    getAllNewsletters.mockResolvedValue([{ ...post, slug: 'a-newsletter' }]);

    const params = await generateStaticParams();

    expect(params).toContainEqual({ type: 'posts', slug: 'all-about-ch' });
    expect(params).toContainEqual({ type: 'newsletter', slug: 'a-newsletter' });
  });
});
