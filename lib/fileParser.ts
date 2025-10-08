import * as yaml from 'js-yaml';
import * as pdf from 'pdf-parse';

export interface ParsedFile {
  content: string;
  metadata: {
    fileName: string;
    fileType: string;
    size: number;
  };
}

export interface TextChunk {
  text: string;
  chunkIndex: number;
  metadata: {
    fileName: string;
    fileType: string;
  };
}

/**
 * Parse different file types and extract text content
 */
export async function parseFile(
  buffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<ParsedFile> {
  const fileType = getFileType(fileName, mimeType);
  
  let content: string;
  
  try {
    switch (fileType) {
      case 'yaml':
      case 'yml':
        content = await parseYaml(buffer);
        break;
      case 'json':
        content = await parseJson(buffer);
        break;
      case 'pdf':
        content = await parsePdf(buffer);
        break;
      case 'dockerfile':
      case 'txt':
      default:
        content = buffer.toString('utf-8');
        break;
    }
  } catch (error) {
    throw new Error(`Failed to parse file ${fileName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return {
    content,
    metadata: {
      fileName,
      fileType,
      size: buffer.length,
    },
  };
}

/**
 * Split text into chunks of approximately 500 tokens
 */
export function splitIntoChunks(text: string, fileName: string, fileType: string): TextChunk[] {
  // Rough estimation: 1 token ≈ 4 characters
  const targetChunkSize = 500 * 4; // 2000 characters
  const chunks: TextChunk[] = [];
  
  // Split by paragraphs first, then by sentences if needed
  const paragraphs = text.split(/\n\s*\n/);
  
  let currentChunk = '';
  let chunkIndex = 0;
  
  for (const paragraph of paragraphs) {
    // If adding this paragraph would exceed the target size, finalize current chunk
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
  
  // Add the last chunk if it has content
  if (currentChunk.trim().length > 0) {
    chunks.push({
      text: currentChunk.trim(),
      chunkIndex,
      metadata: { fileName, fileType },
    });
  }
  
  // If we have chunks that are still too large, split them further by sentences
  const finalChunks: TextChunk[] = [];
  for (const chunk of chunks) {
    if (chunk.text.length <= targetChunkSize) {
      finalChunks.push(chunk);
    } else {
      const sentences = chunk.text.split(/(?<=[.!?])\s+/);
      let currentSentenceChunk = '';
      let sentenceChunkIndex = 0;
      
      for (const sentence of sentences) {
        if (currentSentenceChunk.length + sentence.length > targetChunkSize && currentSentenceChunk.length > 0) {
          finalChunks.push({
            text: currentSentenceChunk.trim(),
            chunkIndex: chunk.chunkIndex * 1000 + sentenceChunkIndex,
            metadata: chunk.metadata,
          });
          currentSentenceChunk = sentence;
          sentenceChunkIndex++;
        } else {
          currentSentenceChunk += (currentSentenceChunk ? ' ' : '') + sentence;
        }
      }
      
      if (currentSentenceChunk.trim().length > 0) {
        finalChunks.push({
          text: currentSentenceChunk.trim(),
          chunkIndex: chunk.chunkIndex * 1000 + sentenceChunkIndex,
          metadata: chunk.metadata,
        });
      }
    }
  }
  
  return finalChunks;
}

/**
 * Parse YAML file
 */
async function parseYaml(buffer: Buffer): Promise<string> {
  const yamlContent = buffer.toString('utf-8');
  const parsed = yaml.load(yamlContent);
  return JSON.stringify(parsed, null, 2);
}

/**
 * Parse JSON file
 */
async function parseJson(buffer: Buffer): Promise<string> {
  const jsonContent = buffer.toString('utf-8');
  const parsed = JSON.parse(jsonContent);
  return JSON.stringify(parsed, null, 2);
}

/**
 * Parse PDF file
 */
async function parsePdf(buffer: Buffer): Promise<string> {
  const data = await pdf.default(buffer);
  return data.text;
}

/**
 * Determine file type from filename and MIME type
 */
function getFileType(fileName: string, mimeType: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  // Check by MIME type first
  if (mimeType.includes('yaml') || mimeType.includes('yml')) return 'yaml';
  if (mimeType.includes('json')) return 'json';
  if (mimeType.includes('pdf')) return 'pdf';
  if (mimeType.includes('text/plain')) return 'txt';
  
  // Check by file extension
  switch (extension) {
    case 'yaml':
    case 'yml':
      return 'yaml';
    case 'json':
      return 'json';
    case 'pdf':
      return 'pdf';
    case 'dockerfile':
    case 'Dockerfile':
      return 'dockerfile';
    case 'txt':
    case 'md':
    case 'log':
      return 'txt';
    default:
      return 'txt';
  }
}

/**
 * Validate file type and size
 */
export function validateFile(fileName: string, mimeType: string, size: number): void {
  const allowedTypes = ['yaml', 'yml', 'json', 'pdf', 'dockerfile', 'txt', 'md', 'log'];
  const fileType = getFileType(fileName, mimeType);
  
  if (!allowedTypes.includes(fileType)) {
    throw new Error(`Unsupported file type: ${fileType}. Allowed types: ${allowedTypes.join(', ')}`);
  }
  
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (size > maxSize) {
    throw new Error(`File too large: ${size} bytes. Maximum size: ${maxSize} bytes`);
  }
}
