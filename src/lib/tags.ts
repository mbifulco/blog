import fs from 'fs';
import path from 'path';

import type { MarkdownDocument } from '../data/content-types';

const CACHE_FILE = path.join(
  process.cwd(),
  '.next',
  'cache',
  'tag-registry.json'
);

export const parseTag = (tag: string) => {
  return tag.split(' ').join('-').toLocaleLowerCase();
};

type TagMap = {
  [tag: string]: string[]; // tag -> array of content slugs
};

// Singleton to manage tags across the application
class TagRegistry {
  private static instance: TagRegistry;
  private tagMap: Map<string, Set<string>> = new Map(); // tag -> set of content slugs
  private initialized = false;

  private constructor() {}

  static getInstance(): TagRegistry {
    if (!TagRegistry.instance) {
      TagRegistry.instance = new TagRegistry();
    }
    return TagRegistry.instance;
  }

  private registerContentTags(content: MarkdownDocument) {
    const tags = content?.frontmatter?.tags;
    if (!tags || !Array.isArray(tags)) return;

    const slug = content.frontmatter.slug;
    if (!slug) return;

    tags.forEach((tag) => {
      if (typeof tag !== 'string') return;
      const parsedTag = parseTag(tag);
      if (!parsedTag) return;

      if (!this.tagMap.has(parsedTag)) {
        this.tagMap.set(parsedTag, new Set());
      }
      this.tagMap.get(parsedTag)?.add(slug);
    });
  }

  registerContent(content: MarkdownDocument[]) {
    content.forEach((item) => this.registerContentTags(item));
    this.initialized = true;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  getAllTags(): string[] {
    return Array.from(this.tagMap.keys()).sort();
  }

  getContentSlugsForTag(tag: string): string[] {
    const parsedTag = parseTag(tag);
    return Array.from(this.tagMap.get(parsedTag) || []);
  }

  hasTag(tag: string): boolean {
    return this.tagMap.has(parseTag(tag));
  }

  // Save the current state to disk
  saveToCache(): void {
    const cacheDir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    const serializedMap: TagMap = {};
    this.tagMap.forEach((slugs, tag) => {
      serializedMap[tag] = Array.from(slugs);
    });

    fs.writeFileSync(CACHE_FILE, JSON.stringify(serializedMap, null, 2));
  }

  // Load state from disk
  loadFromCache(): boolean {
    try {
      if (!fs.existsSync(CACHE_FILE)) {
        return false;
      }

      const data = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8')) as TagMap;
      this.tagMap.clear();

      Object.entries(data).forEach(([tag, slugs]) => {
        this.tagMap.set(tag, new Set(slugs));
      });

      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Error loading tag registry cache:', error);
      return false;
    }
  }
}

// Export functions that use the registry
export const initializeTagRegistry = async (content: MarkdownDocument[]) => {
  try {
    const registry = TagRegistry.getInstance();

    // Try to load from cache first
    if (!registry.isInitialized() && !registry.loadFromCache()) {
      // If cache doesn't exist or is invalid, rebuild and save
      registry.registerContent(content);
      registry.saveToCache();
    }
  } catch (error) {
    console.error('Error initializing tag registry:', error);
  }
};

export const getAllTags = async () => {
  try {
    const registry = TagRegistry.getInstance();
    if (!registry.isInitialized() && !registry.loadFromCache()) {
      console.warn('Tag registry accessed before initialization');
      return [];
    }
    return registry.getAllTags();
  } catch (error) {
    console.error('Error in getAllTags:', error);
    return [];
  }
};

export const getContentSlugsForTag = async (tag: string) => {
  try {
    const registry = TagRegistry.getInstance();
    if (!registry.isInitialized() && !registry.loadFromCache()) {
      console.warn('Tag registry accessed before initialization');
      return [];
    }
    return registry.getContentSlugsForTag(tag);
  } catch (error) {
    console.error('Error getting content for tag:', error);
    return [];
  }
};

export const hasTag = async (tag: string) => {
  try {
    const registry = TagRegistry.getInstance();
    if (!registry.isInitialized() && !registry.loadFromCache()) {
      console.warn('Tag registry accessed before initialization');
      return false;
    }
    return registry.hasTag(tag);
  } catch (error) {
    console.error('Error checking tag existence:', error);
    return false;
  }
};
