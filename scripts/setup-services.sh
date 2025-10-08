#!/bin/bash

echo "🚀 Setting up OpsaAI services..."

# Check if Ollama is installed and running
echo "🤖 Checking Ollama..."
if command -v ollama &> /dev/null; then
    echo "✅ Ollama is installed"
    
    # Check if Ollama service is running
    if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
        echo "✅ Ollama is running"
        
        # Check if llama3 model is available
        if ollama list | grep -q "llama3"; then
            echo "✅ llama3 model is available"
        else
            echo "📥 Downloading llama3 model (this may take a few minutes)..."
            ollama pull llama3
        fi
    else
        echo "❌ Ollama is not running. Please start Ollama:"
        echo "   - macOS: brew services start ollama"
        echo "   - Linux: sudo systemctl start ollama"
        echo "   - Windows: Start Ollama from Start Menu"
        exit 1
    fi
else
    echo "❌ Ollama is not installed. Please install Ollama first:"
    echo "   Visit: https://ollama.ai/download"
    exit 1
fi

# Check if Docker is running for ChromaDB
echo "📦 Checking ChromaDB..."
if ! docker info > /dev/null 2>&1; then
    echo "⚠️  Docker is not running. ChromaDB will use in-memory storage."
    echo "   For persistent storage, start Docker and run:"
    echo "   docker run -d --name chromadb -p 8000:8000 chromadb/chroma:latest"
else
    # Start ChromaDB (Vector Database)
    if docker ps | grep -q chromadb; then
        echo "✅ ChromaDB is already running"
    else
        echo "📦 Starting ChromaDB..."
        docker run -d \
          --name chromadb \
          -p 8000:8000 \
          -v chroma_data:/chroma/chroma \
          chromadb/chroma:latest
        
        echo "⏳ Waiting for ChromaDB to start..."
        sleep 10
    fi
fi

echo ""
echo "🎉 Setup complete! Services running:"
echo "   - Ollama: http://localhost:11434 (llama3 model)"
if docker ps | grep -q chromadb; then
    echo "   - ChromaDB: http://localhost:8000"
else
    echo "   - ChromaDB: In-memory storage (no persistence)"
fi
echo ""
echo "Next steps:"
echo "   1. Start the app: pnpm dev"
echo "   2. Open: http://localhost:3000"
echo "   3. Upload a file and start chatting!"
