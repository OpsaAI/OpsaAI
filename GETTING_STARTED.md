# Getting Started with OpsaAI

This guide will help you get OpsaAI running locally in just a few minutes.

## 🚀 Quick Start (5 minutes)

### Prerequisites
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Docker** - [Download here](https://www.docker.com/products/docker-desktop)
- **Git** - [Download here](https://git-scm.com/)

### Step 1: Clone the Repository
```bash
git clone https://github.com/OpsaAI/OpsaAI.git
cd OpsaAI
```

### Step 2: Install Dependencies
```bash
pnpm install
# or if you don't have pnpm: npm install
```

### Step 3: Setup Environment
```bash
cp env.example .env.local
# The default values work for local development, no changes needed!
```

### Step 4: Start AI Services
```bash
./scripts/setup-services.sh
```
This will:
- Start ChromaDB (vector database) in Docker
- Start Ollama (AI model) in Docker  
- Download the llama3 AI model

### Step 5: Start the Application
```bash
pnpm dev
```

### Step 6: Use the App
1. Open [http://localhost:3000](http://localhost:3000)
2. Go to the Chat page
3. Upload a YAML, JSON, or Dockerfile
4. Ask questions about your infrastructure!

## 🎯 What You Can Do

### Upload Files
- **YAML files** - Kubernetes configs, Docker Compose, Ansible
- **JSON files** - API specs, configuration files
- **Dockerfile** - Container definitions
- **PDF files** - Documentation
- **Text files** - Logs, scripts

### Ask Questions
- "What resources are defined in this file?"
- "Are there any security issues?"
- "How can I optimize this configuration?"
- "What does this Dockerfile do?"

## 🔧 Troubleshooting

### Services Not Starting
```bash
# Check if Docker is running
docker ps

# Restart services
docker restart chromadb ollama
```

### App Not Loading
```bash
# Check if services are running
curl http://localhost:8000/api/v1/heartbeat  # ChromaDB
curl http://localhost:11434/api/tags         # Ollama

# Check app logs
pnpm dev
```

### AI Not Responding
```bash
# Check if llama3 model is available
docker exec ollama ollama list

# Re-download model if needed
docker exec ollama ollama pull llama3
```

## 🛠️ Development

### Project Structure
```
OpsaAI/
├── app/           # Next.js pages and API routes
├── components/    # React components  
├── lib/          # Utilities and configurations
├── scripts/      # Setup scripts
└── public/       # Static assets
```

### Key Files
- `app/chat/page.tsx` - Main chat interface
- `app/api/upload/route.ts` - File upload API
- `app/api/chat/route.ts` - Chat API
- `lib/vectorStore.ts` - ChromaDB integration
- `lib/fileParser.ts` - File parsing logic

### Making Changes
1. Edit the code
2. The app will auto-reload
3. Test your changes
4. Submit a PR

## 📚 Next Steps

- Read the [Contributing Guide](CONTRIBUTING.md)
- Check out [GitHub Issues](https://github.com/OpsaAI/OpsaAI/issues) for things to work on
- Join our [Discord Community](https://discord.gg/opsaai)
- Star the repository if you like it!

## 🆘 Need Help?

- **GitHub Issues**: [Report bugs or ask questions](https://github.com/OpsaAI/OpsaAI/issues)
- **Discord**: [Join our community](https://discord.gg/opsaai)
- **Documentation**: Check the [README](README.md) for more details

---

**Happy coding! 🚀**
