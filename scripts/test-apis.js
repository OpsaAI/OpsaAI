#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Test configuration
const BASE_URL = 'http://localhost:3000';
const TEST_FILE_PATH = path.join(__dirname, 'test-files', 'sample.yaml');

// Create test file if it doesn't exist
function createTestFile() {
  const testDir = path.dirname(TEST_FILE_PATH);
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }
  
  const sampleYaml = `apiVersion: v1
kind: Service
metadata:
  name: my-service
  labels:
    app: my-app
spec:
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  type: ClusterIP
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-container
        image: nginx:1.20
        ports:
        - containerPort: 8080`;

  if (!fs.existsSync(TEST_FILE_PATH)) {
    fs.writeFileSync(TEST_FILE_PATH, sampleYaml);
    console.log('✅ Created test file:', TEST_FILE_PATH);
  }
}

// Test status endpoint
async function testStatus() {
  console.log('\n🔍 Testing status endpoint...');
  try {
    const response = await fetch(`${BASE_URL}/api/status`);
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Services:', data.services);
    console.log('Stats:', data.stats);
    
    if (data.services.vectorDb === 'connected' && data.services.ollama === 'connected') {
      console.log('✅ All services are running');
      return true;
    } else {
      console.log('❌ Some services are not running');
      return false;
    }
  } catch (error) {
    console.log('❌ Status check failed:', error.message);
    return false;
  }
}

// Test upload endpoint
async function testUpload() {
  console.log('\n📤 Testing upload endpoint...');
  try {
    createTestFile();
    
    const formData = new FormData();
    const fileBuffer = fs.readFileSync(TEST_FILE_PATH);
    const file = new File([fileBuffer], 'sample.yaml', { type: 'application/x-yaml' });
    formData.append('file', file);
    
    const response = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', data);
    
    if (data.success && data.fileId) {
      console.log('✅ Upload successful');
      return data.fileId;
    } else {
      console.log('❌ Upload failed');
      return null;
    }
  } catch (error) {
    console.log('❌ Upload test failed:', error.message);
    return null;
  }
}

// Test chat endpoint
async function testChat(fileId) {
  console.log('\n💬 Testing chat endpoint...');
  try {
    const response = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileId,
        question: 'What is this Kubernetes configuration for?',
      }),
    });
    
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Answer:', data.answer);
    console.log('Chunks used:', data.chunks?.length || 0);
    
    if (data.success && data.answer) {
      console.log('✅ Chat successful');
      return true;
    } else {
      console.log('❌ Chat failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Chat test failed:', error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting API tests...');
  
  // Test status
  const statusOk = await testStatus();
  if (!statusOk) {
    console.log('\n❌ Services not ready. Please start ChromaDB and Ollama first.');
    process.exit(1);
  }
  
  // Test upload
  const fileId = await testUpload();
  if (!fileId) {
    console.log('\n❌ Upload test failed. Exiting.');
    process.exit(1);
  }
  
  // Test chat
  const chatOk = await testChat(fileId);
  if (!chatOk) {
    console.log('\n❌ Chat test failed.');
    process.exit(1);
  }
  
  console.log('\n🎉 All tests passed!');
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testStatus, testUpload, testChat, runTests };
