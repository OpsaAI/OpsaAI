import { ChromaClient } from 'chromadb';
import { pipeline } from '@xenova/transformers';
import { TextChunk } from './fileParser';

// Initialize ChromaDB client
const chroma = new ChromaClient({
  path: 'http://localhost:8000', // Default ChromaDB server URL
});

// Collection name for storing file chunks
const COLLECTION_NAME = 'opsa_ai_chunks';

// Initialize embedding pipeline
let embeddingPipeline: any = null;

/**
 * Initialize the embedding pipeline
 */
async function initializeEmbeddingPipeline() {
  if (!embeddingPipeline) {
    try {
      embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    } catch (error) {
      console.error('Error initializing embedding pipeline:', error);
      throw new Error('Failed to initialize embedding model');
    }
  }
  return embeddingPipeline;
}

/**
 * Generate embeddings for text using local sentence transformer
 */
async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const pipeline = await initializeEmbeddingPipeline();
    const output = await pipeline(text, { pooling: 'mean', normalize: true });
    
    // Convert to array of numbers
    return Array.from(output.data);
  } catch (error) {
    console.error('Error generating embedding:', error);
    // Fallback: return a zero vector
    return new Array(384).fill(0);
  }
}

/**
 * Get or create the collection
 */
async function getCollection() {
  try {
    // Try to get existing collection
    let collection;
    try {
      collection = await chroma.getCollection({
        name: COLLECTION_NAME,
      });
    } catch (error) {
      // Collection doesn't exist, create it
      collection = await chroma.createCollection({
        name: COLLECTION_NAME,
      });
    }
    
    return collection;
  } catch (error) {
    console.error('Error getting collection:', error);
    throw new Error('Failed to initialize vector database');
  }
}

/**
 * Store text chunks in the vector database
 */
export async function storeChunks(fileId: string, chunks: TextChunk[]): Promise<void> {
  try {
    const collection = await getCollection();
    
    // Generate embeddings for all chunks
    const embeddings = await Promise.all(
      chunks.map(chunk => generateEmbedding(chunk.text))
    );
    
    // Prepare data for insertion
    const ids = chunks.map((_, index) => `${fileId}_${index}`);
    const documents = chunks.map(chunk => chunk.text);
    const metadatas = chunks.map(chunk => ({
      fileId,
      fileName: chunk.metadata.fileName,
      fileType: chunk.metadata.fileType,
      chunkIndex: chunk.chunkIndex,
    }));
    
    // Add to collection
    await collection.add({
      ids,
      embeddings,
      documents,
      metadatas,
    });
    
    console.log(`Stored ${chunks.length} chunks for file ${fileId}`);
  } catch (error) {
    console.error('Error storing chunks:', error);
    throw new Error('Failed to store file chunks in vector database');
  }
}

/**
 * Search for relevant chunks based on query
 */
export async function searchChunks(
  fileId: string,
  query: string,
  limit: number = 5
): Promise<TextChunk[]> {
  try {
    const collection = await getCollection();
    
    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);
    
    // Search for similar chunks
    const results = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: limit,
      where: { fileId }, // Filter by fileId
    });
    
    // Convert results to TextChunk format
    const chunks: TextChunk[] = [];
    
    if (results.documents && results.documents[0]) {
      for (let i = 0; i < results.documents[0].length; i++) {
        const document = results.documents[0][i];
        const metadata = results.metadatas?.[0]?.[i];
        
        if (document && metadata) {
          chunks.push({
            text: document as string,
            chunkIndex: (metadata.chunkIndex as number) || 0,
            metadata: {
              fileName: (metadata.fileName as string) || 'unknown',
              fileType: (metadata.fileType as string) || 'unknown',
            },
          });
        }
      }
    }
    
    return chunks;
  } catch (error) {
    console.error('Error searching chunks:', error);
    throw new Error('Failed to search for relevant chunks');
  }
}

/**
 * Delete all chunks for a specific file
 */
export async function deleteFileChunks(fileId: string): Promise<void> {
  try {
    const collection = await getCollection();
    
    // Get all chunks for this file
    const results = await collection.get({
      where: { fileId },
    });
    
    if (results.ids && results.ids.length > 0) {
      await collection.delete({
        ids: results.ids,
      });
      console.log(`Deleted ${results.ids.length} chunks for file ${fileId}`);
    }
  } catch (error) {
    console.error('Error deleting file chunks:', error);
    throw new Error('Failed to delete file chunks');
  }
}

/**
 * Get collection statistics
 */
export async function getCollectionStats(): Promise<{
  totalChunks: number;
  files: string[];
}> {
  try {
    const collection = await getCollection();
    
    const results = await collection.get({
      include: ['metadatas'],
    });
    
    const files = new Set<string>();
    if (results.metadatas) {
      results.metadatas.forEach((metadata: any) => {
        if (metadata && metadata.fileId) {
          files.add(metadata.fileId);
        }
      });
    }
    
    return {
      totalChunks: results.ids?.length || 0,
      files: Array.from(files),
    };
  } catch (error) {
    console.error('Error getting collection stats:', error);
    return {
      totalChunks: 0,
      files: [],
    };
  }
}
