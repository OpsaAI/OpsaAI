import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai';
import { appConfig } from '@/lib/config';

// Simple vector store simulation (same as upload route)
// Use global variable to persist data between requests
declare global {
  var vectorStore: Map<string, any>;
}

if (!global.vectorStore) {
  global.vectorStore = new Map();
}

const vectorStore = global.vectorStore;

function generateSimpleEmbedding(text: string): number[] {
  const hash = text.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const embedding = new Array(384).fill(0);
  for (let i = 0; i < 384; i++) {
    embedding[i] = Math.sin(hash + i) * 0.1;
  }
  
  return embedding;
}

function searchChunks(fileId: string, query: string, limit: number = 5) {
  const queryEmbedding = generateSimpleEmbedding(query);
  const results = [];
  
  for (const [id, chunk] of vectorStore.entries()) {
    if (chunk.metadata.fileId === fileId) {
      // Simple similarity calculation (cosine similarity)
      const similarity = calculateSimilarity(queryEmbedding, chunk.embedding);
      results.push({ ...chunk, similarity });
    }
  }
  
  // Sort by similarity and return top results
  return results
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map(chunk => ({
      text: chunk.text,
      chunkIndex: chunk.metadata.chunkIndex,
      metadata: {
        fileName: chunk.metadata.fileName,
        fileType: chunk.metadata.fileType,
      }
    }));
}

function calculateSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  if (normA === 0 || normB === 0) return 0;
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function POST(request: NextRequest) {
  try {
    const { fileId, question } = await request.json();
    
    if (!fileId || !question) {
      return NextResponse.json(
        { error: 'fileId and question are required' },
        { status: 400 }
      );
    }
    
    // Get file content from vector store
    const fileData = vectorStore.get(fileId);
    
    if (!fileData) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }
    
    // Check if this is a question about the file itself
    const lowerQuestion = question.toLowerCase();
    const isFileQuestion = lowerQuestion.includes('file') || 
                          lowerQuestion.includes('filename') || 
                          lowerQuestion.includes('type') || 
                          lowerQuestion.includes('what is') ||
                          lowerQuestion.includes('analyze') ||
                          lowerQuestion.includes('explain') ||
                          lowerQuestion.includes('guide') ||
                          lowerQuestion.includes('help');
    
    let aiResponse;
    
    if (isFileQuestion) {
      // Use infrastructure analysis for file-related questions
      aiResponse = await aiService.analyzeInfrastructure(fileData.content, fileData.filename);
    } else {
      // Use chat for general questions
      const systemPrompt = `You are OpsaAI, an AI-powered Infrastructure Assistant. 
      
File: ${fileData.filename}
Content: ${fileData.content.substring(0, 2000)}...

User Question: ${question}

Please provide a helpful response based on the file content.`;
      
      aiResponse = await aiService.generateText(systemPrompt, 1000);
    }
    
    return NextResponse.json({
      success: true,
      answer: aiResponse.content,
      filename: fileData.filename,
      fileType: fileData.filename.split('.').pop(),
      provider: aiResponse.provider,
      isMock: aiResponse.isMock,
    });
    
  } catch (error) {
    console.error('Chat error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}