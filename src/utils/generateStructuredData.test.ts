import type { BlogPost, Newsletter } from '@data/content-types';
import type { Series } from '@lib/series';
import { describe, expect, it } from 'vitest';

import {
  generateOrganizationStructuredData,
  generatePostStructuredData,
  generateSeriesStructuredData,
  generateSiteStructuredData,
  generateWebSiteStructuredData,
} from './generateStructuredData';

// Mock blog post for testing
const mockBlogPost = {
  frontmatter: {
    type: 'post',
    title: 'Test Blog Post',
    slug: 'test-blog-post',
    date: '2024-01-15',
    tags: ['react', 'typescript'],
    excerpt: 'This is a test blog post excerpt.',
    coverImagePublicId: 'posts/test-blog-post/cover',
    content: 'Full blog post content here.',
    published: true,
  },
  content: 'Full blog post content here.',
  slug: 'test-blog-post',
  source: {},
  tableOfContents: [],
} as unknown as BlogPost;

// Mock newsletter for testing
const mockNewsletter = {
  frontmatter: {
    type: 'newsletter',
    title: 'Test Newsletter',
    slug: 'test-newsletter',
    date: '2024-01-20',
    tags: ['newsletter', 'updates'],
    excerpt: 'This is a test newsletter excerpt.',
    coverImagePublicId: 'newsletters/test-newsletter/cover',
  },
  content: 'Newsletter content here.',
  slug: 'test-newsletter',
  source: {},
  tableOfContents: [],
} as unknown as Newsletter;

// Helper to cast structured data result for type-safe assertions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getBlogPosting = (result: any[]) => result[0] as Record<string, any>;

describe('generatePostStructuredData', () => {
  describe('BlogPosting schema fields', () => {
    it('should generate valid BlogPosting schema with all required fields', () => {
      const result = generatePostStructuredData({ post: mockBlogPost });

      expect(result).toHaveLength(1);
      const blogPosting = getBlogPosting(result);

      expect(blogPosting['@context']).toBe('https://schema.org');
      expect(blogPosting['@type']).toBe('BlogPosting');
    });

    it('should include headline from post title', () => {
      const result = generatePostStructuredData({ post: mockBlogPost });
      const blogPosting = getBlogPosting(result);

      expect(blogPosting.headline).toBe('Test Blog Post');
    });

    it('should include description from excerpt', () => {
      const result = generatePostStructuredData({ post: mockBlogPost });
      const blogPosting = getBlogPosting(result);

      expect(blogPosting.description).toBe('This is a test blog post excerpt.');
    });

    it('should include datePublished and dateModified', () => {
      const result = generatePostStructuredData({ post: mockBlogPost });
      const blogPosting = getBlogPosting(result);

      expect(blogPosting.datePublished).toBeDefined();
      expect(blogPosting.dateModified).toBeDefined();
      expect(blogPosting.datePublished).toBe(blogPosting.dateModified);
    });

    it('should include url for blog posts with /posts/ path', () => {
      const result = generatePostStructuredData({ post: mockBlogPost });
      const blogPosting = getBlogPosting(result);

      expect(blogPosting.url).toContain('/posts/test-blog-post');
    });

    it('should include url for newsletters with /newsletter/ path', () => {
      const result = generatePostStructuredData({ post: mockNewsletter });
      const blogPosting = getBlogPosting(result);

      expect(blogPosting.url).toContain('/newsletter/test-newsletter');
    });

    it('should include mainEntityOfPage with WebPage type', () => {
      const result = generatePostStructuredData({ post: mockBlogPost });
      const blogPosting = getBlogPosting(result);

      expect(blogPosting.mainEntityOfPage).toBeDefined();
      expect(blogPosting.mainEntityOfPage?.['@type']).toBe('WebPage');
      expect(blogPosting.mainEntityOfPage?.['@id']).toContain(
        '/posts/test-blog-post'
      );
    });

    it('should include image with ImageObject type', () => {
      const result = generatePostStructuredData({ post: mockBlogPost });
      const blogPosting = getBlogPosting(result);

      expect(blogPosting.image).toBeDefined();
      expect(blogPosting.image?.['@type']).toBe('ImageObject');
      expect(blogPosting.image?.url).toContain('cloudinary');
    });

    it('should use posts prefix for blog post image fallback', () => {
      const postWithoutCover = {
        ...mockBlogPost,
        frontmatter: {
          ...mockBlogPost.frontmatter,
          coverImagePublicId: undefined,
        },
      } as unknown as BlogPost;
      const result = generatePostStructuredData({ post: postWithoutCover });
      const blogPosting = getBlogPosting(result);

      expect(blogPosting.image?.url).toContain('posts/test-blog-post/cover');
    });

    it('should use newsletters prefix for newsletter image fallback', () => {
      const newsletterWithoutCover = {
        ...mockNewsletter,
        frontmatter: {
          ...mockNewsletter.frontmatter,
          coverImagePublicId: undefined,
        },
      } as unknown as Newsletter;
      const result = generatePostStructuredData({
        post: newsletterWithoutCover,
      });
      const blogPosting = getBlogPosting(result);

      expect(blogPosting.image?.url).toContain(
        'newsletters/test-newsletter/cover'
      );
    });

    it('should include keywords from tags', () => {
      const result = generatePostStructuredData({ post: mockBlogPost });
      const blogPosting = getBlogPosting(result);

      expect(blogPosting.keywords).toBe('react, typescript');
    });

    it('should handle posts without tags', () => {
      const postWithoutTags = {
        ...mockBlogPost,
        frontmatter: { ...mockBlogPost.frontmatter, tags: undefined },
      };
      const result = generatePostStructuredData({ post: postWithoutTags });
      const blogPosting = getBlogPosting(result);

      expect(blogPosting.keywords).toBeUndefined();
    });

    it('should include author data', () => {
      const result = generatePostStructuredData({ post: mockBlogPost });
      const blogPosting = getBlogPosting(result);

      expect(blogPosting.author).toBeDefined();
      expect(blogPosting.author?.['@type']).toBe('Person');
    });

    it('should include publisher data', () => {
      const result = generatePostStructuredData({ post: mockBlogPost });
      const blogPosting = getBlogPosting(result);

      expect(blogPosting.publisher).toBeDefined();
      expect(blogPosting.publisher?.['@type']).toBe('Organization');
      expect(blogPosting.publisher?.name).toBe('mikebifulco.com');
    });
  });

  describe('series handling', () => {
    it('should include isPartOf when post has a series', () => {
      const postWithSeries = {
        ...mockBlogPost,
        frontmatter: { ...mockBlogPost.frontmatter, series: 'react-tips' },
      };
      const result = generatePostStructuredData({ post: postWithSeries });
      const blogPosting = getBlogPosting(result);

      expect(blogPosting.isPartOf).toBeDefined();
      expect(blogPosting.isPartOf?.['@type']).toBe('CreativeWorkSeries');
      expect(blogPosting.isPartOf?.name).toBe('react-tips');
      expect(blogPosting.isPartOf?.url).toContain('/series/react-tips');
    });

    it('should slugify the series name in the isPartOf url', () => {
      const postWithSeries = {
        ...mockBlogPost,
        frontmatter: {
          ...mockBlogPost.frontmatter,
          series: 'My Product Engineer Tech Stack',
        },
      };
      const result = generatePostStructuredData({ post: postWithSeries });
      const blogPosting = getBlogPosting(result);

      expect(blogPosting.isPartOf?.name).toBe('My Product Engineer Tech Stack');
      expect(blogPosting.isPartOf?.url).toBe(
        'https://mikebifulco.com/series/my-product-engineer-tech-stack'
      );
    });

    it('should not include isPartOf when post has no series', () => {
      const result = generatePostStructuredData({ post: mockBlogPost });
      const blogPosting = getBlogPosting(result);

      expect(blogPosting.isPartOf).toBeUndefined();
    });
  });

  describe('video structured data', () => {
    it('should include VideoObject when post has youTubeId', () => {
      const postWithVideo = {
        ...mockBlogPost,
        frontmatter: { ...mockBlogPost.frontmatter, youTubeId: 'abc123' },
      };
      const result = generatePostStructuredData({ post: postWithVideo });

      expect(result).toHaveLength(2);
      const videoObject = getBlogPosting([result[1]]);

      expect(videoObject['@type']).toBe('VideoObject');
      expect(videoObject.contentUrl).toContain('youtube.com/watch?v=abc123');
      expect(videoObject.embedUrl).toContain('youtube.com/embed/abc123');
      expect(videoObject.thumbnailUrl).toContain('ytimg.com');
    });

    it('should not include VideoObject when post has no youTubeId', () => {
      const result = generatePostStructuredData({ post: mockBlogPost });

      expect(result).toHaveLength(1);
    });
  });
});

describe('generateOrganizationStructuredData', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getOrgData = () => generateOrganizationStructuredData() as any;

  it('should generate valid Organization schema', () => {
    const result = getOrgData();

    expect(result['@context']).toBe('https://schema.org');
    expect(result['@type']).toBe('Organization');
  });

  it('should include organization name and URL', () => {
    const result = getOrgData();

    expect(result.name).toBe('mikebifulco.com');
    expect(result.url).toContain('mikebifulco.com');
  });

  it('should include logo as ImageObject', () => {
    const result = getOrgData();

    expect(result.logo).toBeDefined();
    expect(result.logo['@type']).toBe('ImageObject');
  });

  it('should include social media links in sameAs', () => {
    const result = getOrgData();

    expect(result.sameAs).toBeDefined();
    expect(Array.isArray(result.sameAs)).toBe(true);
    expect(result.sameAs).toContain('https://twitter.com/irreverentmike');
    expect(result.sameAs).toContain('https://github.com/mbifulco');
  });

  it('should include founder as Person', () => {
    const result = getOrgData();

    expect(result.founder).toBeDefined();
    expect(result.founder['@type']).toBe('Person');
  });
});

describe('generateWebSiteStructuredData', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getWebSiteData = () => generateWebSiteStructuredData() as any;

  it('should generate valid WebSite schema', () => {
    const result = getWebSiteData();

    expect(result['@context']).toBe('https://schema.org');
    expect(result['@type']).toBe('WebSite');
  });

  it('should include site name and URL', () => {
    const result = getWebSiteData();

    expect(result.name).toBe('Mike Bifulco');
    expect(result.url).toContain('mikebifulco.com');
  });

  it('should include alternateName', () => {
    const result = getWebSiteData();

    expect(result.alternateName).toBe('mikebifulco.com');
  });

  it('should include language', () => {
    const result = getWebSiteData();

    expect(result.inLanguage).toBe('en-US');
  });

  it('should include publisher as Organization', () => {
    const result = getWebSiteData();

    expect(result.publisher).toBeDefined();
    expect(result.publisher['@type']).toBe('Organization');
  });

  it('should include author as Person', () => {
    const result = getWebSiteData();

    expect(result.author).toBeDefined();
    expect(result.author['@type']).toBe('Person');
  });
});

describe('generateSiteStructuredData', () => {
  it('should return both Organization and WebSite schemas', () => {
    const result = generateSiteStructuredData();

    expect(result).toHaveLength(2);
  });

  it('should include Organization schema first', () => {
    const result = generateSiteStructuredData();

    expect(result[0]['@type']).toBe('Organization');
  });

  it('should include WebSite schema second', () => {
    const result = generateSiteStructuredData();

    expect(result[1]['@type']).toBe('WebSite');
  });
});

describe('generateSeriesStructuredData', () => {
  const laterPost = {
    ...mockBlogPost,
    slug: 'later-post',
    frontmatter: {
      ...mockBlogPost.frontmatter,
      title: 'Later Post',
      slug: 'later-post',
      date: '2024-03-01',
      tags: ['react', 'nextjs'],
    },
  } as unknown as BlogPost;

  const mockSeries = {
    name: 'React Tips',
    slug: 'react-tips',
    posts: [laterPost, mockBlogPost],
    newsletters: [mockNewsletter],
    length: 3,
  } as unknown as Series;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type Json = Record<string, any>;
  const result = generateSeriesStructuredData(mockSeries) as Json;

  it('should describe the page as a CollectionPage for the series', () => {
    expect(result['@context']).toBe('https://schema.org');
    expect(result['@type']).toBe('CollectionPage');
    expect(result.url).toBe('https://mikebifulco.com/series/react-tips');
    expect(result.author?.['@type']).toBe('Person');
    expect(result.publisher?.['@type']).toBe('Organization');
    expect(result.datePublished).toBe(new Date('2024-01-15').toISOString());
    expect(result.dateModified).toBe(new Date('2024-03-01').toISOString());
  });

  it('should use the series as the main entity', () => {
    expect(result.mainEntity['@type']).toBe('CreativeWorkSeries');
    expect(result.mainEntity.name).toBe('React Tips');
    expect(result.mainEntity.url).toBe(
      'https://mikebifulco.com/series/react-tips'
    );
  });

  it('should include every part as a BlogPosting in date order', () => {
    const parts = result.mainEntity.hasPart;

    expect(parts).toHaveLength(3);
    parts.forEach((part: Json, index: number) => {
      expect(part['@type']).toBe('BlogPosting');
      expect(part['@context']).toBeUndefined();
      expect(part.position).toBe(index + 1);
      expect(part.author?.['@type']).toBe('Person');
      expect(part.datePublished).toBeDefined();
    });
    expect(parts.map((part: Json) => part.headline)).toEqual([
      'Test Blog Post',
      'Test Newsletter',
      'Later Post',
    ]);
    expect(parts[0].url).toBe('https://mikebifulco.com/posts/test-blog-post');
    expect(parts[1].url).toBe(
      'https://mikebifulco.com/newsletter/test-newsletter'
    );
  });

  it('should collect keywords from all parts without duplicates', () => {
    expect(result.keywords).toBe(
      'react, typescript, newsletter, updates, nextjs'
    );
  });
});
