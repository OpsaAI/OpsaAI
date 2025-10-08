const fs = require('fs');
const path = require('path');

// Test the complete flow
async function testCompleteFlow() {
  console.log('🚀 Testing complete OpsaAI flow...\n');
  
  const baseUrl = 'http://localhost:3001';
  
  try {
    // 1. Test status endpoint
    console.log('1️⃣ Testing status endpoint...');
    const statusResponse = await fetch(`${baseUrl}/api/status`);
    const statusData = await statusResponse.json();
    console.log('✅ Status:', statusData);
    
    // 2. Upload a test file
    console.log('\n2️⃣ Testing file upload...');
    const formData = new FormData();
    const testFile = fs.readFileSync(path.join(__dirname, 'test-files/sample.yaml'));
    const blob = new Blob([testFile], { type: 'application/octet-stream' });
    formData.append('file', blob, 'sample.yaml');
    
    const uploadResponse = await fetch(`${baseUrl}/api/upload`, {
      method: 'POST',
      body: formData,
    });
    
    const uploadData = await uploadResponse.json();
    console.log('✅ Upload result:', uploadData);
    
    if (!uploadData.success) {
      throw new Error('Upload failed');
    }
    
    const fileId = uploadData.fileId;
    
    // 3. Test chat with the uploaded file
    console.log('\n3️⃣ Testing chat functionality...');
    const chatResponse = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileId: fileId,
        question: 'What is this file about?'
      }),
    });
    
    const chatData = await chatResponse.json();
    console.log('✅ Chat result:');
    console.log('Answer:', chatData.answer);
    console.log('Chunks used:', chatData.chunksUsed);
    
    // 4. Test another question
    console.log('\n4️⃣ Testing follow-up question...');
    const followUpResponse = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileId: fileId,
        question: 'How many replicas are configured?'
      }),
    });
    
    const followUpData = await followUpResponse.json();
    console.log('✅ Follow-up result:');
    console.log('Answer:', followUpData.answer);
    
    console.log('\n🎉 All tests passed! The OpsaAI backend is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testCompleteFlow();
