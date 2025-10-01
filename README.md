# OpsaAI - An AI Powered Cloud Infra Buddy

![OpsaAIonline-video-cutter com-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/238e4d14-001c-4c46-9475-9224b43073a5)


**OpsaAI** is an AI-powered platform that analyzes configuration files (YAML, JSON, Terraform, Dockerfiles, etc.) and provides **actionable insights, explanations, and recommendations**.
It’s built for **developers, DevOps engineers, and cloud architects** who want to understand, secure, and optimize their infrastructure configurations effortlessly.

## About

OpsaAI makes analyzing complex configuration files simple by providing:

* **AI-Powered Explanations** – Understand what each configuration does.
* **Security Recommendations** – Detect potential vulnerabilities.
* **Performance Tips** – Suggestions to optimize your infra setup.
* **Interactive Chat** – Ask questions about your configs, get contextual answers.

## How It Works

1. **Upload a File** → YAML, JSON, Terraform, or Dockerfile.
2. **Chat with AI** → Ask about purpose, security, or optimization opportunities.
3. **Get Insights** → Receive actionable feedback powered by AI.

## Features

* **File Upload**: Upload and analyze configuration files.
* **AI-Powered Chat**: Interactive Q&A on uploaded files.
* **Security Analysis**: Spot vulnerabilities & risks.
* **Performance Recommendations**: Optimize configs for efficiency.
* **Session Management**: Save & retrieve chat history.
* **Supported File Types**: YAML, JSON, Dockerfiles, Terraform, and more.

## Technical Stack

### **Frontend**

* Framework → **Next.js**
* UI Components → **Radix UI**, **Heroicons**, **Phosphor Icons**

### **Backend**

* Framework → **Next.js API Routes**
* AI Integration → **Ollama (LLaMA 3)**, **Google Generative AI**

### **Database**

* **Postgres (NeonDB)** → for authentication, user management, file uploads, and chat history
* **ChromaDB** → vector storage for embeddings

### **AI**

* Model → **LLaMA 3 via Ollama**
* Embeddings → **Sentence Transformers**

### **Deployment**

* Containerized with **Docker**
* **Ollama** runs local AI inference

## Who Can Use OpsaAI?

* **Developers** → Debug and understand config files.
* **DevOps Engineers** → Optimize infra and fix security gaps.
* **Cloud Architects** → Analyze, improve, and document configs.

## Getting Started

### Prerequisites

* [Docker](https://www.docker.com/) (for ChromaDB & Ollama)
* [Node.js](https://nodejs.org/) (for Next.js app)
* [Ollama](https://ollama.ai/) (for local model inference)

### Quick Start (Local Development)

1. **Clone the Repository**

   ```bash
   git clone https://github.com/OpsaAI/OpsaAI.git
   cd OpsaAI
   ```

2. **Install Dependencies**

   ```bash
   pnpm install
   ```

3. **Start Backend Services**

   #### macOS/Linux

   ```bash
   ./scripts/setup-services.sh
   ```

   #### Windows

   * Install Docker Desktop & ensure it’s running.
   * Start services manually:

     ```bash
     docker run -d --name chromadb -p 8000:8000 chromadb/chroma:latest
     ollama serve &
     ollama pull llama3
     ```

4. **Start Development Server**

   ```bash
   npm run dev
   ```

5. **Access the App**

   * Main App → [http://localhost:3001](http://localhost:3001)
   * Chat Page → [http://localhost:3001/chat](http://localhost:3001/chat)


## First Things to Try

1. Upload a **YAML/JSON file**.
2. Ask the AI → “What does this config do?” or “Any security risks here?”
3. Explore → Try session history & optimization tips.

## 🤝 Contributing

We welcome contributions from the community! 

### How to Contribute

* Fork the repo
* Create a feature branch (`git checkout -b feature-name`)
* Commit changes (`git commit -m "Added new feature"`)
* Push and open a Pull Request

### Contribution Ideas

* Add support for more file formats
* Improve AI prompts & context
* Enhance UI/UX
* Write docs & tutorials

## License

OpsaAI is open-source and licensed under the **The MIT License**.


## 💡 Inspiration

Our goal with OpsaAI is to make working with **infra-as-code** less intimidating and more intelligent with AI-powered assistance.

Enjoy using OpsaAI! 
