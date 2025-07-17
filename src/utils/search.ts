import type { BlogPost } from '@data/content-types';

export type SearchResult = {
  post: BlogPost;
  snippet: string;
  matchType: 'title' | 'content' | 'excerpt' | 'tags';
};

/**
 * Extract text content from MDX, removing markdown syntax
 */
function extractTextFromMDX(content: string): string {
  return content
    // Remove frontmatter
    .replace(/^---[\s\S]*?---\n/, '')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`[^`]*`/g, '')
    // Remove links but keep text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    // Remove images
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '')
    // Remove headings markdown
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic
    .replace(/\*\*([^*]*)\*\*/g, '$1')
    .replace(/\*([^*]*)\*/g, '$1')
    // Remove line breaks and extra spaces
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Create a snippet from content around a search term
 */
function createSnippet(content: string, searchTerm: string, maxLength: number = 150): string {
  const lowerContent = content.toLowerCase();
  const lowerTerm = searchTerm.toLowerCase();
  const index = lowerContent.indexOf(lowerTerm);
  
  if (index === -1) {
    return content.substring(0, maxLength) + (content.length > maxLength ? '...' : '');
  }
  
  const start = Math.max(0, index - 50);
  const end = Math.min(content.length, index + searchTerm.length + 50);
  
  let snippet = content.substring(start, end);
  
  if (start > 0) {
    snippet = '...' + snippet;
  }
  if (end < content.length) {
    snippet = snippet + '...';
  }
  
  return snippet;
}

/**
 * Check if a string contains all search terms (fuzzy matching)
 */
function fuzzyMatch(text: string, searchTerms: string[]): boolean {
  const lowerText = text.toLowerCase();
  return searchTerms.every(term => lowerText.includes(term.toLowerCase()));
}

/**
 * Search through blog posts and return ranked results
 */
export function searchPosts(posts: BlogPost[], query: string): SearchResult[] {
  if (!query.trim()) {
    return [];
  }
  
  const searchTerms = query.trim().split(/\s+/);
  const results: SearchResult[] = [];
  
  for (const post of posts) {
    const searchResults: SearchResult[] = [];
    
    // Search in title (highest priority)
    if (fuzzyMatch(post.frontmatter.title, searchTerms)) {
      searchResults.push({
        post,
        snippet: post.frontmatter.title,
        matchType: 'title',
      });
    }
    
    // Search in excerpt
    if (post.frontmatter.excerpt && fuzzyMatch(post.frontmatter.excerpt, searchTerms)) {
      searchResults.push({
        post,
        snippet: createSnippet(post.frontmatter.excerpt, query),
        matchType: 'excerpt',
      });
    }
    
    // Search in tags
    if (post.frontmatter.tags) {
      const tagsText = post.frontmatter.tags.join(' ');
      if (fuzzyMatch(tagsText, searchTerms)) {
        searchResults.push({
          post,
          snippet: `Tags: ${post.frontmatter.tags.join(', ')}`,
          matchType: 'tags',
        });
      }
    }
    
    // Search in content (lowest priority, only if not found elsewhere)
    if (searchResults.length === 0) {
      const textContent = extractTextFromMDX(post.content);
      if (fuzzyMatch(textContent, searchTerms)) {
        searchResults.push({
          post,
          snippet: createSnippet(textContent, query),
          matchType: 'content',
        });
      }
    }
    
    // Add the first (highest priority) match for this post
    if (searchResults.length > 0) {
      results.push(searchResults[0]);
    }
  }
  
  // Sort results by match type priority
  const priorityOrder = { title: 0, excerpt: 1, tags: 2, content: 3 };
  
  return results.sort((a, b) => {
    const priorityDiff = priorityOrder[a.matchType] - priorityOrder[b.matchType];
    if (priorityDiff !== 0) {
      return priorityDiff;
    }
    
    // Secondary sort by date (newer first)
    return new Date(b.post.frontmatter.date).getTime() - new Date(a.post.frontmatter.date).getTime();
  });
}

/**
 * Generate URL with text highlighting
 * Uses Chrome's text fragment feature: https://web.dev/text-fragments/
 */
export function createHighlightedURL(slug: string, searchTerm: string): string {
  const baseUrl = `/posts/${slug}`;
  if (!searchTerm.trim()) {
    return baseUrl;
  }
  
  // Encode the search term for URL
  const encodedTerm = encodeURIComponent(searchTerm.trim());
  return `${baseUrl}#:~:text=${encodedTerm}`;
}