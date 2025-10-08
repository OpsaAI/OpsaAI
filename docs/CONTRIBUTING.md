# Contributing to OpsaAI

Thank you for contributing to OpsaAI! This guide will help you get started quickly.

## 🎯 Hacktoberfest 2025

We're participating in Hacktoberfest! Look for issues labeled:
- `hacktoberfest` - Valid for Hacktoberfest
- `good first issue` - Great for beginners
- `bug` - Bug fixes
- `enhancement` - New features

## 🚀 Quick Setup (5 minutes)

### Prerequisites
- **Node.js 18+**
- **Docker** (for AI services)
- **Git**

### 1. Fork & Clone
```bash
# Fork on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/OpsaAI.git
cd OpsaAI
```

### 2. Install & Setup
```bash
# Install dependencies
pnpm install

# Setup environment (defaults work for local dev)
cp env.example .env.local

# Start AI services (Docker)
./scripts/setup-services.sh

# Start development server
pnpm dev
```

### 3. Make Changes
- Create a branch: `git checkout -b feature/your-feature`
- Make your changes
- Test locally: `pnpm test && pnpm lint`

## 📋 Submit Your Changes

### 4. Commit & Push
```bash
# Add changes
git add .

# Commit with clear message
git commit -m "feat: add new feature"

# Push to your fork
git push origin feature/your-feature
```

### 5. Create Pull Request
- Go to your fork on GitHub
- Click "New Pull Request"
- Fill out the PR template
- Reference any related issues
- Add screenshots for UI changes

## 🎨 Coding Standards

### General Guidelines
- Use TypeScript for new code
- Follow existing code style
- Write meaningful variable names
- Add comments for complex logic
- Use functional components

### Testing
- Add tests for new features
- Run `pnpm test` before submitting
- Test your changes locally

## 🐛 Bug Reports

Include:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if UI related)
- Environment details

## ✨ Feature Requests

Include:
- Clear description
- Use case and benefits
- Proposed solution
- Additional context

## 🔒 Security

- **DO NOT** open public issues for security vulnerabilities
- Email: security@opsaai.com
- Never commit secrets or API keys

## 🎉 Hacktoberfest

### Valid Contributions
- Bug fixes and features
- Documentation improvements
- Test additions
- UI/UX enhancements

### Getting Started
1. Register at [hacktoberfest.digitalocean.com](https://hacktoberfest.digitalocean.com/)
2. Find issues labeled `hacktoberfest`
3. Make contributions following our guidelines
4. Submit PRs and get them approved

## 📞 Getting Help

- **GitHub Discussions**: Ask questions
- **Issues**: Report bugs and request features
- **Discord**: [Join our community](https://discord.gg/opsaai)

## 📄 License

By contributing, you agree your contributions will be licensed under the MIT License.

---

**Thank you for contributing to OpsaAI! 🚀**
