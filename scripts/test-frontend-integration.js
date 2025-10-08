const fs = require('fs');
const path = require('path');

// Test the frontend integration
async function testFrontendIntegration() {
  console.log('🚀 Testing frontend integration...\n');
  
  const baseUrl = 'http://localhost:3001';
  
  try {
    // 1. Test status endpoint
    console.log('1️⃣ Testing status endpoint...');
    const statusResponse = await fetch(`${baseUrl}/api/status`);
    const statusData = await statusResponse.json();
    console.log('✅ Status:', statusData);
    
    // 2. Test chat sessions endpoint
    console.log('\n2️⃣ Testing chat sessions endpoint...');
    const sessionsResponse = await fetch(`${baseUrl}/api/chat/sessions`);
    const sessionsData = await sessionsResponse.json();
    console.log('✅ Sessions:', sessionsData);
    
    // 3. Upload a test file
    console.log('\n3️⃣ Testing file upload...');
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
    
    // 4. Test chat with the uploaded file
    console.log('\n4️⃣ Testing chat functionality...');
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
    console.log('Answer:', chatData.answer.substring(0, 200) + '...');
    console.log('Chunks used:', chatData.chunksUsed);
    
    // 5. Test chat history creation
    console.log('\n5️⃣ Testing chat history creation...');
    const historyResponse = await fetch(`${baseUrl}/api/chat/history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: 'test-session-123',
        sessionName: 'Test Session',
        messages: [
          { role: 'user', content: 'Hello' },
          { role: 'assistant', content: 'Hi there!' }
        ],
        files: []
      }),
    });
    
    const historyData = await historyResponse.json();
    console.log('✅ History creation:', historyData.success ? 'Success' : 'Failed');
    
    console.log('\n🎉 Frontend integration test completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Open http://localhost:3001/chat in your browser');
    console.log('2. Upload a file using the file upload component');
    console.log('3. Ask questions about the uploaded file');
    console.log('4. The AI should respond with context from your file');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testFrontendIntegration();
