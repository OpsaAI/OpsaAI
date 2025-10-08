#!/usr/bin/env node

/**
 * OpsaAI Maintainer Check Script
 * 
 * This script helps you quickly check the status of your repository
 * and identify what needs attention.
 * 
 * Usage: node scripts/maintainer-check.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 OpsaAI Maintainer Check\n');

// Check if we're in a git repository
try {
  execSync('git status', { stdio: 'pipe' });
} catch (error) {
  console.log('❌ Not in a git repository');
  process.exit(1);
}

// Check repository status
console.log('📊 Repository Status:');
try {
  const status = execSync('git status --porcelain', { encoding: 'utf8' });
  if (status.trim()) {
    console.log('⚠️  Uncommitted changes detected:');
    console.log(status);
  } else {
    console.log('✅ Working directory is clean');
  }
} catch (error) {
  console.log('❌ Error checking git status');
}

// Check if we're up to date with remote
console.log('\n🔄 Remote Status:');
try {
  execSync('git fetch', { stdio: 'pipe' });
  const status = execSync('git status -uno', { encoding: 'utf8' });
  if (status.includes('Your branch is up to date')) {
    console.log('✅ Up to date with remote');
  } else {
    console.log('⚠️  Not up to date with remote');
    console.log('   Run: git pull origin main');
  }
} catch (error) {
  console.log('❌ Error checking remote status');
}

// Check for common issues
console.log('\n🔍 Common Issues Check:');

// Check if .env.local exists
if (fs.existsSync('.env.local')) {
  console.log('✅ .env.local exists');
} else {
  console.log('⚠️  .env.local not found');
  console.log('   Run: cp env.example .env.local');
}

// Check if node_modules exists
if (fs.existsSync('node_modules')) {
  console.log('✅ node_modules exists');
} else {
  console.log('⚠️  node_modules not found');
  console.log('   Run: pnpm install');
}

// Check if Docker is running
try {
  execSync('docker ps', { stdio: 'pipe' });
  console.log('✅ Docker is running');
  
  // Check if ChromaDB is running
  try {
    execSync('docker ps --filter name=chromadb', { stdio: 'pipe' });
    console.log('✅ ChromaDB container is running');
  } catch (error) {
    console.log('⚠️  ChromaDB container not running');
    console.log('   Run: docker run -d --name chromadb -p 8000:8000 chromadb/chroma:latest');
  }
  
  // Check if Ollama is running
  try {
    execSync('docker ps --filter name=ollama', { stdio: 'pipe' });
    console.log('✅ Ollama container is running');
  } catch (error) {
    console.log('⚠️  Ollama container not running');
    console.log('   Run: docker run -d --name ollama -p 11434:11434 ollama/ollama');
  }
} catch (error) {
  console.log('❌ Docker is not running');
  console.log('   Please start Docker Desktop');
}

// Check package.json for common issues
console.log('\n📦 Package Check:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Check for required fields
  const requiredFields = ['name', 'version', 'description', 'license'];
  requiredFields.forEach(field => {
    if (packageJson[field]) {
      console.log(`✅ ${field}: ${packageJson[field]}`);
    } else {
      console.log(`⚠️  Missing ${field} in package.json`);
    }
  });
  
  // Check for keywords
  if (packageJson.keywords && packageJson.keywords.length > 0) {
    console.log(`✅ Keywords: ${packageJson.keywords.length} topics`);
  } else {
    console.log('⚠️  No keywords in package.json');
  }
  
} catch (error) {
  console.log('❌ Error reading package.json');
}

// Check for common files
console.log('\n📁 Required Files Check:');
const requiredFiles = [
  'README.md',
  'LICENSE',
  'CONTRIBUTING.md',
  'CODE_OF_CONDUCT.md',
  'SECURITY.md',
  'CHANGELOG.md',
  'env.example',
  '.gitignore'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ Missing ${file}`);
  }
});

// Check GitHub workflows
console.log('\n🤖 GitHub Workflows Check:');
const workflowDir = '.github/workflows';
if (fs.existsSync(workflowDir)) {
  const workflows = fs.readdirSync(workflowDir);
  if (workflows.length > 0) {
    console.log(`✅ ${workflows.length} workflow(s) found:`);
    workflows.forEach(workflow => {
      console.log(`   - ${workflow}`);
    });
  } else {
    console.log('⚠️  No workflows found');
  }
} else {
  console.log('❌ .github/workflows directory not found');
}

// Check for common security issues
console.log('\n🔒 Security Check:');
try {
  // Check for .env files in git
  const gitFiles = execSync('git ls-files', { encoding: 'utf8' });
  if (gitFiles.includes('.env')) {
    console.log('⚠️  .env file is tracked in git (should be in .gitignore)');
  } else {
    console.log('✅ .env file not tracked in git');
  }
  
  // Check for common secrets patterns
  const commonSecrets = ['password', 'secret', 'key', 'token'];
  const allFiles = execSync('git ls-files', { encoding: 'utf8' }).split('\n');
  
  let foundSecrets = false;
  allFiles.forEach(file => {
    if (file && fs.existsSync(file)) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        commonSecrets.forEach(secret => {
          if (content.toLowerCase().includes(secret) && 
              content.includes('=') && 
              !content.includes('example') &&
              !content.includes('placeholder')) {
            console.log(`⚠️  Potential secret in ${file}: ${secret}`);
            foundSecrets = true;
          }
        });
      } catch (error) {
        // Skip binary files
      }
    }
  });
  
  if (!foundSecrets) {
    console.log('✅ No obvious secrets found in tracked files');
  }
} catch (error) {
  console.log('❌ Error checking for secrets');
}

// Summary
console.log('\n📋 Summary:');
console.log('This script checks common issues that maintainers should be aware of.');
console.log('For more detailed maintenance, see MAINTAINER_GUIDE.md');
console.log('\n🚀 Next steps:');
console.log('1. Fix any issues marked with ⚠️ or ❌');
console.log('2. Run: pnpm test (if tests exist)');
console.log('3. Run: pnpm build (to check build)');
console.log('4. Check GitHub Actions status');
console.log('5. Review open issues and PRs');

console.log('\n✨ Happy maintaining!');
