import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { ContentTypes } from '../data/content-types';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Type for our embedding data
export type ContentEmbedding = {
  id: string;
  type: typeof ContentTypes[keyof typeof ContentTypes];
  title: string;
  slug: string;
  content: string;
  embedding: number[];
  date: string;
  tags?: string[];
  sectionTitle?: string;
  parentTitles?: string[];
};

/**
 * Generates an embedding for a given text using OpenAI's API
 */
const generateEmbedding = async (text: string): Promise<number[]> => {
  try {
    console.log(`Generating embedding for text (${text.length} chars)...`);
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    console.log('✅ Embedding generated successfully');
    return response.data[0].embedding;
  } catch (error) {
    console.error('❌ Error generating embedding:', error);
    throw error;
  }
}

/**
 * Splits content into sections based on markdown headings
 */
const splitIntoSections = (content: string): Array<{ title: string; content: string }> => {
  const sections: Array<{ title: string; content: string }> = [];
  const lines = content.split('\n');
  let currentSection = { title: '', content: '' };

  for (const line of lines) {
    // Check if line is a heading
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      // If we have content in the current section, save it
      if (currentSection.content.trim()) {
        sections.push({ ...currentSection });
      }
      // Start new section
      currentSection = {
        title: headingMatch[2],
        content: line + '\n'
      };
    } else {
      currentSection.content += line + '\n';
    }
  }

  // Add the last section
  if (currentSection.content.trim()) {
    sections.push(currentSection);
  }

  return sections;
};

/**
 * Splits a section into smaller chunks if it's too long
 */
const splitLongSection = (
  section: { title: string; content: string },
  maxTokens: number = 1000
): Array<{ title: string; content: string }> => {
  const chunks: Array<{ title: string; content: string }> = [];
  const paragraphs = section.content.split('\n\n');
  let currentChunk = { title: section.title, content: '' };

  for (const paragraph of paragraphs) {
    // If adding this paragraph would make the chunk too long, save current chunk and start new one
    if ((currentChunk.content + paragraph).length > maxTokens) {
      if (currentChunk.content.trim()) {
        chunks.push({ ...currentChunk });
      }
      currentChunk = { title: section.title, content: paragraph };
    } else {
      currentChunk.content += (currentChunk.content ? '\n\n' : '') + paragraph;
    }
  }

  // Add the last chunk
  if (currentChunk.content.trim()) {
    chunks.push(currentChunk);
  }

  return chunks;
};

/**
 * Processes a single MDX file and generates its embeddings
 */
const processMdxFile = async (
  filePath: string,
  type: typeof ContentTypes[keyof typeof ContentTypes]
): Promise<ContentEmbedding[]> => {
  console.log(`\n📄 Processing file: ${filePath}`);
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const { data: frontmatter, content } = matter(fileContent);
  console.log(`- Title: ${frontmatter.title}`);
  console.log(`- Type: ${type}`);
  console.log(`- Content length: ${content.length} characters`);

  // Split content into sections
  const sections = splitIntoSections(content);
  console.log(`- Found ${sections.length} sections`);

  // Process each section
  const embeddings: ContentEmbedding[] = [];

  for (const [index, section] of sections.entries()) {
    console.log(`\n  📑 Processing section ${index + 1}/${sections.length}: "${section.title}"`);
    // Split long sections into smaller chunks
    const chunks = splitLongSection(section);
    console.log(`  - Split into ${chunks.length} chunks`);

    // Create embeddings for each chunk
    for (const [chunkIndex, chunk] of chunks.entries()) {
      console.log(`    📝 Processing chunk ${chunkIndex + 1}/${chunks.length}`);
      // Include metadata and context with each chunk
      const textToEmbed = [
        `Title: ${frontmatter.title}`,
        frontmatter.tags ? `Tags: ${frontmatter.tags.join(', ')}` : '',
        frontmatter.excerpt ? `Excerpt: ${frontmatter.excerpt}` : '',
        `Section: ${chunk.title}`,
        chunk.content
      ].filter(Boolean).join('\n\n');

      const embedding = await generateEmbedding(textToEmbed);

      embeddings.push({
        id: `${frontmatter.slug}-${chunk.title}`,
        type,
        title: frontmatter.title,
        slug: frontmatter.slug,
        content: chunk.content,
        embedding,
        date: frontmatter.date.toString(),
        tags: frontmatter.tags,
        sectionTitle: chunk.title
      });
    }
  }

  console.log(`\n✅ Finished processing ${filePath}`);
  console.log(`- Generated ${embeddings.length} embeddings total`);
  return embeddings;
};

/**
 * Generates embeddings for all MDX content in the specified directory
 */
const generateEmbeddingsForDirectory = async (
  directory: string,
  type: typeof ContentTypes[keyof typeof ContentTypes]
): Promise<ContentEmbedding[]> => {
  console.log(`\n📂 Processing directory: ${directory}`);
  const files = await fs.readdir(directory);
  const mdxFiles = files.filter(file => file.endsWith('.mdx'));
  console.log(`- Found ${mdxFiles.length} MDX files`);

  const allEmbeddings: ContentEmbedding[] = [];

  for (const [index, file] of mdxFiles.entries()) {
    console.log(`\n[${index + 1}/${mdxFiles.length}] Processing ${file}`);
    const filePath = path.join(directory, file);
    try {
      const embeddings = await processMdxFile(filePath, type);
      allEmbeddings.push(...embeddings);
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error);
    }
  }

  console.log(`\n✅ Finished processing directory: ${directory}`);
  console.log(`- Generated ${allEmbeddings.length} embeddings total`);
  return allEmbeddings;
};

/**
 * Main function to generate embeddings for all content
 */
export const generateAllEmbeddings = async (): Promise<ContentEmbedding[]> => {
  console.log('\n🚀 Starting embedding generation...');
  const postsDir = path.join(process.cwd(), 'src/data/posts');
  const newslettersDir = path.join(process.cwd(), 'src/data/newsletters');

  console.log('📂 Directories:');
  console.log(`- Posts: ${postsDir}`);
  console.log(`- Newsletters: ${newslettersDir}`);

  const [postEmbeddings, newsletterEmbeddings] = await Promise.all([
    generateEmbeddingsForDirectory(postsDir, ContentTypes.Post),
    generateEmbeddingsForDirectory(newslettersDir, ContentTypes.Newsletter),
  ]);

  const allEmbeddings = [...postEmbeddings, ...newsletterEmbeddings];

  // Save embeddings to a JSON file
  const outputPath = path.join(process.cwd(), 'src/data/embeddings.json');
  console.log(`\n💾 Saving embeddings to: ${outputPath}`);
  await fs.writeFile(outputPath, JSON.stringify(allEmbeddings, null, 2));
  console.log(`✅ Saved ${allEmbeddings.length} embeddings`);

  return allEmbeddings;
}

/**
 * Loads existing embeddings from the JSON file
 */
export const loadEmbeddings = async (): Promise<ContentEmbedding[]> => {
  const filePath = path.join(process.cwd(), 'src/data/embeddings.json');
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error loading embeddings:', error);
    return [];
  }
}

/**
 * Normalizes a vector to unit length
 */
const normalizeVector = (vector: number[]): number[] => {
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return vector.map(val => val / magnitude);
};

/**
 * Calculates cosine similarity between two vectors
 */
const cosineSimilarity = (a: number[], b: number[]): number => {
  const normalizedA = normalizeVector(a);
  const normalizedB = normalizeVector(b);
  return normalizedA.reduce((sum, val, i) => sum + val * normalizedB[i], 0);
};

/**
 * Search through content using semantic similarity
 */
export const semanticSearch = async (
  query: string,
  options: {
    limit?: number;
    type?: typeof ContentTypes[keyof typeof ContentTypes];
    minScore?: number;
  } = {}
): Promise<Array<ContentEmbedding & { score: number }>> => {
  const { limit = 5, type, minScore = 0.3 } = options;

  console.log('Searching with query:', query);
  console.log('Search options:', { limit, type, minScore });

  // Generate embedding for the query
  const queryEmbedding = await generateEmbedding(query);
  console.log('Generated query embedding of length:', queryEmbedding.length);

  // Load all embeddings
  const embeddings = await loadEmbeddings();
  console.log('Loaded embeddings:', embeddings.length);

  // Filter by type if specified
  const filteredEmbeddings = type
    ? embeddings.filter(embedding => embedding.type === type)
    : embeddings;
  console.log('Filtered embeddings:', filteredEmbeddings.length);

  // Calculate similarity scores
  const scoredResults = filteredEmbeddings
    .map(embedding => ({
      ...embedding,
      score: cosineSimilarity(queryEmbedding, embedding.embedding),
    }))
    .sort((a, b) => b.score - a.score);

  // Log closest match and top 10 scores before filtering
  console.log('Closest match:', {
    title: scoredResults[0]?.title,
    score: scoredResults[0]?.score.toFixed(4),
    threshold: minScore,
    difference: scoredResults[0] ? (scoredResults[0].score - minScore).toFixed(4) : 'N/A'
  });

  console.log('Top 10 scores before filtering:',
    scoredResults.slice(0, 10).map(r => ({
      title: r.title,
      score: r.score.toFixed(4)
    }))
  );

  const results = scoredResults
    .filter(result => result.score >= minScore)
    .slice(0, limit);

  console.log('Search results after filtering:', {
    totalResults: results.length,
    scores: results.map(r => ({
      title: r.title,
      score: r.score.toFixed(4)
    })),
  });

  return results;
};

/**
 * Search through content using semantic similarity and return formatted results
 */
export const searchContent = async (
  query: string,
  options: {
    limit?: number;
    type?: typeof ContentTypes[keyof typeof ContentTypes];
    minScore?: number;
  } = {}
): Promise<Array<{
  title: string;
  slug: string;
  type: typeof ContentTypes[keyof typeof ContentTypes];
  score: number;
  excerpt: string;
}>> => {
  console.log('searchContent called with query:', query);
  const results = await semanticSearch(query, { ...options, limit: options.limit || 15 });
  console.log('semanticSearch returned results:', results.length);

  // Group results by title and take the highest scoring result for each title
  const groupedResults = results.reduce((acc, result) => {
    const existingResult = acc.find(r => r.title === result.title);
    if (!existingResult || result.score > existingResult.score) {
      // Remove existing result if it exists
      const filteredAcc = acc.filter(r => r.title !== result.title);
      // Add new result
      return [...filteredAcc, {
        title: result.title,
        slug: result.slug,
        type: result.type,
        score: result.score,
        excerpt: result.content.slice(0, 200) + '...',
      }];
    }
    return acc;
  }, [] as Array<{
    title: string;
    slug: string;
    type: typeof ContentTypes[keyof typeof ContentTypes];
    score: number;
    excerpt: string;
  }>);

  console.log('Grouped results:', groupedResults);
  return groupedResults;
};
