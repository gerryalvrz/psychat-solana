// Test script to verify Arcium connection
const { arciumChatService } = require('./lib/arcium-chat.ts');

async function testConnection() {
  console.log('🧪 Testing Arcium Connection...\n');
  
  try {
    // Initialize service
    console.log('1. Initializing Arcium service...');
    await arciumChatService.initialize();
    
    // Check network status
    console.log('2. Checking network status...');
    const status = await arciumChatService.getNetworkStatus();
    
    console.log('📊 Network Status:');
    console.log(`   Connected: ${status.isConnected ? '✅' : '❌'}`);
    console.log(`   Node Count: ${status.nodeCount}`);
    console.log(`   Network Type: ${status.isLocalnet ? 'Local' : 'Remote'}`);
    console.log(`   Last Update: ${new Date(status.lastUpdate).toLocaleString()}`);
    
    if (status.isConnected) {
      console.log('\n🎉 Arcium is CONNECTED!');
      console.log('✅ You should see:');
      console.log('   - Green "Connected" badge in UI');
      console.log('   - Real node count > 0');
      console.log('   - Real encryption/decryption');
      console.log('   - Actual MPC processing');
    } else {
      console.log('\n⚠️ Arcium is DISCONNECTED');
      console.log('📝 This means:');
      console.log('   - Using mock mode (still functional)');
      console.log('   - No real MPC encryption');
      console.log('   - Demo data only');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testConnection();
