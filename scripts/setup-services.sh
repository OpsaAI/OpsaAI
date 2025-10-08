#!/bin/bash

echo "🚀 Setting up OpsaAI services..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    echo "   Download Docker: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Start ChromaDB (Vector Database)
echo "📦 Starting ChromaDB..."
if docker ps | grep -q chromadb; then
    echo "✅ ChromaDB is already running"
else
    docker run -d \
      --name chromadb \
      -p 8000:8000 \
      -v chroma_data:/chroma/chroma \
      chromadb/chroma:latest
    
    echo "⏳ Waiting for ChromaDB to start..."
    sleep 10
fi

# Start Ollama (AI Model)
echo "🤖 Starting Ollama..."
if docker ps | grep -q ollama; then
    echo "✅ Ollama is already running"
else
    docker run -d \
      --name ollama \
      -p 11434:11434 \
      -v ollama:/root/.ollama \
      ollama/ollama
    
    echo "⏳ Waiting for Ollama to start..."
    sleep 10
    
    echo "📥 Downloading llama3 model (this may take a few minutes)..."
    docker exec ollama ollama pull llama3
fi

echo ""
echo "🎉 Setup complete! Services running:"
echo "   - ChromaDB: http://localhost:8000"
echo "   - Ollama: http://localhost:11434"
echo ""
echo "Next steps:"
echo "   1. Start the app: pnpm dev"
echo "   2. Open: http://localhost:3000"
echo "   3. Upload a file and start chatting!"
