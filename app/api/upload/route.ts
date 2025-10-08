import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Simple file parsing functions
function parseYaml(content: string): string {
  try {
    const yaml = require('js-yaml');
    const parsed = yaml.load(content);
    return JSON.stringify(parsed, null, 2);
  } catch (error) {
    return content; // Return original if parsing fails
  }
}

function parseJson(content: string): string {
  try {
    const parsed = JSON.parse(content);
    return JSON.stringify(parsed, null, 2);
  } catch (error) {
    return content; // Return original if parsing fails
  }
}

function splitIntoChunks(text: string, fileName: string, fileType: string) {
  const targetChunkSize = 500 * 4; // 2000 characters
  const chunks = [];
  
  const paragraphs = text.split(/\n\s*\n/);
  let currentChunk = '';
  let chunkIndex = 0;
  
  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length > targetChunkSize && currentChunk.length > 0) {
      chunks.push({
        text: currentChunk.trim(),
        chunkIndex,
        metadata: { fileName, fileType },
      });
      currentChunk = paragraph;
      chunkIndex++;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
    }
  }
  
  if (currentChunk.trim().length > 0) {
    chunks.push({
      text: currentChunk.trim(),
      chunkIndex,
      metadata: { fileName, fileType },
    });
  }
  
  return chunks;
}

// Simple vector store simulation (for now)
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

async function storeChunks(fileId: string, chunks: any[]) {
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const embedding = generateSimpleEmbedding(chunk.text);
    const id = `${fileId}_${i}`;
    
    vectorStore.set(id, {
      id,
      text: chunk.text,
      embedding,
      metadata: {
        fileId,
        fileName: chunk.metadata.fileName,
        fileType: chunk.metadata.fileType,
        chunkIndex: chunk.chunkIndex,
      }
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse the multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Validate file type
    const allowedTypes = ['yaml', 'yml', 'json', 'pdf', 'dockerfile', 'txt', 'md', 'log'];
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (!extension || !allowedTypes.includes(extension)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${extension}. Allowed types: ${allowedTypes.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large: ${file.size} bytes. Maximum size: ${maxSize} bytes` },
        { status: 400 }
      );
    }
    
    // Convert file to buffer and parse
    const buffer = Buffer.from(await file.arrayBuffer());
    let content = buffer.toString('utf-8');
    
    // Parse based on file type
    const fileType = extension;
    if (fileType === 'yaml' || fileType === 'yml') {
      content = parseYaml(content);
    } else if (fileType === 'json') {
      content = parseJson(content);
    }
    
    // Split into chunks
    const chunks = splitIntoChunks(content, file.name, fileType);
    
    if (chunks.length === 0) {
      return NextResponse.json(
        { error: 'No content found in file' },
        { status: 400 }
      );
    }
    
    // Generate unique file ID
    const fileId = uuidv4();
    
    // Store chunks in vector database
    await storeChunks(fileId, chunks);
    
    // Return success response
    return NextResponse.json({
      success: true,
      fileId,
      fileName: file.name,
      fileType: fileType,
      fileSize: file.size,
      chunksCount: chunks.length,
      message: `File uploaded and processed successfully. Created ${chunks.length} chunks.`,
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to process file',
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