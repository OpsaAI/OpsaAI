# 🧠 OpsaAI - AI-Powered Infrastructure Analysis

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Hacktoberfest](https://img.shields.io/badge/Hacktoberfest-friendly-orange.svg)](https://hacktoberfest.digitalocean.com/)
[![Open Source](https://img.shields.io/badge/Open%20Source-Yes-blue.svg)](https://github.com/OpsaAI/OpsaAI)

> AI-powered platform for analyzing cloud infrastructure files with intelligent chat assistance and visualization.

## 🌟 What is OpsaAI?

OpsaAI helps developers analyze their infrastructure files (YAML, JSON, Dockerfile, etc.) using AI. Upload your files, ask questions, and get intelligent insights about your cloud infrastructure.

### 🚀 Key Features

- **📁 File Analysis**: Upload and analyze YAML, JSON, Dockerfile, PDF files
- **💬 AI Chat**: Ask questions about your infrastructure files
- **📊 Visualization**: See your infrastructure in interactive diagrams
- **📋 Log Analysis**: AI-powered log file analysis
- **🔒 Security Insights**: Get security recommendations

## 🛠️ Tech Stack

- **Next.js 14** + **TypeScript** - Frontend
- **Ollama** - Local AI model (Docker)
- **ChromaDB** - Vector database (Docker)
- **Tailwind CSS** - Styling

## 🚀 Quick Start

**New to OpsaAI?** Check out our [Getting Started Guide](GETTING_STARTED.md) for a detailed walkthrough.

### Prerequisites
- **Node.js 18+**
- **Docker** (for AI services)

### Quick Setup
```bash
# Clone and install
git clone https://github.com/OpsaAI/OpsaAI.git
cd OpsaAI
pnpm install

# Setup environment (defaults work fine)
cp env.example .env.local

# Start AI services
./scripts/setup-services.sh

# Start the app
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and start analyzing your infrastructure files!

## 🎯 How to Use

1. **Upload Files**: Go to `/chat` and upload your infrastructure files
2. **Ask Questions**: Chat with AI about your uploaded files
3. **Get Insights**: Receive security, performance, and optimization recommendations

## 📁 Supported File Types

- **YAML/YML** - Kubernetes, Docker Compose, Ansible
- **JSON** - Configuration files, API specs  
- **Dockerfile** - Container definitions
- **PDF** - Documentation and reports
- **Text** - Logs, scripts, documentation

## 🔧 Development

### Local Development Setup
```bash
# Install dependencies
pnpm install

# Start AI services (Docker)
./scripts/setup-services.sh

# Start development server
pnpm dev
```

### Environment Variables
Copy `env.example` to `.env.local` and configure:
- `OLLAMA_BASE_URL` - Ollama service URL (default: http://localhost:11434)
- `CHROMA_SERVER_HOST` - ChromaDB host (default: localhost)
- `CHROMA_SERVER_PORT` - ChromaDB port (default: 8000)

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### 🎯 Hacktoberfest 2024
- Look for issues labeled `hacktoberfest` or `good first issue`
- Fork the repo, make changes, and submit a PR
- Read our [Contributing Guide](CONTRIBUTING.md)

### Quick Contribution Steps
1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Commit: `git commit -m 'Add your feature'`
5. Push: `git push origin feature/your-feature`
6. Open a Pull Request

## 🏗️ Project Structure
```
OpsaAI/
├── app/           # Next.js pages and API routes
├── components/    # React components
├── lib/          # Utilities and configurations
├── scripts/      # Setup scripts
└── public/       # Static assets
```

## 🧪 Testing
```bash
pnpm test        # Run tests
pnpm lint        # Check code style
pnpm build       # Build for production
```

## 📄 License
MIT License - see [LICENSE](LICENSE) file

## 📞 Support
- **Issues**: [GitHub Issues](https://github.com/OpsaAI/OpsaAI/issues)
- **Discussions**: [GitHub Discussions](https://github.com/OpsaAI/OpsaAI/discussions)

---

<div align="center">

**Made with ❤️ by the OpsaAI Team**

[⭐ Star us on GitHub](https://github.com/OpsaAI/OpsaAI) • [🐛 Report Issues](https://github.com/OpsaAI/OpsaAI/issues)

</div>
