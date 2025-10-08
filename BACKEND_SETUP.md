# OpsaAI Backend Setup

This document explains how to set up the backend services for the OpsaAI Chat module.

## Prerequisites

1. **Docker** - For running ChromaDB
2. **Ollama** - For running the LLM locally
3. **Node.js** - Already installed for Next.js

## Quick Setup

Run the setup script to start all services:

```bash
./scripts/setup-services.sh
```

## Manual Setup

### 1. Start ChromaDB

```bash
docker run -d \
  --name chromadb \
  -p 8000:8000 \
  -v chroma_data:/chroma/chroma \
  chromadb/chroma:latest
```

### 2. Install and Start Ollama

1. Install Ollama from [https://ollama.ai/](https://ollama.ai/)
2. Start the service:
   ```bash
   ollama serve
   ```
3. Pull the llama3 model:
   ```bash
   ollama pull llama3
   ```

### 3. Start Next.js Development Server

```bash
npm run dev
```

## API Endpoints

### Upload File
- **POST** `/api/upload`
- **Body**: `multipart/form-data` with `file` field
- **Response**: `{ fileId, fileName, fileType, chunksCount }`

### Chat
- **POST** `/api/chat`
- **Body**: `{ fileId: string, question: string }`
- **Response**: `{ answer: string, chunks: array }`

### Status Check
- **GET** `/api/status`
- **Response**: Service status and statistics

## Supported File Types

- **YAML/YML** - Parsed and converted to JSON
- **JSON** - Formatted for readability
- **PDF** - Text extracted using pdf-parse
- **Dockerfile** - Read as plain text
- **TXT/MD/LOG** - Read as plain text

## File Processing

1. Files are validated for type and size (max 10MB)
2. Content is extracted based on file type
3. Text is split into chunks (~500 tokens each)
4. Chunks are embedded using sentence-transformers
5. Embeddings are stored in ChromaDB

## Troubleshooting

### ChromaDB Issues
- Check if Docker is running: `docker ps`
- Check ChromaDB logs: `docker logs chromadb`
- Restart ChromaDB: `docker restart chromadb`

### Ollama Issues
- Check if Ollama is running: `curl http://localhost:11434/api/tags`
- Check available models: `ollama list`
- Install llama3: `ollama pull llama3`

### Vector Store Issues
- Check ChromaDB connection: `curl http://localhost:8000/api/v1/heartbeat`
- Check collection stats: Visit `/api/status`

## Development Notes

- ChromaDB runs on port 8000
- Ollama runs on port 11434
- Next.js runs on port 3000
- Vector embeddings use the `all-MiniLM-L6-v2` model
- Chat uses the `llama3` model via Ollama

## File Structure

```
lib/
├── fileParser.ts    # File parsing and chunking logic
└── vectorStore.ts   # ChromaDB operations

app/api/
├── upload/route.ts  # File upload endpoint
├── chat/route.ts    # Chat endpoint
└── status/route.ts  # Service status endpoint
```
