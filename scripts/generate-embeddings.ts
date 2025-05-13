import { generateAllEmbeddings } from '../src/lib/embeddings';

async function main() {
  console.log('Starting embedding generation...');

  try {
    const embeddings = await generateAllEmbeddings();
    console.log('\n✨ Finished generating embeddings');
    console.log(`Total chunks processed: ${embeddings.length}`);
  } catch (error) {
    console.error('Error generating embeddings:', error);
    process.exit(1);
  }
}

main();
