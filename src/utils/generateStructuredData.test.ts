import { describe, expect, it } from 'vitest';

import type { BlogPost, Newsletter } from '@data/content-types';

import { generatePostStructuredData } from './generateStructuredData';

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
        frontmatter: { ...mockBlogPost.frontmatter, coverImagePublicId: undefined },
      } as unknown as BlogPost;
      const result = generatePostStructuredData({ post: postWithoutCover });
      const blogPosting = getBlogPosting(result);

      expect(blogPosting.image?.url).toContain('posts/test-blog-post/cover');
    });

    it('should use newsletters prefix for newsletter image fallback', () => {
      const newsletterWithoutCover = {
        ...mockNewsletter,
        frontmatter: { ...mockNewsletter.frontmatter, coverImagePublicId: undefined },
      } as unknown as Newsletter;
      const result = generatePostStructuredData({ post: newsletterWithoutCover });
      const blogPosting = getBlogPosting(result);

      expect(blogPosting.image?.url).toContain('newsletters/test-newsletter/cover');
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
