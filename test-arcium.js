// Test script for Arcium integration
const { arciumChatService } = require('./lib/arcium-chat.ts');

async function testArciumIntegration() {
  console.log('🧪 Testing Arcium Integration...\n');
  
  try {
    // Initialize the service
    console.log('1. Initializing Arcium service...');
    await arciumChatService.initialize();
    
    // Check network status
    console.log('2. Checking network status...');
    const networkStatus = await arciumChatService.getNetworkStatus();
    console.log('Network Status:', networkStatus);
    
    // Test encryption
    console.log('3. Testing message encryption...');
    const testMessage = 'Hello, I need help with my anxiety and stress management.';
    const encryptedMessage = await arciumChatService.encryptMessage(testMessage, 'test-user');
    console.log('Encrypted Message:', encryptedMessage);
    
    // Test MPC processing
    console.log('4. Testing MPC processing...');
    const analysis = await arciumChatService.processEncryptedChat([encryptedMessage]);
    console.log('MPC Analysis:', analysis);
    
    console.log('\n✅ Arcium integration test completed successfully!');
    
  } catch (error) {
    console.error('❌ Arcium integration test failed:', error);
  }
}

// Run the test
testArciumIntegration();
