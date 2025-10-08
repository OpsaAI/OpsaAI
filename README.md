# OpsaAI - An AI Powered Cloud Infra Buddy

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Hacktoberfest 2025](https://img.shields.io/badge/Hacktoberfest-2025-orange.svg)](https://hacktoberfest.com/)
[![Open Source](https://img.shields.io/badge/Open%20Source-Yes-blue.svg)](https://github.com/OpsaAI/OpsaAI)

> AI-powered platform for analyzing cloud infrastructure files with intelligent chat assistance and visualization.

![opsa-ai-gif](https://github.com/user-attachments/assets/7c690567-245a-402a-a186-19be5372af02)


## What is OpsaAI?

OpsaAI helps developers analyze their infrastructure files using AI. Upload your files, ask questions, and get intelligent insights about your cloud infrastructure.

### Key Features

- **File Analysis**: Upload and analyze YAML, JSON, Dockerfile, PDF files
- **AI Chat**: Ask questions about your infrastructure files
- **Visualization**: See your infrastructure in interactive diagrams
- **Log Analysis**: AI-powered log file analysis
- **Security Insights**: Get security recommendations

## Tech Stack

- **Next.js 15** + **TypeScript** - Frontend
- **Ollama** - Local AI model (Docker)
- **ChromaDB** - Vector database (Docker)
- **Tailwind CSS** - Styling

## Quick Start

### Prerequisites
- Node.js 18+
- Docker (for AI services)

### Setup
```bash
# Clone and install
git clone https://github.com/OpsaAI/OpsaAI.git
cd OpsaAI
pnpm install

# Setup environment
cp env.example .env.local

# Start AI services
./scripts/setup-services.sh

# Start the app
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and start analyzing your infrastructure files!

## How to Use

1. **Upload Files**: Go to `/chat` and upload your infrastructure files
2. **Ask Questions**: Chat with AI about your uploaded files
3. **Get Insights**: Receive security, performance, and optimization recommendations

## Supported File Types

- **YAML/YML** - Kubernetes, Docker Compose, Ansible
- **JSON** - Configuration files, API specs  
- **Dockerfile** - Container definitions
- **PDF** - Documentation and reports
- **Text** - Logs, scripts, documentation

## Contributing

We welcome contributions! Perfect for **Hacktoberfest 2025**.

### Hacktoberfest 2025
- Look for issues labeled `hacktoberfest` or `good first issue`
- Fork the repo, make changes, and submit a PR
- Read our [Contributing Guide](docs/CONTRIBUTING.md)

### Contribution Areas

#### Frontend Development
- **UI Components**: Improve existing components or add new ones
- **Responsive Design**: Make the app work better on mobile/tablet
- **Dark Mode**: Enhance the dark theme implementation
- **Accessibility**: Improve keyboard navigation and screen reader support

#### Backend Development
- **API Routes**: Add new endpoints or improve existing ones
- **File Processing**: Support for more file types (XML, CSV, etc.)
- **Error Handling**: Better error messages and validation
- **Performance**: Optimize database queries and API responses

#### AI & ML Features
- **Model Integration**: Add support for other AI models
- **Prompt Engineering**: Improve AI responses and accuracy
- **Vector Search**: Enhance file search and retrieval
- **Custom Models**: Add support for custom trained models

#### Documentation
- **API Documentation**: Add OpenAPI/Swagger documentation
- **User Guides**: Create step-by-step tutorials
- **Code Comments**: Improve code documentation
- **Video Tutorials**: Create demo videos

#### Testing & Quality
- **Unit Tests**: Add tests for components and utilities
- **Integration Tests**: Test API endpoints and workflows
- **E2E Tests**: Add Cypress or Playwright tests
- **Performance Tests**: Add load testing and optimization

#### DevOps & Infrastructure
- **Docker**: Improve Docker setup and multi-stage builds
- **CI/CD**: Add GitHub Actions workflows
- **Monitoring**: Add logging and error tracking
- **Deployment**: Add deployment guides for various platforms

### Quick Steps
1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Commit: `git commit -m 'Add your feature'`
5. Push: `git push origin feature/your-feature`
6. Open a Pull Request

## Project Structure
```
OpsaAI/
├── app/           # Next.js pages and API routes
├── components/    # React components
├── lib/          # Utilities and configurations
├── scripts/      # Setup scripts
└── public/       # Static assets
```

## Deployment Options

### Option 1: Vercel (Recommended for Demo)
1. **Fork this repository**
2. **Connect to Vercel**: Import your fork
3. **Deploy**: Automatic deployment with mock AI
4. **Result**: Live demo with realistic responses

### Option 2: With Hugging Face AI (Free)
1. **Get API Key**: Sign up at [Hugging Face](https://huggingface.co/settings/tokens)
2. **Add Environment Variable**: `HUGGINGFACE_API_KEY=your-key`
3. **Deploy**: Same as Option 1
4. **Result**: Full AI features with 30k free requests/month

### Option 3: Local Development (Full Features)
1. **Install Docker**: For Ollama and ChromaDB
2. **Run Setup**: `./scripts/setup-services.sh`
3. **Start App**: `pnpm dev`
4. **Result**: Complete AI features locally

## Development Commands
```bash
pnpm dev         # Start development server
pnpm build       # Build for production
pnpm lint        # Check code style
pnpm start       # Start production server
```

## License
MIT License - see [LICENSE](LICENSE) file

## Support
- **Issues**: [GitHub Issues](https://github.com/OpsaAI/OpsaAI/issues)
- **Email**: contact51xneeraj@gmail.com

---

<div align="center">

**Made with ❤️ by the OpsaAI Team**

[⭐ Star us on GitHub](https://github.com/OpsaAI/OpsaAI) • [🐛 Report Issues](https://github.com/OpsaAI/OpsaAI/issues)

</div>
